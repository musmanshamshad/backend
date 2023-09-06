"use strict";
const {dumpData} = require("../utils/dumpStatsData");
module.exports = {
  async up(queryInterface, Sequelize) {
    await dumpData();
  },

  async down(queryInterface, Sequelize) {},
};
