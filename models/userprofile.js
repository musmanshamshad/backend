"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userProfile extends Model {
    static associate(models) {
      // define association here
      models.userProfile.belongsTo(models.user, { foreignKey: "userId" });
      models.userProfile.belongsTo(models.curriculum, {
        foreignKey: "curriculumId",
      });
      models.userProfile.belongsTo(models.gradeLevel, {
        foreignKey: "gradeLevelId",
      });
    }

    static async save(userDetails) {
      const createdUserProfile = await this.create({
        ...userDetails,
      });
      return createdUserProfile;
    }
  }
  userProfile.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      country: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      schoolName: { type: DataTypes.STRING, allowNull: false },
      gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
      curriculumId: { type: DataTypes.INTEGER, },
      phone: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      deletedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "userProfile",
      paranoid: true,
    }
  );
  return userProfile;
};
