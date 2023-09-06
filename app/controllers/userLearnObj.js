const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");

module.exports = {
  insertLearnObj: async (req, res, next) => {
    try {
      const { loId } = req.params;
      const { completed } = req.body;
      const userLoDetails = await models.UserLearningObjective.findOne({
       where:{ loId,
        userId: req.user,}
      });

      if (!userLoDetails) {
        const lo = await models.learningObjective.findByPk(loId);
        if (!lo) {
          return next(
            errorFormatter(
              "learning objective id",
              "not found",
              "Invalid learning objective id provided"
            )
          );
        }

        const { courseId, chapterId, id } = lo;
        const createUserLO = await models.UserLearningObjective.save({
          loId: id,
          courseId,
          chapterId,
          userId: req.user,
        });
        return res.json({
          data: createUserLO,
          error: false,
          response: `Leaning objective  completion status updated`,
        });
      } else {
        const updatedData = await userLoDetails.update(
          {
            completed,
          },
          { returning: true }
        );
        return res.json({
          data: updatedData,
          error: false,
          response: `Leaning objective  completion status updated`,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
