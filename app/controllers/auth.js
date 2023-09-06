// "/resend-verification",
// "/verify-email"

const models = require("../../models");
const helpers = require("../../utils/helpers");
const errorFormatter = require("../../utils/errorFormatter");
const templates = require("../../utils/emailTemplates");
const mailer = require("../../utils/mailer");
const constants = require("../../constants");
const randtoken = require("rand-token");
const moment = require("moment");
const { hashSync } = require("bcrypt");
const checkEmail = async (req, res, next) => {
  try {
    let email = req.params.email;

    if (!helpers.validateEmail(email)) {
      return next(
        errorFormatter(
          "email",
          "notNull Violation",
          "Please provide not null valid email address"
        )
      );
    }

    const userFound = await models.user.findOne({
      where: { email },
      attributes: ["email", "id"],
    });
    if (userFound) {
      const error = new Error();
      error.message = "Email address already been taken.";
      error.statusCode = 400;
      return next(error);
    }

    return res.json({
      data: null,
      error: false,
      response: "Ready to be registered.",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!helpers.validateEmail(email)) {
      return next(
        errorFormatter(
          "email",
          "notNull Violation",
          "Please provide not null valid email address"
        )
      );
    }

    const userFound = await models.user.findOne({
      where: { email },
      attributes: ["email", "id"],
    });
    if (!userFound) {
      const error = new Error();
      error.message = "Email address not found.";
      error.statusCode = 404;
      return next(error);
    }

    // generate token here

    const token = randtoken.generate(20);
    const resetUrl =
      process.env.hostname === "localhost"
        ? `http://${process.env.hostname}:3000/auth/reset-password?token=${token}`
        : `${process.env.hostname}?token=${token}`;

    // send email  with reset password link
    await mailer.send(
      email,
      constants.RESETPASSWORD,
      templates.reset_link_template(resetUrl)
    );

    await models.user.update(
      {
        passResetToken: token,
        passResetRequestedAt: new Date(),
      },
      {
        where: {
          id: userFound.id,
        },
      }
    );
    return res.json({
      data: resetUrl,
      error: false,
      response: "Email containing the reset link sent to your email address.",
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const validate_forgotpassword = (req, res, next) => {
  console.log("req.body", req.body);
  const { token } = req.body;

  models.user
    .findOne({
      where: { passResetToken: token },
      attributes: ["id", "passResetToken", "passResetRequestedAt"],
    })
    .then((response) => {
      if (response != null) {
        const { passResetRequestedAt, id } = response;
        const time_difference = moment(new Date()).diff(
          moment(passResetRequestedAt),
          "hours"
        ); // 0
        if (time_difference >= 1) {
          return res.status(400).json({
            response:
              "Token is expired, please request again for new password token",
            error: true,
          });
        }

        const { passResetToken } = response;

        if (passResetToken === token) {
          return res.json({
            error: false,
            response: "Request verified",
            data: id,
          });
        } else {
          return res.status(400).json({
            response: "Request cannot be verified, Invalid Parameters",
            error: true,
          });
        }
      } else {
        return res.status(400).json({
          response: "Request cannot be verified",
          error: true,
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        response: "Request cannot be verified",
        error: true,
      });
    });
};

const updatePassword = (req, res, next) => {
  const { token, id } = req.body;

  models.user
    .findOne({
      where: { passResetToken: token, id },
      attributes: ["id", "passResetToken", "passResetRequestedAt"],
    })
    .then((response) => {
      if (response != null) {
        const { passResetRequestedAt, passResetToken } = response;

        if (passResetToken) {
          const time_difference = moment(new Date()).diff(
            moment(passResetRequestedAt),
            "hours"
          );
          if (time_difference >= 1) {
            return res.status(400).json({
              response:
                "Token is expired, please request again for new password token",
              error: true,
            });
          } else {
            const { password, c_password } = req.body;
            if (password.length < 8) {
              return res.status(400).json({
                response: "Password length should be atleast 8",
                error: true,
              });
            } else if (password !== c_password) {
              return res.status(400).json({
                response: "Passwords must be same",
                error: true,
              });
            }

            const updateFields = {
              passResetToken: null,
              passResetRequestedAt: null,
              password: hashSync(password, 10),
            };
            models.user
              .update(updateFields, {
                where: {
                  id,
                  passResetToken: token,
                },
                returning: true,
              })
              .then((updatedUser) => {
                return res.json({
                  error: false,
                  response: "Password is updated, you can proceed to login",
                });
              })
              .catch((e) => {
                return res.json(400).json({
                  response: "Request cannot be verified, Invalid Parameters",
                  error: true,
                });
              });
          }
        } else {
          return res.status(400).json({
            response: "No password reset code found",
            error: true,
          });
        }
      } else {
        return res.status(400).json({
          response: "Request cannot be verified, Invalid Parameters",
          error: true,
        });
      }
    });
};
module.exports = {
  checkEmail,
  forgotPassword,
  validate_forgotpassword,
  updatePassword,
};
