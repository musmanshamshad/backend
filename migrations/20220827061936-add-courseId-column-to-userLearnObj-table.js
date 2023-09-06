"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserLearningObjectives", "courseId", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserLearningObjectives", "courseId");
  },
};
