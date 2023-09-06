const router = require("express").Router();
const {
  create,
  list,
  deleteOne,
  updateOne,
  getChaptersAlongWithLearningObjectives,
} = require("../app/controllers/chapter");
const { auth, admin } = require("../middlewares/auth");
router.get("/:id", list);
router.use([auth, admin]);
router.post("/", create);
router.delete("/:chapterId", deleteOne);
router.put("/:chapterId", updateOne);

/**
 * Author : Farzan
 * @description: Fetch chapters along with their learning objectives
 */
router.get("/learningobjective/:id", getChaptersAlongWithLearningObjectives);
module.exports = router;
