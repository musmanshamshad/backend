const models = require("../../models");
const payloadValidator = require("../../utils/payloadValidator");
const { flashcard } = require("../../utils/reqPayloads");
const errorFormatter = require("../../utils/errorFormatter");
const { Op } = require("sequelize");
const addFC = async (req, res, next) => {
  try {
    const fc = req.body;
    const { errors } = payloadValidator(fc, flashcard.create.params);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }

    // @@@@@@ validation @@@@@@@@

    if (fc.snackId) {
      const snackInfo = await models.snack.findByPk(fc.snackId, {
        include: [{ model: models.chapter, attributes: ["id"] }],
      });

      if (snackInfo && snackInfo.chapter && snackInfo.chapter.id) {
        fc.chapterId = snackInfo.chapter.id;
      }
    } else if (fc.chapterId) {
      const snacksCount = await models.snack.count({
        where: {
          chapterId: fc.chapterId,
        },
      });

      if (snacksCount > 0) {
        if (!fc.snackId) {
          return next(
            errorFormatter(
              "snackId",
              "unconsistent constraint - snackId is required",
              "Chapter have snack(s) and flashcards can only be added to snack"
            )
          );
        }
      }
    }

    const { snackId, chapterId } = fc;
    if (!snackId && !chapterId) {
      return next(
        errorFormatter(
          "snackId || chapterId",
          "not Null constraint violation",
          "Please provide a snackId or chapterId"
        )
      );
    }

    const newFC = await models.flashcard.save(fc);
    return res.json({
      data: newFC,
      error: false,
      response: "Flashcard  added to Snack successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    let where = {};

    // ! resource such as chapter,unit,snack

    const { resourceId } = req.params;
    const { resource } = req.query;
    if (
      !resource ||
      ["chapter", "unit", "snack"].indexOf(resource.toLowerCase()) === -1
    ) {
      return next(
        errorFormatter(
          "resource",
          "invalid resource provided",
          `possible value for resource are chapter,unit,snack`
        )
      );
    }
    if (resource === "chapter") {
      where["chapterId"] = resourceId;
    } else if (resource === "snack") {
      where["snackId"] = resourceId;
    }

    // get chapters by unitId
    if (resource === "unit") {
      let chapters = await models.chapter
        .findAll({
          where: {
            unitId: resourceId,
          },
          attributes: ["id"],
        })
        .map((chapter) => chapter.id);
      where = {
        chapterId: {
          [Op.in]: chapters,
        },
      };
    }

    // ! new implementation ends here

    const flashCards = await models.flashcard.findAndCountAll({
      where,
      order: [["id", "ASC"]],
      include: [models.snack, models.tag],
    });
    const { rows, count } = flashCards;
    const fcStack = await models.userFlashcard.findAll({
      where: {
        ...where,
        userId: req.user,
        fcId: {
          [Op.ne]: null,
        },
      },
    });
    let stackId = null;

    if (fcStack.length && fcStack.length === count) {
      stackId = fcStack[0].stackId;
    }

    // check for flashcards status i.e status completed,in-progress,not yet started

    // const doneFCWhere = {};
    // if (chapter) {
    //   doneFCWhere.chapterId = id;
    // } else {
    //   doneFCWhere.snackId = id;
    // }
    const doneFlashcards = await models.fcScore.count({
      where: {
        ...where,
        userId: req.user,
      },
    });
    let status;
    if (doneFlashcards === count && doneFlashcards !== 0) {
      status = "Completed";
    } else if (doneFlashcards !== 0 && doneFlashcards < count) {
      status = "In Progress";
    } else {
      status = "Not Yet Started";
    }

    return res.json({
      data: {
        stackId,
        questions: rows,
        isInLibrary: count ? count === fcStack.length : false,
        status,
        doneFlashcards,
      },
      error: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { flashcardId } = req.params;
    await models.flashcard.deleteFlashCard(flashcardId);
    return res.json({
      data: "FlashCard deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const deleteAllBySnack = async (req, res, next) => {
  try {
    const { flashcardId } = req.params;
    await models.flashcard.destroy({
      where: { flashcardId },
    });
    return res.json({
      data: null,
      response:
        "All FlashCards associated to requested Snack ID deleted successfully",
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const fetchContentOfFlashcard = async (req, res, next) => {
  try {
    const { chapterId, tagId } = req.query;
    if (!chapterId || !tagId) {
      return res.status(400).send({
        statusCode: 400,
        message: `Invalid query params! ChapterId or tagId is missing.`,
        data: {},
      });
    }

    const flashcards = await models.flashcard.findAll({
      where: {
        tagId: tagId,
        chapterId: chapterId,
      },
    });
    if (flashcards.length < 1) {
      return res.status(200).send({
        statusCode: 204,
        message: `Flashcards not available against such query.`,
        data: {},
      });
    }
    return res.status(200).send({
      statusCode: 200,
      message: `Flashcards fetched successfully!`,
      data: flashcards,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { flashcardId } = req.params;
    const fc = req.body;
    const updatedFC = await models.flashcard.updateFlashCard(flashcardId, fc);
    return res.json({
      data: updatedFC,
      response: "FlashCard updated successfully",
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const trackScore = async (req, res, next) => {
  try {
    // validate request payload
    // flashcard request
    // user flashcard request i.e my library
    // dynamic model find
    const { response } = req.body;
    const { library } = req.query;
    const { fcId } = req.params;

    let model = library && library === "true" ? "userFlashcard" : "flashcard";

    const prevFlashCard = await models[model].findByPk(fcId);
    if (!prevFlashCard) {
      return next(
        errorFormatter("fcId", "invalid param", "Please provide valid fcId")
      );
    }
    const { chapterId, snackId, stackId } = prevFlashCard;

    const options = {
      where: {
        userId: req.user,
      },
    };
    const lookupAttrib = library ? "userFcId" : "fcId";
    options.where[lookupAttrib] = fcId;
    const prevScore = await models.fcScore.findOne(options);

    // const savedScore = await models.fcScore.bulkCreate(toSave);
    const savedScore = prevScore
      ? await prevScore.update(
          {
            response,
          },
          {
            returning: true,
          }
        )
      : await models.fcScore.create({
          userId: req.user,
          chapterId,
          snackId,
          response,
          [lookupAttrib]: fcId,
          stackId,
        });

    return res.json({
      data: savedScore,
      response: `FlashCard score ${
        prevScore ? "updated" : "saved"
      } successfully`,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const undoMyLibraryFC = async (req, res, next) => {
  try {
    const { stackId } = req.params;
    const foundStackCards = await models.userFlashcard.findAll({
      stackId,
      userId: req.user,
    });

    await models.userFlashcard.destroy({
      where: { stackId, userId: req.user },
    });
    return res.json({
      data: null,
      response: `${foundStackCards.length} flashcards removed from  my library`,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFC,
  list,
  updateOne,
  deleteOne,
  deleteAllBySnack,
  trackScore,
  undoMyLibraryFC,
  fetchContentOfFlashcard,
};
