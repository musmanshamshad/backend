const models = require("../../models");

const newVisited = async (req, res, next) => {
  try {
    const data = req.body;
    const newVisited = await models.lastVisited.save(data);

    return res.json({
      data: newVisited,
      error: false,
      response: "Course visited successfully",
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const listLastVisited = async (req, res, next) => {
  try {
    const list = await models.lastVisited.findAndCountAll({
      where: {
        userId: req.user,
      },
      include: [
       {model: models.chapter,attributes:["title",'id']},
       {model: models.unit,attributes:["title",'id']},
       {model: models.course,attributes:["title",'id']},
        {
          model: models.user,
          attributes: ['id','email'],
        },
      ],
    });

    return res.json({
      data: list,
      error: false,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

module.exports = { newVisited, listLastVisited };
