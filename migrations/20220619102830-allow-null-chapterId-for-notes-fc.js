"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("notes", "chapterId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),

      queryInterface.changeColumn("flashcards", "chapterId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("notes", "chapterId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.changeColumn("flashcards", "chapterId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },
};
