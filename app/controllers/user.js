const models = require("../../models");
const sequelize = require("sequelize");
const op = sequelize.Op;
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const { s3Imageupload: imageUploader } = require("../../utils/fileUploader");
const payloadValidator = require("../../utils/payloadValidator");
const { UserProfile } = require("../../utils/reqPayloads");
const errorFormatter = require("../../utils/errorFormatter");
const moment = require("moment");
const { datesCalculator } = require("../../utils/dumpStatsData");

module.exports = {
  create: async (req, res, next) => {
    let userId = null;

    try {
      const user = req.body;
      const { errors } = payloadValidator(user, UserProfile.create.params);
      if (errors.length > 0) {
        return res.status(400).json({
          data: null,
          error: true,
          customErrors: errors,
          response: "validation error(s)",
        });
      }
      const createdUser = await models.user.save(user);
      userId = createdUser.id;
      await Promise.all([
        models.userProfile.save({
          ...user,
          userId: createdUser.id,
        }),
        models.stat.bulkCreate(
          datesCalculator().map((time) => {
            return {
              userId: createdUser.id,
              hours: 0,
              day: moment(time).format("dddd"),
            };
          })
        ),
      ]);

      return res.json({
        data: createdUser,
        error: false,
        response: "user created successfully",
      });
    } catch (e) {
      console.log(e);
      if (userId) {
        console.log({ userId });
        await models.user.destroy({ where: { id: userId }, force: true });
      }
      next(e);
    }
  },
  createSystemUser: async (req, res, next) => {
    let userId = null;

    try {
      const user = req.body;
      const createdUser = await models.user.save({
        ...user,
        admin: true,
        verified: true,
      });
      userId = createdUser.id;

      return res.json({
        data: createdUser,
        error: false,
        response: "System user created successfully",
      });
    } catch (e) {
      console.log(e);
      if (userId) {
        console.log({ userId });
        await models.user.destroy({ where: { id: userId }, force: true });
      }
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
      console.log(userData);
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
      console.log("================", error.message);
      next(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

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
  me: async (req, res, next) => {
    try {
      const { user } = req;
      const userData = await models.user.findByPk(user, {
        attributes: { exclude: ["password", "deletedAt", "updatedAt"] },
        // raw: true,
        include: [
          models.inProgress,
          models.stat,
          {
            model: models.userProfile,
            include: [
              {
                model: models.gradeLevel,
                attributes: ["title", "id"],
              },
              {
                model: models.curriculum,
                attributes: ["title", "id"],
              },
            ],
          },
        ],
      });

      return res.json({
        data: userData,
        error: false,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changeRole: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({
          error: true,
          response: "Please Provide valid userId",
        });
      }

      await models.user.update(
        {
          admin: true,
          verified: true,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      return res.json({
        error: false,
        response: "Admin Level access granted to user",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  uploadUserImage: async (req, res, next) => {
    try {
      const { image } = req.body;

      if (!image) {
        const error = new Error();
        error.statusCode = 400;
        error.message = "Please provide a valid image.";
        throw error;
      }
      imageUploader(image)
        .then(async (uploadedAsset) => {
          const { key, location } = uploadedAsset;
          const updatedProfile = await models.user.update(
            {
              publicUrl: location,
              publicKey: key,
            },
            {
              where: {
                id: req.user,
              },
              returning: true,
            }
          );
          return res.json({
            error: false,
            response: updatedProfile,
          });
        })
        .catch((e) => {
          throw new Error(e);
        });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const allowedAttribs = [
        "schoolName",
        "phone",
        "country",
        "city",
        "gradeLevelId",
        "curriculumId",
        "fname",
        "lname",
      ];

      // check for role and build a where clause

      const where = { id: req.user };
      const { admin } = req;
      if (admin) {
        const { errors } = payloadValidator(req.body, ["userId"]);
        if (errors.length > 0) {
          return res.status(400).json({
            data: null,
            error: true,
            customErrors: errors,
            response: "validation error(s)",
          });
        }
        const isUserFound = await models.user.findByPk(req.body.userId, {
          attributes: ["id"],
        });
        if (!isUserFound) {
          return next(
            errorFormatter("userId", "Invalid userId", "User not found")
          );
        }
        where.id = req.body.userId;
      }
      const profilePayload = {};
      const userPayload = {};

      allowedAttribs.forEach((attrib) => {
        if (req.body[attrib]) {
          if (["fname", "lname"].includes(attrib)) {
            if (attrib === "fname") {
              userPayload["firstName"] = req.body[attrib];
            } else {
              userPayload["lastName"] = req.body[attrib];
            }
          } else {
            profilePayload[attrib] = req.body[attrib];
          }
        }
      });
      const requests = [];
      if (Object.keys(userPayload).length) {
        requests.push(
          models.user.update(userPayload, {
            where: { id: where.id },
          })
        );
      }

      if (Object.keys(profilePayload).length) {
        requests.push(
          models.userProfile.update(profilePayload, {
            where: { userId: where.id },
          })
        );
      }

      let data = {};
      Promise.all(requests)
        .then((updatedData) => {
          if (updatedData[0]) {
            data = { ...updatedData[0] };
          }

          if (updatedData[1]) {
            data = { ...updatedData[1] };
          }
          return res.json({
            data: { ...userPayload, ...profilePayload },
            error: false,
            response: "user profile updated successfully",
          });
        })
        .catch((err) => next(err));
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  dasboardStats: async (req, res, next) => {
    try {
      const visitedCourses = await models.inProgress.findAll({
        attributes: ["id"],
        where: {
          userId: req.user,
        },
      });

      const completed = visitedCourses.filter((item) => item.completed);
      const inProgress = visitedCourses.filter((item) => !item.completed);

      return res.json({
        data: {
          coursesCompleted: completed.length,
          coursesInProgress: inProgress.length,
        },
        error: false,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  // for  client app
  emailList: async (req, res, next) => {
    try {
      let users = await models.user.findAll({
        attributes: ["id", "email", "firstName", "lastName", "publicUrl"],
        include: [models.userProfile],
        where: {
          admin: false,
          id: {
            [op.ne]: req.user,
          },
        },
      });

      users = users.map((user) => {
        console.log(user.userProfile);
        const city =
          user.userProfile !== null && user.userProfile.city
            ? user.userProfile.city
            : "";
        const country =
          user.userProfile !== null && user.userProfile.country
            ? user.userProfile.country
            : "";

        return {
          id: user.id,
          name: user.firstName + " " + user.lastName,
          email: user.email,
          imgPath: user.publicUrl,
          address: `${city} ${country}`,
        };
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
  saveStats: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.body;
      const data = await models.stat.findOne({
        where: {
          updatedAt: {
            [op.between]: [
              moment().startOf("day").format(),
              moment().endOf("day").format(),
            ],
          },
          userId: req.user,
        },
      });

      if (data) {
        await data.update({
          hours: data.hours + moment(endDate).diff(startDate, "hours", true),
        });
      } else {
        await models.stat.create({
          userId: req.user,
          day: moment().format("dddd"),
          hours: moment(endDate).diff(startDate, "hours", true),
        });
      }

      return res.json({
        data,
        error: false,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
