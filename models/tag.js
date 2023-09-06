"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    static associate(models) {}

    static async save(data) {
      const newTag = await this.create(
        {
          ...data,
        },
        {
          fields: ["title"],
        }
      );

      return newTag;
    }
    static async deleteTag(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateTag(id, data) {
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

    static async list() {
      return this.findAll({ order: [["id", "ASC"]] });
    }
    //
  }
  tag.init(
    {
      title: { type: DataTypes.STRING, allowNull: false, unique: true },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "tag",
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
  return tag;
};
