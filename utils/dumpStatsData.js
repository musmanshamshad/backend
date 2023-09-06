const moment = require("moment");
const { Sequelize } = require("../models");
const models = require("../models");
exports.dumpData = async () => {
  try {
    let userhaveStats = await models.user.findAll({
      raw: true,
      attributes: [
        "id",
        [
          Sequelize.literal(`(
                SELECT COUNT(*) FROM "stats" stat
                WHERE stat."userId"="user".id
            )`),
          "score",
        ],
      ],
    });

    userhaveStats = userhaveStats.filter((user) => user.score === "0");
    const result = this.datesCalculator();
    const bulkData = [];
    userhaveStats.forEach((user) => {
      result.forEach((time) => {
        bulkData.push({
          userId: user.id,
          day: moment(time).format("dddd"),
          hours: 0,
        });
      });
    });
    await models.stat.bulkCreate(bulkData);
  } catch (error) {
    console.log(error);
  }
};
exports.datesCalculator = () => {
  const from = moment().subtract(14, "days");
  const to = moment().subtract(0, "days");
  const nbDays = to.diff(from, "days");
  const result = [...Array(nbDays).keys()].map((i) =>
    from.clone().add(i, "d").toISOString()
  );
  return result;
};
