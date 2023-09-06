const router = require("express").Router();
const {
  create,
  deleteOne,
  updateOne,
  list
} = require("../app/controllers/subject");
const { auth,admin, } = require("../middlewares/auth");
router.use([auth,admin]);

router.post("/", create);
router.get("/",list)
router.delete("/:subjectId", deleteOne);
router.put("/:subjectId", updateOne);

module.exports = router;
