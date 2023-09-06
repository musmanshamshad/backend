const jwt = require("jsonwebtoken");
const models = require("../models");
module.exports = {
  auth: async function (req, res, next) {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        data: null,
        response: "Please provide token.",
        error: true,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      // console.log(decoded);
      req.user = decoded.id;

      let userInfo = await models.user.findByPk(decoded.id, {
        include: models.userProfile,
      });

      if (!userInfo) {
        return res
          .status(400)
          .json({
            data: null,
            response: "User account suspended.Please contact admin.",
            error: true,
          });
      }
      userInfo = userInfo.toJSON();
      req.email = userInfo.email;
      req.disabled = userInfo.disabled;
      req.admin = userInfo.admin;
      if (
        userInfo.userProfile &&
        userInfo.userProfile.gradeLevelId 
        // &&
        // userInfo.userProfile.curriculumId
      ) {
        const { gradeLevelId, curriculumId } = userInfo.userProfile;
        req.gradeLevelId = gradeLevelId;
        // req.curriculumId = curriculumId;
      }
      userInfo.role && (req.role = userInfo.role);

      next();
    } catch (error) {
      console.error("error", error.message);
      return res.status(400).json({
        data: null,
        response: "Invalid token provided",
        error: true,
      });
    }
  },
  admin: (req, res, next) => {
    const { admin } = req;
    if (!admin || (admin && admin == false)) {
      return res.status(403).json({
        data: null,
        response: "Admin Protected route",
        error: true,
      });
    }
    next();
  },
};
