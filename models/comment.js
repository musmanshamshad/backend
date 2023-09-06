"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    static associate(models) {
      models.comment.belongsTo(models.user, { foreignKey: "userId" });
      models.comment.belongsTo(models.snack, { foreignKey: "snackId" });
      models.comment.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.comment.belongsTo(models.note, { foreignKey: "noteId" });
      models.comment.belongsTo(models.learningObjective, {
        foreignKey: "loId",
      });
    }

    static save = (data) => {
      return this.create({ ...data });
    };

    static async updateComment(where, data) {
      return this.update(
        {
          ...data,
        },
        { where, returning: true }
      );
    }
    static async removeComment(where) {
      await this.destroy(where);
    }
  }
  comment.init(
    {
      snackId: { type: DataTypes.INTEGER },
      chapterId: { type: DataTypes.INTEGER },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      commentId: { type: DataTypes.STRING, unique: true, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      noteId: { type: DataTypes.INTEGER },
      loId: { type: DataTypes.INTEGER },
      library: { type: DataTypes.BOOLEAN, allowNull: false ,defaultValue: false},
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
