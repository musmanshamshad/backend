"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("courses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      haveUnits: {
         type: Sequelize.BOOLEAN, defaultValue: false 
      },

      title: { type: Sequelize.STRING },
      standardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "gradeLevels",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subjects",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("courses");
  },
};
