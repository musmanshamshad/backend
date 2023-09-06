"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLearningObjective extends Model {
    static associate(models) {
      models.UserLearningObjective.belongsTo(models.user, {
        foreignKey: "userId",
      });
      models.UserLearningObjective.belongsTo(models.chapter, {
        foreignKey: "chapterId",
      });
      models.UserLearningObjective.belongsTo(models.learningObjective, {
        foreignKey: "loId",
      });
      models.UserLearningObjective.belongsTo(models.course, {
        foreignKey: "courseId",
      });
    }

    static async save(data) {
      return this.create({
        ...data,
      });
    }
   
  }
  UserLearningObjective.init(
    {
      loId: { type: DataTypes.INTEGER, allowNull: false },
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "UserLearningObjective",
    }
  );
  return UserLearningObjective;
};
