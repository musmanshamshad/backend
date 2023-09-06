"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addConstraint("userProfiles", ["gradeLevelId"], {
        type: "FOREIGN KEY",
        name: "FK_userProfile_gradeLevel",
        references: {
          table: "gradeLevels",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      await queryInterface.addConstraint("userProfiles", ["curriculumId"], {
        type: "FOREIGN KEY",
        name: "FK_userProfile_curriculum",
        references: {
          table: "curriculums",
          field: "id",
        },
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeConstraint(
        "userProfiles",
        "FK_userProfile_gradeLevel"
      ),
      await queryInterface.removeConstraint(
        "userProfiles",
        "FK_userProfile_curriculum"
      ),
    ]);
  },
};
