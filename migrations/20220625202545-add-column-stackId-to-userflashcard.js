"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("userFlashcards", "stackId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "fcardStacks",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("userFlashcards", "stackId");
  },
};
