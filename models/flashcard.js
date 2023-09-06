"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class flashcard extends Model {
    static associate(models) {
      // define association here
      models.flashcard.belongsTo(models.snack, { foreignKey: "snackId" });
      models.snack.hasMany(models.flashcard, { foreignKey: "snackId" });
      models.flashcard.belongsTo(models.tag, { foreignKey: "tagId" });
      models.flashcard.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.flashcard.hasMany(models.fcScore, { foreignKey: "fcId" });
    }

    static save = (data) => {
      return this.create({ ...data });
    };

    static async deleteFlashCard(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateFlashCard(id, data) {
      await this.update(
        {
          ...data,
        },
        {
          where: { id },
          returning: true,
        }
      );
    }
  }
  flashcard.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tagId: { type: DataTypes.INTEGER, allowNull: false },
      question: { type: DataTypes.TEXT, allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: false },
      snackId: { type: DataTypes.INTEGER },
      chapterId: { type: DataTypes.INTEGER },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "flashcard",
    }
  );
  return flashcard;
};
