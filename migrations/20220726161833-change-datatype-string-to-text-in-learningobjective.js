"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("learningObjectives", "title", {
      type: Sequelize.DataTypes.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("learningObjectives", "title", {
      type: Sequelize.DataTypes.STRING,
    });
  },
};
