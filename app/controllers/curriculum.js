const models = require("../../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;
      const curriculum = await models.curriculum.save(data);

      return res.json({
        data: curriculum,
        error: false,
        response: "Curriculum added successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { curriculumId } = req.params;
      const curriculum = await models.curriculum.deleteCurriculum(curriculumId);

      return res.json({
        data: null,
        error: false,
        response: "Curriculum deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const {
        params: { curriculumId },
        body,
      } = req;
      const curriculum = await models.curriculum.updateCurriculum(
        curriculumId,
        body
      );
 
      return res.json({
        data: null,
        error: false,
        response: "Curriculum updated successfully.",
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const curriculums = await models.curriculum.findAndCountAll({order: [['id', 'ASC']]});

      return res.json({
        data: curriculums,
        error: false,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
};
