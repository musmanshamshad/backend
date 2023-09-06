"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "verifyToken", {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("users", "passResetToken", {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("users", "passResetRequestedAt", {
        type: Sequelize.DATE,
        defaultValue: null,
      }),
      queryInterface.addColumn("users", "verifiedAt", {
        type: Sequelize.DATE,
        defaultValue: null,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "verifyToken"),
      queryInterface.removeColumn("users", "passResetToken"),
      queryInterface.removeColumn("users", "passResetRequestedAt"),
      queryInterface.removeColumn("users", "verifiedAt"),
    ]);
  },
};
