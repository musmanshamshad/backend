"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class fcScore extends Model {
    static associate(models) {
      // define association here

      models.fcScore.belongsTo(models.user, { foreignKey: "userId" });
      models.fcScore.belongsTo(models.flashcard, { foreignKey: "fcId" });
      models.fcScore.belongsTo(models.userFlashcard, {
        foreignKey: "userFcId",
      });
      models.fcScore.belongsTo(models.fcardStack, { foreignKey: "stackId" });
    }

    static async delete(where) {
      await this.destroy({
        where,
      });
    }
  }
  fcScore.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      chapterId: { type: DataTypes.INTEGER, allowNull: false },
      fcId: DataTypes.INTEGER,
      stackId: DataTypes.INTEGER,
      response: { type: DataTypes.STRING, allowNull: false },
      userFcId: DataTypes.INTEGER,
      snackId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "fcScore",
    }
  );
  return fcScore;
};
