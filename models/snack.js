"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class snack extends Model {
    static associate(models) {
      // define association here
      models.snack.belongsTo(models.course, { foreignKey: "courseId" });
      models.snack.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.snack.hasMany(models.note, { foreignKey: "snackId" });
      models.snack.hasMany(models.flashcard, { foreignKey: "snackId" });
    }

    static save = (data) => {
      return this.create({ ...data });
    };

    static async deleteSnack(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateSnack(id, data) {
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
  snack.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "snack",
    }
  );
  return snack;
};
