const router = require("express").Router();
const {
  addNote,
  list,
  deleteOne,
  updateOne,
  deleteAllBySnack,
} = require("../app/controllers/notes");
const { auth, admin } = require("../middlewares/auth");

router.use(auth);
router.get("/snack-id/:resourceId", list);
router.use(admin);
router.post("/", addNote);
router.delete("/:noteId", deleteOne);
router.put("/:noteId", updateOne);
router.delete("/delete-all/:snackId", deleteAllBySnack);

module.exports = router;
