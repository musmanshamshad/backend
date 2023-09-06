"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("userFlashcards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          field: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: "courses",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      unitId: {
        type: Sequelize.INTEGER,
        references: {
          model: "units",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      chapterId: {
        type: Sequelize.INTEGER,
        references: {
          model: "chapters",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      tagId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tags",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fcId: {
        type: Sequelize.INTEGER,
        references: {
          model: "flashcards",
          field: "id",
        },
        onDelete: "SET NULL",
      },

      courseName: {
        type: Sequelize.TEXT,
      },
      unitName: {
        type: Sequelize.TEXT,
      },
      chapterName: {
        type: Sequelize.TEXT,
      },
      tagName: {
        type: Sequelize.TEXT,
      },
      snackId: {
        type: Sequelize.INTEGER,
        references: {
          model: "snacks",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      snackName: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("userFlashcards");
  },
};
