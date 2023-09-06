"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("units", "courseId", {
      type: Sequelize.INTEGER,
      references: {
        model: "courses",
        field: "id",
      },
      allowNull: true,
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("units", "courseId", {
      type: Sequelize.INTEGER,
      references: {
        model: "courses",
        field: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    });
  },
};
