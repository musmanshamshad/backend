"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserFlashcard extends Model {
    static associate(models) {
      // define association here

      models.userFlashcard.belongsTo(models.fcardStack, {
        foreignKey: "stackId",
      });
      models.userFlashcard.belongsTo(models.tag, {
        foreignKey: "tagId",
      });
    }

    static async deleteFC(where) {
      await this.destroy({
        where,
      });
    }
  }
  UserFlashcard.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: DataTypes.INTEGER,
      unitId: DataTypes.INTEGER,
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      tagId: DataTypes.INTEGER,
      question: { type: DataTypes.TEXT, allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: false },
      courseName: { type: DataTypes.TEXT },
      chapterName: { type: DataTypes.TEXT },
      tagName: { type: DataTypes.TEXT },
      unitName: { type: DataTypes.TEXT },
      snackId: { type: DataTypes.INTEGER },
      snackName: { type: DataTypes.TEXT },
      unitName: { type: DataTypes.TEXT },
      fcId: { type: DataTypes.INTEGER },
      stackId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "userFlashcard",
    }
  );
  return UserFlashcard;
};
