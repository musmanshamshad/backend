"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class unit extends Model {
    static associate(models) {
      // define association here
      models.unit.belongsTo(models.course, { foreignKey: "courseId" });
      models.unit.hasMany(models.chapter);
      models.unit.hasMany(models.userNotes);
    }

    static newUnit = async (data) => {
      return this.create({ ...data });
    };

    static async deleteUnit(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateUnit(id, data) {
      await this.update(
        {
          ...data,
        },
        {
          where: { id },
        }
      );
    }
  
  }
  unit.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "unit",
    }
  );
  return unit;
};
