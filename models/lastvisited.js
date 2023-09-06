"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LastVisited extends Model {
    static associate(models) {
  
      models.lastVisited.belongsTo(models.user, { foreignKey: "userId" });
      models.lastVisited.belongsTo(models.unit, { foreignKey: "unitId" });
      models.lastVisited.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.lastVisited.belongsTo(models.course, { foreignKey: "courseId" });
      models.lastVisited.belongsTo(models.snack, { foreignKey: "snackId" });
    }

    static save = (data) => {
      return this.create({
        ...data,
      });
    };
  }
  LastVisited.init(
    {
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      unitId: DataTypes.INTEGER,
      chapterId: DataTypes.INTEGER,
      snackId: DataTypes.INTEGER,
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "lastVisited",
      freezeTableName: true,
    }
  );
  return LastVisited;
};
