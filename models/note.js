"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    static associate(models) {
      // define association here
      models.note.belongsTo(models.snack, { foreignKey: "snackId" });
      models.snack.hasMany(models.note, { foreignKey: "snackId" });
      models.note.belongsTo(models.tag, { foreignKey: "tagId" });
      models.note.belongsTo(models.chapter, { foreignKey: "chapterId" });

    }

    static save = (data) => {
      return this.create({ ...data });
    };

    static async deleteNote(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateNote(id, data) {
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
  note.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tagId: { type: DataTypes.INTEGER, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      snackId: { type: DataTypes.INTEGER },
      chapterId: { type: DataTypes.INTEGER},

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
      modelName: "note",
    }
  );
  return note;
};
