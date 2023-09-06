"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("userProfiles", "phone", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("userProfiles", "city", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("userProfiles", "phone"),
      queryInterface.removeColumn("userProfiles", "city"),
    ]);
  },
};
