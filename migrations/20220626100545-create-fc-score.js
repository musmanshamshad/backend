"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fcScores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      chapterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chapters",
          field: "id",
        },
        onDelete: "NO ACTION",
      },
      snackId: {
        type: Sequelize.INTEGER,
        references: {
          model: "snacks",
          field: "id",
        },
        onDelete: "NO ACTION",
      },
      fcId: {
        type: Sequelize.INTEGER,
        references: {
          model: "flashcards",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      response: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stackId: {
        type: Sequelize.INTEGER,
        references: {
          model: "fcardStacks",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      userFcId: {
        type: Sequelize.INTEGER,
        references: {
          model: "userFlashcards",
          field: "id",
        },

        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fcScores");
  },
};
