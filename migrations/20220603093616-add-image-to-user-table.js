"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "publicUrl", {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn("users", "publicKey", {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "publicUrl"),
      queryInterface.removeColumn("users", "publicKey"),
    ]);
  },
};
