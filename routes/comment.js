const router = require("express").Router();

const { auth } = require("../middlewares/auth");
const {
  create,
  update,
  deleteComment,
  list,
} = require("../app/controllers/comment");
router.use(auth);
router.post("/", create);
router.get("/:resourceId", list);
router.put("/", update);
router.delete("/:resourceId", deleteComment);

module.exports = router;
