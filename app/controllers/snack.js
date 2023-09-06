const models = require("../../models");

const createNewSnack = async (req, res, next) => {
  try {
    const snack = req.body;
    console.log({ snack });
    const newSnack = await models.snack.save(snack);
    return res.json({
      data: newSnack,
      error: false,
      response: "Snack added to chapter  successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const list = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const snacks = await models.snack.findAndCountAll({
      where: { chapterId },
      order: [["id", "ASC"]],
      // include: [
      //   // models.course,
      //   models.chapter,
      //   { model: models.note, include: [models.tag], },
      // ],
    });

    return res.json({
      data: snacks,
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
const removeSnack = async (req, res, next) => {
  try {
    const { snackId } = req.params;
    await models.snack.deleteSnack(snackId);
    return res.json({
      data: null,
      error: false,
      response: "Snack deleted successfully",
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const {
      params: { snackId },
      body,
    } = req;

    let toSave = {};
    if (body["title"] && body["title"].trim() !== "") {
      toSave["title"] = body["title"];
    }
    const updatedSnack = await models.snack.updateSnack(snackId, toSave);

    return res.json({
      data: updatedSnack,
      error: false,
      response: "Snack  updated successfully.",
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
module.exports = { createNewSnack, list, removeSnack, updateOne };
