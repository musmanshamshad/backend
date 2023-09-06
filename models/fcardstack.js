"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FcardStack extends Model {
    static associate(models) {
      models.fcardStack.belongsTo(models.user, { foreignKey: "userId" });
      models.fcardStack.belongsTo(models.course, { foreignKey: "courseId" });
      models.fcardStack.hasMany(models.userFlashcard,{ foreignKey:"stackId"});

    }
  }
  FcardStack.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "fcardStack",
    }
  );
  return FcardStack;
};
