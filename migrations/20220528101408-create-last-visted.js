"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lastVisited", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        allowNull: false,
        references: {
          model: "courses",
          field: "id",
        },
        onDelete: "CASCADE",
      },
      unitId: {
        type: Sequelize.INTEGER,
        references: {
          model: "units",
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
      snackId: {
        type: Sequelize.INTEGER,
        references: {
          model: "snacks",
          field: "id",
        },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("lastVisited");
  },
};
