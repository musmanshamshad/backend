const models = require("../../models");
const { s3Imageupload: imageUploader } = require("../../utils/fileUploader");
const sequelize = require("sequelize");
const errorFormatter = require("../../utils/errorFormatter");
const Op = sequelize.Op;
const createNewCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    const subjectInfo = await models.subject.findByPk(courseData.subjectId);
    if (!subjectInfo) {
      return next(
        errorFormatter(
          "subjectId",
          `fk constraint failed - subject table have no such id ${courseData.subjectId}  `,
          "Invalid subject id provided"
        )
      );
    }

    // check for subject and gradeLevel combination to make courses unique

    const { subjectId, standardId } = courseData;
    const isExist = await models.course.findOne({
      where: {
        subjectId,
        standardId,
      },
    });
    if (isExist) {
      return next(
        errorFormatter(
          "subjectId,standardId",
          `unique constraint violation`,
          `course with subjectId = ${subjectId} and  standardId = ${standardId} already created`,
          isExist
        )
      );
    }

    courseData.title = subjectInfo.title;
    if (courseData.image) {
      const { key, location } = await imageUploader(courseData.image);
      courseData.publicUrl = location;
      courseData.publicKey = key;
    }
    const createCourse = await models.course.newCourse(courseData);
    return res.json({ data: createCourse, error: false });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const { published } = req.query;
    const where = {};
    if (published && published === "true") {
      where["published"] = true;
    }
    const courses = await models.course.findAndCountAll({
      include: [
        models.gradeLevel,
        models.subject,
        models.snack,
        models.unit,
        models.chapter,
      ],
      where,
      // limit: 1,
    });
    return res.json({ data: courses, error: false });
  } catch (error) {
    console.log("", error);
    next(error);
  }
};

const myCourses = async (req, res, next) => {
  try {
    // check grade and curriculum id of courses and filter
    const courses = await models.course.findAndCountAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(
              SELECT COUNT(*)
              FROM units as unit
              WHERE "unit"."courseId" = course.id
            )`
            ),
            "units",
          ],
          [
            sequelize.literal(
              `(
              SELECT COUNT(*)
              FROM chapters as chapter
              WHERE "chapter"."courseId" = course.id
            )`
            ),
            "chapters",
          ],

          [
            sequelize.literal(
              `(
              SELECT COUNT(*)
              FROM snacks as snack
              WHERE "snack"."courseId" = course.id
            )`
            ),
            "snacks",
          ],
        ],
      },

      where: {
        standardId: req.gradeLevelId,
      },
      raw: true,
    });
    const formattedData = courses.rows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        highlights: [
          { value: parseInt(row.units, 10), type: "units" },
          { value: parseInt(row.chapters, 10), type: "chapters" },
          { value: parseInt(row.snacks, 10), type: "snacks" },
        ],
        progress: "0%",
        img: row.publicUrl,
      };
    });
    return res.json({
      data: formattedData,
      error: false,
    });
  } catch (error) {
    console.log(error);
    error.message = "Admin forbidden resource";
    error.statusCode = 403;
    next(error);
  }
};

const courseVisited = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const [visitedCourse, created] = await models.inProgress.findOrCreate({
      where: {
        userId: req.user,
        courseId,
      },
    });
    return res.json({
      data: visitedCourse,
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const courseSyllabus = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { type } = req.query; // Optional query param - type = ['syllabus', 'notes', 'flashcards']

    let includeArr = [];
    switch (type) {
      case "syllabus":
        includeArr = [
          models.unit,
          {
            model: models.chapter,
          },
        ];
        break;
      case "notes":
        includeArr = [
          { model: models.snack },
          models.unit,
          {
            model: models.chapter,
            include: [
              {
                model: models.note,
                attributes: {
                  exclude: ["body"],
                },
              },
            ],
          },
        ];
        break;
      case "flashcards":
        includeArr = [
          { model: models.snack },
          models.unit,
          {
            model: models.chapter,
            include: [
              {
                model: models.flashcard,
              },
            ],
          },
        ];
        break;
      default:
        includeArr = [
          {
            model: models.learningObjective,
            attributes: [
              "id",
              "title",
              "courseId",
              "chapterId",
              "unitId",
              [
                sequelize.literal(
                  `(
                    SELECT
                    CASE
                        WHEN COUNT(*)>0 THEN "UserLearningObjectives".completed ELSE  false END
                         FROM "UserLearningObjectives" AS "UserLearningObjectives"
                         WHERE
                         "UserLearningObjectives"."loId" ="learningObjectives".id
                           AND
                         "UserLearningObjectives"."userId" =${req.user}
                         GROUP BY "UserLearningObjectives".completed
                     )`
                ),
                "userLearningObjective",
              ],
            ],
          },
          models.gradeLevel,
          models.subject,
          { model: models.snack },
          models.unit,
          {
            model: models.chapter,
            include: [
              {
                model: models.flashcard,
                model: models.note,
              },
            ],
          },
        ];
    }

    const fetchableData = {
      where: {
        id: courseId,
      },
      include: includeArr,
    };

    let courseDetail = await models.course.findOne(fetchableData);

    // let courseDetail = await models.course.findOne({
    //   where: {
    //     id: courseId,
    //   },
    //   include: [
    //     {
    //       model: models.learningObjective,
    //       attributes: [
    //         "id",
    //         "title",
    //         "courseId",
    //         "chapterId",
    //         "unitId",
    //         [
    //           sequelize.literal(
    //             `(
    //               SELECT
    //               CASE
    //                   WHEN COUNT(*)>0 THEN "UserLearningObjectives".completed ELSE  false END
    //                    FROM "UserLearningObjectives" AS "UserLearningObjectives"
    //                    WHERE
    //                    "UserLearningObjectives"."loId" ="learningObjectives".id
    //                      AND
    //                    "UserLearningObjectives"."userId" =${req.user}
    //                    GROUP BY "UserLearningObjectives".completed
    //                )`
    //           ),
    //           "userLearningObjective",
    //         ],
    //       ],
    //     },
    //     models.gradeLevel,
    //     models.subject,
    //     { model: models.snack },
    //     models.unit,
    //     {
    //       model: models.chapter,
    //       include: [
    //         {
    //           model: models.flashcard,
    //           model: models.note,
    //         },
    //       ],
    //     },
    //   ],
    // });

    // let learningObjectives = await models.learningObjective.findAll({
    //   where: {
    //     courseId,
    //   },
    //   attributes: ["id"],
    // });

    // learningObjectives = await models.UserLearningObjective.findAll({
    //   raw: true,
    //   where: {
    //     loId: {
    //       [Op.in]: learningObjectives.map(({ id }) => id),
    //     },
    //   },
    //   attributes: ["loId", "completed"],
    // }).map(({ loId }) => loId);

    // filtering and setting learning objive status

    // let tempData = courseDetail.learningObjectives;

    // tempData = tempData.map((loData) => {
    //   console.log(loData.userLearningObjective);
    //   if (loData.dataValues.userLearningObjective == null) {
    //     console.log("================================");
    //     return { ...loData.dataValues, userLearningObjective: false };
    //   }
    //   return loData;
    // });
    // console.log(tempData);
    // courseDetail.learningObjectives = tempData;

    // courseDetail.setDataValue("learningObjectives", tempData);

    return res.json({
      data: courseDetail,
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const publishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseDetail = await models.course.update(
      {
        published: true,
      },
      {
        where: {
          id: courseId,
        },
      }
    );
    return res.json({
      data: courseDetail,
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    await models.course.deleteCourse(courseId);
    return res.json({
      data: null,
      response: "Course deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const clearCourses = async (req, res, next) => {
  try {
    const { limit = 10, published } = req.query;

    let where = {};
    if (published && published === "false") {
      where["published"] = false;
    }
    const courses = await models.course.findAll({
      attributes: ["id"],
      limit: limit,
      where,
    });
    const courseIds = courses.map((course) => course.id);

    models.unit
      .destroy({
        where: {
          courseId: {
            [Op.in]: courseIds,
          },
        },
      })
      .then(async () => {
        await models.course.destroy({
          where: {
            id: {
              [Op.in]: courseIds,
            },
          },
          force: true,
        });
      });

    return res.json({
      data: null,
      response: `${courseIds.length} courses deleted successfully`,
      error: false,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const extractTitles = async (req, res, next) => {
  try {
    const { id } = req.params;
    let includeArr;

    const isUnitAvl = await models.course.findOne({
      where: { id: id },
    });
    if (isUnitAvl.haveUnits) {
      includeArr = [
        {
          model: models.unit,
          include: [
            {
              model: models.chapter,
              include: [
                {
                  model: models.snack,
                },
              ],
            },
          ],
        },
      ];
    } else {
      includeArr = [
        {
          model: models.chapter,
          include: [
            {
              model: models.snack,
            },
          ],
        },
      ];
    }

    const titles = await models.course.findOne({
      where: { id: id },
      include: includeArr,
    });

    if (!titles) {
      return res.status(400).send({
        statusCode: 400,
        message: "Records not found!",
        data: {},
      });
    }

    return res.status(200).send({
      statusCode: 200,
      message: "Records fetched successfully!",
      data: titles,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createNewCourse,
  getCourses,
  myCourses,
  courseVisited,
  courseSyllabus,
  publishCourse,
  deleteCourse,
  clearCourses,
  extractTitles,
};
