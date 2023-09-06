"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class highlight extends Model {
    static associate(models) {
      // define association here
      models.highlight.belongsTo(models.user, { foreignKey: "userId" });
      models.highlight.belongsTo(models.snack, { foreignKey: "snackId" });
      models.highlight.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.highlight.belongsTo(models.note, { foreignKey: "noteId" });
      models.highlight.belongsTo(models.learningObjective, {
        foreignKey: "loId",
      });
    }
    static save = (data) => {
      return this.create({ ...data });
    };

    static async updateHlight(where, data) {
      return this.update(
        {
          ...data,
        },
        { where, returning: true }
      );
    }
    static async removeHighlight(where) {
      await this.destroy(where);
    }
  }
  highlight.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      snackId: { type: DataTypes.INTEGER },
      chapterId: { type: DataTypes.INTEGER },
      noteId: { type: DataTypes.INTEGER },
      loId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "highlight",
    }
  );
  return highlight;
};
