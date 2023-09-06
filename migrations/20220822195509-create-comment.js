"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      snackId: {
        type: Sequelize.INTEGER,
        references: {
          model: "snacks",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      chapterId: {
        type: Sequelize.INTEGER,
        references: {
          model: "chapters",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      loId: {
        type: Sequelize.INTEGER,
        references: {
          model: "learningObjectives",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      noteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "notes",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      commentId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comments");
  },
};
