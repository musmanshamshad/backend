const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");
const _ = require("underscore");
const mime = require("mime-types");
const { uploadS3FileExtended } = require("../../utils/fileUploader");
const payloadValidator = require("../../utils/payloadValidator");

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body;
      const chapterInfo = await models.chapter.findByPk(data.chapterId, {
        include: [
          {
            model: models.unit,
            attributes: ["id"],
          },
          { model: models.course, attributes: ["id", "haveUnits"] },
        ],
      });

      if (!chapterInfo) {
        return next(
          errorFormatter(
            "chapterId",
            "not Null constraint",
            "invalid chapterId"
          )
        );
      }
      if (
        chapterInfo &&
        chapterInfo.course &&
        chapterInfo.course.haveUnits &&
        chapterInfo.course.haveUnits === true
      ) {
        data.unitId = chapterInfo.unit.id;
        data.courseId = chapterInfo.course.id;
      }

      const newLo = await models.learningObjective.save(data);
      console.log(`newLo ------- `, newLo);

      return res.json({
        data: newLo,
        error: false,
        response: "Learning Objective  added  to chapter successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { loId } = req.params;
      await models.learningObjective.deleteLo(loId);
      return res.json({
        data: null,
        error: false,
        response: "Learning Objective removed  from chapter  successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const {
        params: { loId },
        body,
      } = req;
      const updatedLO = await models.learningObjective.updateLo(loId, body);

      return res.json({
        data:
          updatedLO && updatedLO[0] && updatedLO[0] > 0 ? updatedLO[1][0] : {},
        error: false,
        response: "Chapter learning Objective  updated successfully.",
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const { chapterId } = req.params;

      const chapterInfo = await models.chapter.findByPk(chapterId, {
        attributes: ["id"],
        include: [
          {
            model: models.course,
            attributes: ["id"],
          },
        ],
      });

      if (!chapterInfo) {
        return next(
          errorFormatter(
            "chapterId",
            "not Null constraint",
            "invalid chapterId"
          )
        );
      }

      const objectives = await models.learningObjective.findAndCountAll({
        order: [["id", "ASC"]],
        where: { courseId: chapterInfo.course.id },
        include: [
          { model: models.course, attributes: ["title", "id", "haveUnits"] },
          { model: models.chapter, include: [models.unit] },
        ],
      });

      const finalResult = [];

      if (objectives && objectives.rows && objectives.rows.length > 0) {
        const haveUnits = objectives["rows"][0]["course"]["haveUnits"];
        if (haveUnits === true) {
          const result = _.groupBy(objectives.rows, function (instance) {
            return instance.chapter.unitId;
          });
          Object.keys(result).forEach((key) => {
            let tempObject = {
              haveUnits,
              content: [],
            };
            result[key].forEach((innerItem, innerIndex) => {
              if (innerIndex === 0) {
                tempObject["content"].push({
                  unit: innerItem.chapter.unit.title,
                  chapters: [
                    {
                      name: innerItem.chapter.title,
                      leaningObjectives: [
                        { value: innerItem.title, id: innerItem.id },
                      ],
                    },
                  ],
                });
              } else {
                tempObject["content"][0]["chapters"][0][
                  "leaningObjectives"
                ].push({
                  id: innerItem.id,
                  value: innerItem.title,
                });
              }
            });

            finalResult.push(tempObject);
          });
        } else {
          const result = _.groupBy(objectives.rows, function (instance) {
            return instance.chapter.id;
          });

          Object.keys(result).forEach((key) => {
            let tempObject = {
              haveUnits,
              content: [],
            };
            result[key].forEach((innerItem, innerIndex) => {
              if (innerIndex === 0) {
                tempObject["content"].push({
                  chapter: innerItem.chapter.title,
                  leaningObjectives: [
                    {
                      value: innerItem.title,
                      id: innerItem.id,
                    },
                  ],
                });
              } else {
                tempObject["content"][0]["leaningObjectives"].push({
                  value: innerItem.title,
                  id: innerItem.id,
                });
              }
            });

            finalResult.push(tempObject);
          });
        }
      }

      return res.json({
        data: finalResult,
        error: false,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
  loOfChapter: async (req, res, next) => {
    try {
      const { chapterId } = req.params;

      const chapterInfo = await models.chapter.findByPk(chapterId, {
        attributes: ["id", "title"],
        include: [
          {
            model: models.learningObjective,
            attributes: ["id", "title"],
          },
        ],
      });

      if (!chapterInfo) {
        return next(
          errorFormatter(
            "chapterId",
            "not Null constraint",
            "invalid chapterId"
          )
        );
      }
      return res.json({
        data: chapterInfo,
        error: false,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  uploadImage: async (req, res, next) => {
    try {
      const { image } = req.body;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      let buffer, contentType, fileName;
      if (image) {
        const detectedType = image.split(";")[0]?.split(":")[1];
        if (detectedType && allowedTypes.includes(detectedType)) {
          buffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          fileName = `${Date.now().toString()}.${detectedType.split("/")[1]}`;
        }
      } else if (req.file) {
        const detectedType = mime.lookup(req.file.originalname);
        if (detectedType && allowedTypes.includes(detectedType)) {
          buffer = req.file.buffer;
          contentType = detectedType;
          fileName = `${Date.now().toString()}${req.file.originalname}`;
        }
      }

      if (!fileName) {
        hasError = true;
      }

      if (hasError) {
        return next(
          errorFormatter(
            "image",
            "unsupported image format",
            "Allowed image extensions are png,jpg,jpeg"
          )
        );
      }
      const { error, Location, Key } = await uploadS3FileExtended(
        buffer,
        fileName
      );
      res.json({
        data: {
          Location,
          Key,
        },
        error: false,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Author: Farzan
   * @description: Fetch learnign objective by Id
   */
  getLoById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const lo = await models.learningObjective.findOne({
        where: {
          id: id,
        },
      });
      if (!lo) {
        return res.status(400).send({
          statusCode: 400,
          message: "Learning objective not found!",
          data: {},
        });
      }
      return res.status(200).send({
        statusCode: 200,
        message: "Learning objective fetched!",
        data: lo,
      });
    } catch (error) {
      next(error);
    }
  },
};
