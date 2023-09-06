const router = require("express").Router();
const {
  create,
  deleteOne,
  updateOne,
  list
} = require("../app/controllers/curriculum");
const { auth,admin, } = require("../middlewares/auth");
router.get("/",list)
router.use([auth,admin]);
router.post("/", create);
router.delete("/:curriculumId", deleteOne);
router.put("/:curriculumId", updateOne);

module.exports = router;
