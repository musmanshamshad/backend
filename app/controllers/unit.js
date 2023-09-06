const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");
const payloadValidator = require("../../utils/payloadValidator");
const create = async (req, res, next) => {
  try {
    const unit = req.body;

    const { errors } = payloadValidator(unit, ["courseId", "title"]);
    if (errors.length > 0) {
      return res.status(400).json({
        data: null,
        error: true,
        customErrors: errors,
        response: "validation error(s)",
      });
    }
    const courseDetails = await models.course.findByPk(unit.courseId);
    if (courseDetails && !courseDetails.haveUnits) {
      return next(
        errorFormatter(
          "unitId",
          "Illegal insertion haveUnits(false)",
          "Unit cannot be created for this course."
        )
      );
    }

    const createdUnit = await models.unit.newUnit(unit);
    return res.json(createdUnit);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const units = await models.unit.findAndCountAll({
      where: {
        courseId,
      },
    });
    return res.json(units);
  } catch (error) {
    next(error);
  }
};

const deleteUnit = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    await models.unit.deleteUnit(unitId);
    return res.json({
      data: null,
      error: false,
      response: "Unit  deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const editUnit = async (req, res, next) => {
  try {
    const {
      params: { unitId },
      body,
    } = req;

    let toSave = {};
    if (body["title"] && body["title"].trim() !== "") {
      toSave["title"] = body["title"];
    }
    const updatedUnit = await models.unit.updateUnit(unitId, toSave);

    return res.json({
      data: updatedUnit,
      error: false,
      response: "Unit  updated successfully.",
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = { create, list, deleteUnit, editUnit };
