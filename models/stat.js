"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stat extends Model {
    static associate(models) {
      // define association here
      models.stat.belongsTo(models.user, { foreignKey: "userId" });
    }

    static async save(data) {
      return this.create({
        ...data,
      });
    }
  }
  stat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      day: { type: DataTypes.STRING, allowNull: false },
      hours: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      modelName: "stat",
    }
  );
  return stat;
};
