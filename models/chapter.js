"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chapter extends Model {
    static associate(models) {
      // define association here
      models.chapter.belongsTo(models.course, { foreignKey: "courseId" });
      models.chapter.belongsTo(models.unit, { foreignKey: "unitId" });
      models.chapter.hasMany(models.learningObjective);
      models.chapter.belongsTo(models.course, { foreignKey: "courseId" });
      models.chapter.hasMany(models.flashcard, { foreignKey: "chapterId" });
      models.chapter.hasMany(models.note, { foreignKey: "chapterId" });
      models.chapter.hasMany(models.userNotes, { foreignKey: "chapterId" });
      models.chapter.hasMany(models.snack, { foreignKey: "chapterId" });
    }
    static save = async (data) => {
      return this.create({ ...data });
    };
    static async deleteChapter(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateChapter(id, data) {
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

  chapter.init(
    {
      title: { type: DataTypes.STRING },
      courseId: { type: DataTypes.INTEGER },
      unitId: DataTypes.INTEGER,
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "chapter",
    }
  );
  return chapter;
};
