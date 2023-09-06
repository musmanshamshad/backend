const models = require("../../models");
const payloadValidator = require("../../utils/payloadValidator");
const { notes } = require("../../utils/reqPayloads");
const errorFormatter = require("../../utils/errorFormatter");
const { Op } = models.Sequelize;
const addNote = async (req, res, next) => {
  try {
    const note = req.body;
    const { errors } = payloadValidator(note, notes.create.params);
    let snacksCount = 0;
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }
    let check = false;

    if (note.snackId) {
      const snackInfo = await models.snack.findByPk(note.snackId, {
        include: [{ model: models.chapter, attributes: ["id"] }],
      });

      if (snackInfo && snackInfo.chapter && snackInfo.chapter.id) {
        note.chapterId = snackInfo.chapter.id;
      }
    } else if (note.chapterId) {
      check = true;
      snacksCount = await models.snack.count({
        where: {
          chapterId: note.chapterId,
        },
      });

      if (snacksCount > 0) {
        if (!note.snackId) {
          return next(
            errorFormatter(
              "snackId",
              "unconsistent constraint - snackId is required",
              "Chapter have snack(s) and notes can only be added to snack"
            )
          );
        }
      }
    }

    const { snackId, chapterId, tagId } = note;
    if (!snackId && !chapterId) {
      return next(
        errorFormatter(
          "snackId || chapterId",
          "not Null constraint violation",
          "Please provide a snackId or chapterId"
        )
      );
    }

    if (check) {
      const foundCombination = await models.note.findOne({
        where: {
          chapterId,
          tagId,
        },
      });
      if (foundCombination) {
        return next(
          errorFormatter(
            "chapterId || tagId",
            "Unique constraint - notes_tagid_chapterid_key",
            "Combination of same tag and chapter already exists"
          )
        );
      }
    }
    // - [x] If a chapter has snack then add notes  and FC to snack only instead to a chapter directly
    // notes || Flashcards >> chapter || snack

    const newNote = await models.note.save(note);
    return res.json({
      data: newNote,
      error: false,
      response: "Note  added to  successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const list = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    let where = {};
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

    const notes = await models.note.findAndCountAll({
      where,
      order: [["id", "ASC"]],
      include: [models.snack, models.tag],
    });
    return res.json({
      data: notes,
      error: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    await models.note.deleteNote(noteId);
    return res.json({
      data: "Note deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const deleteAllBySnack = async (req, res, next) => {
  try {
    const { snackId } = req.params;
    await models.note.destroy({
      where: { snackId },
    });
    return res.json({
      data: null,
      response:
        "All notes associated to requested Snack ID deleted successfully",
      error: false,
    });
  } catch (error) {
    next(error);
  }
};
const updateOne = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = req.body;
    const updatedNote = await models.note.updateNote(noteId, note);
    return res.json({
      data: updatedNote,
      response: "Note updated successfully",
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addNote, list, updateOne, deleteOne, deleteAllBySnack };
