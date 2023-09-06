"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      models.user.hasOne(models.userProfile, { foreignKey: "userId" });
      models.user.hasMany(models.lastVisited);
      models.user.hasMany(models.inProgress);
      models.user.hasMany(models.fcardStack);
      models.user.hasMany(models.UserLearningObjective);
      models.user.hasMany(models.stat);
    }

    async comparePassword(hashedPass, password) {
      try {
        return await bcrypt.compare(password, hashedPass);
      } catch (error) {
        return error;
      }
    }

    static async save(user) {
      const createdUser = await this.create(
        {
          ...user,
        },
        { fields: ["email", "password", "firstName", "lastName"] }
      );
      return createdUser;
    }

    static async updatePassword(userId, newPassword, oldPassword) {
      const userData = await this.findByPk(userId);
      if (userData) {
        let passwordMatched = await userData.comparePassword(
          userData.password,
          oldPassword
        );
        if (passwordMatched) {
          const salt = await bcrypt.genSalt(10);
          newPassword = await bcrypt.hash(newPassword, salt);
          await this.update(
            {
              password: newPassword,
            },
            {
              where: { id: userData.id },
            }
          );

          return true;
        }
      }

      return false;
    }

    static async findByEmailAndPassword(email, password) {
      const isUserExists = await this.findOne({
        where: {
          email,
        },
        // include:[sequelize.models.userProfile]
      });

      if (isUserExists) {
        const passwordMatched = await isUserExists.comparePassword(
          isUserExists.password,
          password
        );
        if (passwordMatched) {
          return isUserExists;
        }
      }
      return false;
    }
  }

  user.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: { type: DataTypes.STRING(100), unique: true },
      password: { type: DataTypes.STRING(150), allowNull: false },
      firstName: { type: DataTypes.STRING(100), allowNull: false },
      lastName: { type: DataTypes.STRING(100) },
      publicKey: { type: DataTypes.STRING, defaultValue: null },
      publicUrl: { type: DataTypes.STRING, defaultValue: null },
      admin: { type: DataTypes.BOOLEAN, default: false },
      disabled: { type: DataTypes.BOOLEAN, default: false },
      verified: { type: DataTypes.BOOLEAN, default: false },
      verifyToken: { type: DataTypes.STRING, default: null },
      passResetToken: { type: DataTypes.STRING, default: null },
      passResetRequestedAt: { type: DataTypes.DATE, default: null },
      verifiedAt: { type: DataTypes.DATE, default: null },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      deletedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "user",
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ["updatedAt", "deletedAt"] },
      },
      hooks: {
        beforeCreate: async (user, options) => {
          if (user.password) {
            return new Promise((resolve, reject) => {
              bcrypt
                .genSalt(10)
                .then((generatedSalt) => {
                  return bcrypt.hash(user.password, generatedSalt);
                })
                .then((hashedPassword) => {
                  user.password = hashedPassword;
                  resolve(true);
                })
                .catch((hashingError) => {
                  reject(hashingError);
                });
            });
          }
        },

        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  return user;
};
