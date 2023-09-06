"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("courses", "publicUrl", {
        type: Sequelize.STRING,
        allowNull: false,
        
      }),
      queryInterface.addColumn("courses", "publicKey", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:''

      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("courses", "publicUrl"),
      queryInterface.removeColumn("courses", "publicKey"),
    ]);
  },
};
