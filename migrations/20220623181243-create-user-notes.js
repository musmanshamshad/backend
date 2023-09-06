"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("userNotes", {
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
      noteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "notes",
          field: "id",
        },
        onDelete: "SET NULL",
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("userNotes");
  },
};
