"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "fcardStacks",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        chapterId: {
          type: Sequelize.INTEGER,
          references: {
            model: "chapters",
            field: "id",
          },
          onDelete: "SET NULL",
        },
        courseId: {
          type: Sequelize.INTEGER,
          references: {
            model: "courses",
            field: "id",
          },
          onDelete: "SET NULL",
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
      },
      // {
      //   uniqueKeys: {
      //     actions_unique: {
      //       fields: ["chapterId", "tagId", "courseId", "userId"],
      //     },
      //   },
      // }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fcardStacks");
  },
};
