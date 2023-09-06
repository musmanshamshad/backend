const router = require("express").Router();
const {
  createNewSnack,
  list,
  updateOne,
  removeSnack,
} = require("../app/controllers/snack");
const { auth, admin } = require("../middlewares/auth");
router.use([auth, admin]);

router.post("/", createNewSnack);
router.get("/:chapterId", list);
router.delete("/:snackId", removeSnack);
router.put("/:snackId", updateOne);

module.exports = router;
