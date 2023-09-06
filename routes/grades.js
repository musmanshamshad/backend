const router = require("express").Router();
const {
  create,
  deleteOne,
  updateOne,
  list,
} = require("../app/controllers/grade");
const { auth, admin } = require("../middlewares/auth");
router.get("/", list);
router.use([auth, admin]);
router.post("/", create);
router.delete("/:gradeId", deleteOne);
router.put("/:gradeId", updateOne);

module.exports = router;
