"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class learningObjective extends Model {
    static associate(models) {
      // define association here
      models.learningObjective.belongsTo(models.course, {
        foreignKey: "courseId",
      });
      models.learningObjective.belongsTo(models.chapter, {
        foreignKey: "chapterId",
      });
      models.learningObjective.belongsTo(models.unit, {
        foreignKey: "unitId",
      });
      models.learningObjective.hasMany(models.UserLearningObjective, {
        foreignKey: "loId",
      });
      models.learningObjective.hasMany(models.comment, { foreignKey: "loId" });
      models.learningObjective.hasMany(models.highlight, {
        foreignKey: "loId",
      });
    }
    static async save(data) {
      const createdLo = await this.create(
        {
          ...data,
        },
        {
          fields: ["title", "courseId", "chapterId", "unitId"],
        }
      );

      return createdLo;
    }
    static async deleteLo(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateLo(id, data) {
      return this.update(
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
  learningObjective.init(
    {
      title: { type: DataTypes.TEXT, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      unitId: { type: DataTypes.INTEGER },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "learningObjective",
    }
  );
  return learningObjective;
};
