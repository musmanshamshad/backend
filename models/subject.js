'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subject extends Model {
 
    static associate(models) {
      // define association here
    }
    static async save(data) {
      const createdSubject = await this.create(
        {
          ...data,
        },
        {
          fields: ["title"],
        }
      );

      return createdSubject;
    }
    static async deleteSubject(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
    static async updateSubject(id, data) {
      await this.update(
        {
          ...data,
        },
        {
          where: { id },
        }
      );
    }
  };
  subject.init({
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
  }, {
    sequelize,
    modelName: 'subject',
   
    hooks: {
      beforeCreate: (attributes) => {
        attributes.title = attributes.title.trim().toLowerCase();
      },
      beforeUpdate: (attributes) => {
        attributes.title = attributes.title.trim().toLowerCase();
      },
    },
  });
  return subject;
};