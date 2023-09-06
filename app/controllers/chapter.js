const e = require("cors");
const models = require("../../models");
const learningobjective = require("../../models/learningobjective");
const Op = require("sequelize").Op;
const errorFormatter = require("../../utils/errorFormatter");
module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;

      const courseInfo = await models.course.findByPk(data.courseId);
      if (courseInfo.haveUnits && courseInfo.haveUnits === true) {
        if (!data.unitId || (data.unitId && typeof data.unitId !== "number")) {
          return next(
            errorFormatter(
              "unitId",
              "unconsistent constraint - haveUnits = true",
              "Chapter can only be added to unit for this course"
            )
          );
        }
      }

      const chapter = await models.chapter.save(data);

      return res.json({
        data: chapter,
        error: false,
        response: "Chapter added successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { chapterId } = req.params;
      await models.chapter.deleteChapter(chapterId);
      return res.json({
        data: null,
        error: false,
        response: "Chapter  deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const {
        params: { chapterId },
        body,
      } = req;

      let toSave = {};
      if (body["title"] && body["title"].trim() !== "") {
        toSave["title"] = body["title"];
      }
      const updateChapter = await models.chapter.updateChapter(
        chapterId,
        toSave
      );

      return res.json({
        data: updateChapter,
        error: false,
        response: "Chapter  updated successfully.",
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { course } = req.query;

      const where = {};

      if (course && course === "true") {
        where.courseId = id;
      } else {
        where.unitId = id;
      }
      const chapters = await models.chapter.findAndCountAll({
        order: [["id", "ASC"]],
        where,
      });

      return res.json({
        data: chapters,
        error: false,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },

  /**
   * Author : Farzan
   * @description: Fetch chapters along with their learning objectives
   */
  getChaptersAlongWithLearningObjectives: async (req, res, next) => {
    try {
      // Get courseId from params
      const id = JSON.parse(req.params.id);

      let chaptersAndLearningObjectives = await models.course.findOne({
        where: { id: id },
        include: [
          {
            model: models.chapter,
            include: [
              {
                model: models.learningObjective,
              },
            ],
          },
        ],
      });

      if (!chaptersAndLearningObjectives) {
        return res.status(404).send({
          statsuCode: 404,
          message: "Chapters and their learning objectives not found!",
          data: {},
        });
      }

      return res.status(200).send({
        statsuCode: 200,
        message: "Chapter and it's learning objectives fetched!",
        data: chaptersAndLearningObjectives,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
