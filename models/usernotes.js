"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserNote extends Model {
    static associate(models) {
      // define association here

      models.userNotes.belongsTo(models.course, { foreignKey: "courseId" });
      models.userNotes.belongsTo(models.unit, { foreignKey: "unitId" });
      models.userNotes.belongsTo(models.chapter, { foreignKey: "chapterId" });
      models.userNotes.belongsTo(models.tag, { foreignKey: "tagId" });
      models.userNotes.belongsTo(models.user, { foreignKey: "userId" });
    }
    static async deleteNote(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
  }
  UserNote.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: DataTypes.INTEGER,
      unitId: DataTypes.INTEGER,
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      tagId: DataTypes.INTEGER,
      body: { type: DataTypes.TEXT, allowNull: false },
      courseName: { type: DataTypes.TEXT },
      chapterName: { type: DataTypes.TEXT },
      tagName: { type: DataTypes.TEXT },
      unitName: { type: DataTypes.TEXT },
      snackId: { type: DataTypes.INTEGER },
      snackName: { type: DataTypes.TEXT },
      unitName: { type: DataTypes.TEXT },
      noteId: { type: DataTypes.INTEGER },

    },
    {
      sequelize,
      modelName: "userNotes",
    }
  );
  return UserNote;
};
