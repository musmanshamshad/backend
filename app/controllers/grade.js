const models = require("../../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;
      const grade = await models.gradeLevel.save(data);

      return res.json({
        data: grade,
        error: false,
        response: "Grade Level added successfully.",
      });
    } catch (error) {
        console.log({error});
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { gradeId } = req.params;
      await models.gradeLevel.deleteGrade(gradeId);
      return res.json({
        data: null,
        error: false,
        response: "Grade Level  deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const {
        params: {  gradeId },
        body,
      } = req;
      const grade = await models.gradeLevel.updateGrade(
        gradeId,
        body
      );

      return res.json({
        data: grade,
        error: false,
        response: "Grade Level updated successfully.",
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const grades = await models.gradeLevel.findAndCountAll({
        order: [["id", "ASC"]],
      });

      return res.json({
        data: grades,
        error: false,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
};
