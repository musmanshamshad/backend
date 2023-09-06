const models = require("../../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;
      const subject = await models.subject.save(data);

      return res.json({
        data: subject,
        error: false,
        response: "Subject  added successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      let { subjectId } = req.params;
      subjectId = JSON.parse(subjectId);

      /**
       * START - Code to remove the dependency of subject Id from fcScore
       */
      let courseId = await models.course.findOne({
        where: {
          subjectId: subjectId,
        },
      });
      if (courseId.dataValues.id) {
        let chapterIds = await models.chapter.findAll({
          where: {
            courseId: courseId.dataValues.id,
          },
        });

        if (chapterIds.length > 0) {
          let ids = [];
          for (let i = 0; i < chapterIds.length; i++) {
            ids.push(chapterIds[i].dataValues.id);
          }

          await models.fcScore.destroy({
            where: {
              chapterId: ids,
            },
          });
        }
      }
      /**
       * END
       */

      await models.subject.destroy({
        where: {
          id: subjectId,
        },
      });

      return res.json({
        data: null,
        error: false,
        response: "Subject deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const {
        params: { subjectId },
        body,
      } = req;
      const subject = await models.subject.updateSubject(subjectId, body);

      return res.json({
        data: subject,
        error: false,
        response: "Subject updated successfully.",
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const subjects = await models.subject.findAndCountAll({
        order: [["id", "ASC"]],
      });

      return res.json({
        data: subjects,
        error: false,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
};
