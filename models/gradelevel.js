"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class gradeLevel extends Model {
    static associate(models) {
      // define association here
    }

    static async save(data) {
      const createdLo = await this.create(
        {
          ...data,
        },
        {
          fields: ["title"],
        }
      );

      return createdLo;
    }
    static async deleteGrade(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateGrade(id, data) {
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
  gradeLevel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      deletedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "gradeLevel",
      hooks: {
        beforeCreate: (attributes) => {
          attributes.title = attributes.title.trim().toLowerCase();
        },
        beforeUpdate: (attributes) => {
          attributes.title = attributes.title.trim().toLowerCase();
        },
      },
    }
  );
  return gradeLevel;
};
