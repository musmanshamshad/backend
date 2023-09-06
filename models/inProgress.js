"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InProgress extends Model {
    static associate(models) {
     
      models.inProgress.belongsTo(models.user, { foreignKey: "userId" });
      models.lastVisited.belongsTo(models.course, { foreignKey: "courseId" });
    }
    static save = (data) => {
      return this.create({
        ...data,
      });
    };
  }
  InProgress.init(
    {
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "inProgress",
      freezeTableName: true,
    }
  );
  return InProgress;
};
