"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    static associate(models) {
      // define association here
      //
      models.course.belongsTo(models.gradeLevel, { foreignKey: "standardId" });
      models.course.belongsTo(models.subject, { foreignKey: "subjectId" });
      models.course.hasMany(models.unit, { foreignKey: "courseId" });
      models.course.hasMany(models.chapter, { foreignKey: "courseId" });
      models.course.hasMany(models.snack, { foreignKey: "courseId" });
      models.course.hasMany(models.learningObjective, {
        foreignKey: "courseId",
      });
      models.course.hasMany(models.userNotes, { foreignKey: "courseId" });
      models.course.hasMany(models.fcardStack)
      models.course.hasMany(models.UserLearningObjective)
    }

    static newCourse = async (data) => {
      return this.create({ ...data });
    };
    static async deleteCourse(id) {
      await this.destroy({
        where: {
          id,
        },
      });
    }
  }
  course.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      haveUnits: { type: DataTypes.BOOLEAN, defaultValue: false },
      title: { type: DataTypes.STRING },
      // gradeLevel is same as  standardId
      standardId: { type: DataTypes.INTEGER, allowNull: false },
      subjectId: { type: DataTypes.INTEGER, allowNull: false },
      publicKey: { type: DataTypes.STRING, allowNull: false },
      publicUrl: { type: DataTypes.STRING, allowNull: false },
      published: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "course",
    }
  );
  return course;
};
