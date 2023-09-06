"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "notes",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        tagId: {
          type: Sequelize.INTEGER,
          references: {
            model: "tags",
            field: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          allowNull: false,
        },
        body: {
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
          onUpdate: "CASCADE",
        },
        chapterId: {
          type: Sequelize.INTEGER,
          references: {
            model: "chapters",
            field: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ["snackId", "tagId"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notes");
  },
};
