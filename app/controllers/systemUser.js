const models = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const sequelize = require("sequelize");
const op = sequelize.Op;

module.exports = {
  create: async (req, res, next) => {
    try {
      const user = req.body;
      const createdUser = await models.user.save({
        ...user,
        admin: true,
        verified: true,
      });
      return res.json({
        data: createdUser,
        error: false,
        response: "System user created successfully",
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email: userEmail, password } = req.body;

      const userData = await models.user.findByEmailAndPassword(
        userEmail,
        password
      );

      if (!userData) {
        throw new Error(true);
      }

      const { id, email, firstName, lastName, admin, disabled, verified } =
        userData;
      let payload = {
        id,
        email,
        firstName,
        lastName,
        admin,
        disabled,
        verified,
      };
      const AccessToken = await generateAccessToken(payload);
      delete userData["dataValues"]["password"];
      return res.json({
        data: userData,
        error: false,
        token: AccessToken,
      });
    } catch (error) {
      if (error.message) {
        error["statusCode"] = 400;
        error["message"] = "Invalid email/password provided";
      }
      next(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      console.log({ userId: req.user });

      const passwordUpdated = await models.user.updatePassword(
        req.user,
        newPassword,
        oldPassword
      );

      if (!passwordUpdated) {
        throw new Error(true);
      }

      return res.json({
        data: null,
        error: false,
        response: "Password updated successfully",
      });
    } catch (error) {
      if (error.message) {
        error["statusCode"] = 400;
        error["message"] = "Invalid old password provided";
      }
      console.log(error);
      next(error);
    }
  },
  makeAdmin: async (req, res, next) => {
    try {
      const { userId } = req.params;
      console.log("userId", userId);
      // can toogle admin access
      if (req.user == userId) {
        return res.json({
          error: true,
          response: "Cannot update admin rights of your own account.",
        });
      }

      const userInfo = await models.user.findByPk(userId);
      let message =
        userInfo.admin === true
          ? "Admin rights revoked."
          : "Admin rights granted.";

      if (userInfo) {
        await models.user.update(
          {
            admin: !userInfo.admin,
          },
          {
            where: { id: userInfo.id },
          }
        );
      }

      return res.json({
        data: null,
        error: false,
        response: message,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  // for admin panel
  usersList: async (req, res, next) => {
    try {
      let users = await models.user.findAll({
        attributes: ["id", "email", "firstName", "lastName", "publicUrl"],
        include: [{ model: models.userProfile, required: true }],
        where: {
          admin: false,
          id: {
            [op.ne]: req.user,
          },
        },
      });

      return res.json({
        data: users,
        error: false,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await models.user.destroy({
        where: {
          admin: false,
          id: {
            [op.and]: {
              [op.ne]: req.user,
              [op.eq]: parseInt(req.params.userId),
            },
          },
        },
        force: true,
      });

      return res.json({
        data: null,
        error: false,
        response: "user deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
