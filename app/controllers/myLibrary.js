const models = require("../../models");
const payloadValidator = require("../../utils/payloadValidator");
const {
  userNotes,
  userFlashcards,
  flashcardStack,
} = require("../../utils/reqPayloads");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const errorFormatter = require("../../utils/errorFormatter");
const _ = require("underscore");

const moveNotes = async (req, res, next) => {
  try {
    const { chapterId, tagId, snackId } = req.body;
    const { errors } = payloadValidator(req.body, userNotes.create.params);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }

    let unitId;
    let unitName;
    let toSave = [];
    let where = { chapterId };
    if (tagId) {
      where["tagId"] = tagId;
    }
    if (snackId) {
      where["snackId"] = snackId;
    }
    let chapterNotes = await models.note.findAll({
      where,
      include: [
        models.snack,
        models.tag,
        {
          model: models.chapter,
          attributes: ["id", "title"],
          include: [
            {
              model: models.course,
              attributes: ["id", "title", "haveUnits"],
              include: [{ model: models.unit, attributes: ["id", "title"] }],
            },
          ],
        },
      ],
    });

    let duplicateIds = chapterNotes.map((note) => note.id);
    let duplicateNotes = await models.userNotes
      .findAll({
        where: {
          noteId: {
            [Op.in]: duplicateIds,
          },
          userId: req.user,
        },
        attributes: ["noteId"],
      })
      .map((note) => note.noteId);

    chapterNotes = chapterNotes.filter(
      (note) => !duplicateNotes.includes(note.id)
    );
    if (chapterNotes && chapterNotes.length > 0) {
      const chapterInfo = await models.chapter.findByPk(chapterId, {
        include: [models.unit],
      });
      if (chapterInfo && chapterInfo.unitId) {
        unitId = chapterInfo.unitId;
        unitName = chapterInfo.unit.title;
      }
      if (chapterInfo && chapterInfo.courseId) {
        courseId = chapterInfo.courseId;
      }

      toSave = chapterNotes.map((note) => {
        let snackId, snackName;
        if (note.snack) {
          snackId = note.snack.id;
          snackName = note.snack.title;
        }

        return {
          userId: req.user,
          unitId,
          chapterId,
          body: note.body,
          tagId: note.tagId,
          tagName: note.tag.title,
          courseId: note.chapter.course.id,
          courseName: note.chapter.course.title,
          chapterName: note.chapter.title,
          snackId,
          snackName,
          unitName,
          noteId: note.id,
        };
      });

      if (toSave.length) {
        await models.userNotes.bulkCreate(toSave);
      }
    }

    return res.json({
      data: null,
      error: false,
      response: `${chapterNotes.length} Notes moved to My Library`,
    });
  } catch (error) {
    next(error);
  }
};

const listUserNotes = async (req, res, next) => {
  try {
    const userNotes = await models.userNotes.findAll({
      where: {
        userId: req.user,
      },
    });

    return res.json({
      data: userNotes,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const fetchContentOfUserNoteTag = async (req, res, next) => {
  try {
    const { chapterId, tagId } = req.query;
    if (!chapterId || !tagId) {
      return res.status(400).send({
        statusCode: 400,
        message: `Invalid query params! Either chapterId or tagId is missing.`,
        data: {},
      });
    }

    console.log(`req.user ------- `, req.user);

    const content = await models.userNotes.findOne({
      where: {
        userId: req.user,
        tagId: tagId,
        chapterId: chapterId,
      },
    });
    if (!content) {
      return res.status(200).send({
        statusCode: 204,
        message: `Content not available against such query.`,
        data: {},
      });
    }
    return res.status(200).send({
      statusCode: 200,
      message: `Content fetched successfully!`,
      data: content,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const deleteUserNote = async (req, res, next) => {
  try {
    await models.userNotes.deleteNote(req.params.noteId);

    return res.json({
      data: null,
      error: false,
      response: "Note removed from my library",
    });
  } catch (error) {
    next(error);
  }
};

const updateUserNote = async (req, res, next) => {
  try {
    const { body } = req.body;

    const { errors } = payloadValidator(req.body, userNotes.update.params);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }
    const updatedNote = await models.userNotes.update(
      {
        body,
      },
      {
        where: {
          id: req.params.id,
          userId: req.user,
        },
        returning: true,
      }
    );

    return res.json({
      data: updatedNote,
      error: false,
      response: "Note in my library updated",
    });
  } catch (error) {
    next(error);
  }
};

// ################## flashcards ########################

const moveFlashcards = async (req, res, next) => {
  try {
    const { chapterId, tagId, snackId } = req.body;

    const { errors } = payloadValidator(req.body, userNotes.create.params);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }
    let unitId;
    let unitName;
    let toSave = [];
    let courseId;
    let where = { chapterId };
    if (tagId) {
      where["tagId"] = tagId;
    }
    if (snackId) {
      where["snackId"] = snackId;
    }
    let chapterFC = await models.flashcard.findAll({
      where,
      include: [
        models.snack,
        models.tag,
        {
          model: models.chapter,
          attributes: ["id", "title"],
          include: [
            {
              model: models.course,

              attributes: ["id", "title", "haveUnits"],
              include: [{ model: models.unit, attributes: ["id", "title"] }],
            },
          ],
        },
      ],
    });

    // restrict duplicate insertion of flashcards in to userFlashcards
    let duplicateIds = chapterFC.map((fc) => fc.id);
    let duplicateFlashcards = await models.userFlashcard
      .findAll({
        where: {
          fcId: {
            [Op.in]: duplicateIds,
          },
          userId: req.user,
        },
        attributes: ["fcId"],
      })
      .map((fc) => fc.fcId);

    chapterFC = chapterFC.filter((fc) => !duplicateFlashcards.includes(fc.id));

    if (chapterFC && chapterFC.length > 0) {
      const chapterInfo = await models.chapter.findByPk(chapterId, {
        include: [models.unit],
      });
      if (chapterInfo && chapterInfo.unitId) {
        unitId = chapterInfo.unitId;
        unitName = chapterInfo.unit.title;
      }
      if (chapterInfo && chapterInfo.courseId) {
        courseId = chapterInfo.courseId;
      }

      // insertion in flashcard stack to get stackId

      const createdFcStack = await models.fcardStack.create({
        userId: req.user,
        courseId,
        chapterId,
      });
      //

      toSave = chapterFC.map((fc) => {
        let snackId, snackName;
        if (fc.snack) {
          snackId = fc.snack.id;
          snackName = fc.snack.title;
        }
        return {
          userId: req.user,
          unitId,
          chapterId,
          question: fc.question,
          answer: fc.answer,
          tagId: fc.tagId,
          tagName: fc.tag.title,
          courseId: fc.chapter.course.id,
          courseName: fc.chapter.course.title,
          chapterName: fc.chapter.title,
          snackId,
          snackName,
          unitName,
          fcId: fc.id,
          stackId: createdFcStack.id,
        };
      });

      if (toSave.length) {
        await models.userFlashcard.bulkCreate(toSave);
      }
    }

    return res.json({
      data: null,
      error: false,
      response: `${chapterFC.length} Flash cards  moved to My Library`,
    });
  } catch (error) {
    next(error);
  }
};

const listUserFC = async (req, res, next) => {
  try {
    const { stackId } = req.query;
    let where = {
      userId: req.user,
      // stackId: {
      //   [Op.ne]: null,
      // },
    };
    if (stackId) {
      where.stackId = stackId;
    }

    const userflashcards = await models.userFlashcard.findAll({
      where,
    });
    // check for count of flashcards in my library
    // check for count of flashcards score in fcscore

    let response = _.groupBy(userflashcards, function (instance) {
      return instance.stackId;
    });

    const userScore = await models.fcScore.findAll({
      raw: true,
      attributes: ["stackId", sequelize.fn("count", sequelize.col("id"))],
      group: ["fcScore.stackId"],
      where: {
        userId: req.user,
        stackId: {
          [Op.in]: Object.keys(response),
        },
      },
    });
    response = Object.keys(response).map((item) => {
      let flashcards = response[item];
      const chapterName = flashcards[0].chapterName;
      const stackId = flashcards[0].stackId;
      let status;
      let doneFlashcards1 = 0;
      userScore.forEach(({ stackId: InnerstackId, count: doneFlashcards }) => {
        if (InnerstackId == stackId) {
          doneFlashcards1 = doneFlashcards;
          if (doneFlashcards == flashcards.length && doneFlashcards !== 0) {
            status = "Completed";
          } else if (
            doneFlashcards !== 0 &&
            doneFlashcards < flashcards.length
          ) {
            status = "In Progress";
          } else {
            status = "Not Yet Started";
          }
        }
      });
      return {
        stackId,
        chapterName,
        status: status ? status : "Not Yet Started",
        doneFlashcards: parseInt(doneFlashcards1, 10),
        total: flashcards.length,
        flashcards,
      };
    });

    return res.json({
      data: response,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserFC = async (req, res, next) => {
  try {
    const { fcId } = req.params;

    const { stack } = req.query;

    // delete stack
    // delete score associated to this flashcard
    if (stack) {
      await models.userFlashcard.deleteFC({
        userId: req.user,
        stackId: fcId,
      });
      await models.fcScore.delete({
        stackId: fcId,
        userId: req.user,
      });
    } else {
      await models.userFlashcard.deleteFC({
        userId: req.user,
        id: fcId,
      });
    }

    return res.json({
      data: null,
      error: false,
      response: "Flashcard removed from my library",
    });
  } catch (error) {
    next(error);
  }
};

const updateUserFlashcard = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    const { errors } = payloadValidator(req.body, userFlashcards.update.params);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }
    const updatedFlashcard = await models.userFlashcard.update(
      {
        question,
        answer,
      },
      {
        where: {
          id: req.params.id,
          userId: req.user,
        },
        returning: true,
      }
    );

    return res.json({
      data: updatedFlashcard,
      error: false,
      response: "Flashcard in my library updated",
    });
  } catch (error) {
    next(error);
  }
};

// ################################### set to default ############################################
// ################################### notes ####################################################

const resetUserNote = async (req, res, next) => {
  // reset notes to original by chapter or unitId
  try {
    const { id } = req.params;
    const { resource } = req.query;

    if (
      !resource ||
      ["chapter", "unit"].indexOf(resource.toLowerCase()) === -1
    ) {
      return next(
        errorFormatter(
          "resource",
          "invalid resource provided",
          `possible value for resource are chapter,unit`
        )
      );
    }

    const resourceType = resource === "chapter" ? "chapterId" : "unitId";
    const copiedNotes = await models.userNotes.findAll({
      where: {
        [resourceType]: id,
        userId: req.user,
      },
      order: [["noteId", "ASC"]],
    });

    if (!copiedNotes.length) {
      return next(
        errorFormatter(
          resource,
          "invalid resource id",
          `no notes found in library for given  chapterId or unitId`
        )
      );
    }

    const originalNotes = await models.note.findAll({
      where: {
        id: {
          [Op.in]: copiedNotes.map(({ noteId }) => noteId),
        },
      },
      order: [["id", "ASC"]],
    });

    const bulkUpdatePromises = [];

    originalNotes.forEach(({ body, id: noteId }) => {
      bulkUpdatePromises.push(
        models.userNotes.update(
          {
            body,
          },
          {
            where: {
              userId: req.user,
              noteId,
            },
          }
        )
      );
    });

    await Promise.all(bulkUpdatePromises);
    const updatedUserNotes = await models.userNotes.findAll({
      where: {
        noteId: {
          [Op.in]: copiedNotes.map(({ noteId }) => noteId),
        },
      },
      order: [["id", "ASC"]],
    });

    return res.json({
      data: updatedUserNotes,
      error: false,
      response: "Note reset to default",
    });
  } catch (error) {
    next(error);
  }
};

// ################################### flashcards ####################################################

const resetUserFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resource } = req.query;

    if (
      !resource ||
      ["chapter", "unit"].indexOf(resource.toLowerCase()) === -1
    ) {
      return next(
        errorFormatter(
          "resource",
          "invalid resource provided",
          `possible value for resource are chapter,unit`
        )
      );
    }

    const resourceType = resource === "chapter" ? "chapterId" : "unitId";

    const copiedFlashcard = await models.userFlashcard.findAll({
      where: {
        [resourceType]: id,
        userId: req.user,
      },
      order: [["noteId", "ASC"]],
    });
    if (!copiedFlashcard.length) {
      return next(
        errorFormatter(
          resource,
          "invalid resource id",
          `no flashcards found in library for given  chapterId or unitId`
        )
      );
    }
    const originalFCS = await models.flashcard.findAll({
      where: {
        id: {
          [Op.in]: copiedFlashcard.map(({ fcId }) => fcId),
        },
      },
      order: [["id", "ASC"]],
    });

    const bulkUpdatePromises = [];

    originalFCS.forEach(({ body, id: fcId }) => {
      bulkUpdatePromises.push(
        models.userFlashcard.update(
          {
            body,
          },
          {
            where: {
              userId: req.user,
              fcId,
            },
          }
        )
      );
    });

    await Promise.all(bulkUpdatePromises);
    const updatedUserFCS = await models.userFlashcard.findAll({
      where: {
        fcId: {
          [Op.in]: copiedFlashcard.map(({ fcId }) => fcId),
        },
      },
      order: [["id", "ASC"]],
    });
    // const originalFC = await models.flashcard.findByPk(copiedFlashcard.fcId);

    // if (originalFC) {
    //   const updatedFc = await models.userFlashcard.update(
    //     {
    //       question: originalFC.question,
    //       answer: originalFC.answer,
    //     },
    //     {
    //       where: {
    //         fcId: originalFC.id,
    //       },
    //       returning: true,
    //     }
    //   );
    return res.json({
      data: updatedUserFCS,
      error: false,
      response: "Flashcard reset to default",
    });
    // } else {
    //   return next(
    //     errorFormatter(
    //       "flashcard",
    //       "resource not found",
    //       "Flashcard cannot set to default as original flashcard have been deleted"
    //     )
    //   );
    // }
  } catch (error) {
    next(error);
  }
};

// ######################################### flashcard stack ################################################

const createFlashcardStack = async (req, res, next) => {
  try {
    const { courseId, chapterId, flashcards = [] } = req.body;

    const { errors } = payloadValidator(req.body, flashcardStack.create.params);

    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }

    if (!Array.isArray(flashcards)) {
      return next(
        errorFormatter(
          "flashcards",
          "invalid datatype",
          "flashcards should be of type Array"
        )
      );
    }

    const objTest = flashcards.every(
      (fc) => fc.question && fc.answer && fc.tagId
    );

    if (!objTest) {
      return next(
        errorFormatter(
          "flashcards",
          "invalid object structure",
          "flashcards element should be an object and must have properties answer,question,tagId"
        )
      );
    }
    const createdFcStack = await models.fcardStack.create({
      userId: req.user,
      courseId,
      chapterId,
    });

    let toSaveFCS = [];
    let tagTitles = await models.tag.findAll({
      where: {
        id: {
          [Op.in]: flashcards.map((fc) => fc.tagId),
        },
      },
      attributes: ["id", "title"],
    });

    const chapterInfo = await models.chapter.findByPk(chapterId, {
      attributes: ["id", "title"],
      include: [{ model: models.course, attributes: ["id", "title"] }],
    });

    if (flashcards && Array.isArray(flashcards)) {
      toSaveFCS = flashcards.map((fc) => {
        return {
          courseId,
          courseName: chapterInfo.course.title,
          chapterId: chapterInfo.id,
          chapterName: chapterInfo.title,
          tagId: fc.tagId,
          tagName: tagTitles.filter((f) => f.id === fc.tagId)[0].title,
          question: fc.question,
          answer: fc.answer,
          stackId: createdFcStack.id,
          userId: req.user,
        };
      });
    }

    let createdFcs;
    if (toSaveFCS.length) {
      createdFcs = await models.userFlashcard.bulkCreate(toSaveFCS);
    }
    return res.json({
      data: {
        flashcards: createdFcs,
        flashcardStack: createdFcStack,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const clearFC = async (req, res, next) => {
  try {
    await models.userFlashcard.destroy({
      where: { userId: req.user },
    });

    return res.json({
      data: null,
      error: false,
      response: "All flashcard cleared from my library",
    });
  } catch (error) {
    next(error);
  }
};

const clearNotes = async (req, res, next) => {
  try {
    const { resource, resourceId } = req.query;
    const resourceTypes = ["all", "chapter", "unit"];
    const options = {
      where: {
        userId: req.user,
      },
    };

    if (!resource || resourceTypes.indexOf(resource.toLowerCase()) === -1) {
      return next(
        errorFormatter(
          "resource",
          "invalid resource provided",
          `possible value for resource are all,chapter,unit`
        )
      );
    }

    if (!resourceId) {
      return next(
        errorFormatter(
          "resourceId",
          "invalid resourceId provided",
          `Please provide valid resourceId`
        )
      );
    }
    switch (resource) {
      case "chapter":
        options.where.chapterId = resourceId;
        break;
      case "unit":
        options.where.unitId = resourceId;
        break;
      default:
        options.where.userId = req.user;
    }

    await models.userNotes.destroy(options);

    return res.json({
      data: null,
      error: false,
      response: "All notes cleared from my library",
    });
  } catch (error) {
    next(error);
  }
};
const userNoteDetail = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const noteDetail = await models.userNotes.findByPk(noteId);

    return res.json({
      data: noteDetail,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  moveNotes,
  listUserNotes,
  fetchContentOfUserNoteTag,
  deleteUserNote,
  listUserFC,
  deleteUserFC,
  moveFlashcards,
  updateUserNote,
  updateUserFlashcard,
  resetUserNote,
  resetUserFlashcard,
  createFlashcardStack,
  clearNotes,
  clearFC,
  userNoteDetail,
};
