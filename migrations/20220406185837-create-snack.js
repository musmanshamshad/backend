'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('snacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING, allowNull: false
      },
      courseId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: {
          model: "courses",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      chapterId: {
        type: Sequelize.INTEGER,allowNull: false,
        references: {
          model: "chapters",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('snacks');
  }
};