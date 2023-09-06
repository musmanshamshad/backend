"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addConstraint("curriculums", ["title"], {
        type: "unique",
        name: "unique_curriculum_title",
      }),
      await queryInterface.addConstraint("gradeLevels", ["title"], {
        type: "unique",
        name: "unique_gradeLevel_title",
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeConstraint(
        "curriculums",
        "unique_curriculum_title"
      ),
      await queryInterface.removeConstraint(
        "gradeLevels",
        "unique_gradeLevel_title"
      ),
    ]);
  },
};
