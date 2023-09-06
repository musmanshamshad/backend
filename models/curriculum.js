"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class curriculum extends Model {
    static associate(models) {
      // define association here
    }

    static async save(data) {
      
      const createdCurriculum = await this.create(
        {
          ...data,
        },
        {
          fields: ["title"],
        }
      );

      return createdCurriculum;

    }
    static async deleteCurriculum(id) {
      
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateCurriculum(id, data) {
      
      await this.update(
        {
          ...data,
        },
        {
          where: { id },
          returning:true,
        }
      );
    }
  }

  curriculum.init(
    {
      title: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      createdAt: {type:DataTypes.DATE},
      updatedAt: {type:DataTypes.DATE},
      deletedAt: {type:DataTypes.DATE},
    },
    {
      sequelize,
      modelName: "curriculum",
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
  return curriculum;
};
