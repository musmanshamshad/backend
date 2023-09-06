const router = require("express").Router();
const {
  addFC,
  list,
  deleteOne,
  updateOne,
  deleteAllBySnack,
  undoMyLibraryFC,
  trackScore,
  fetchContentOfFlashcard,
} = require("../app/controllers/flashcard");
const { auth, admin } = require("../middlewares/auth");

router.get("/content", fetchContentOfFlashcard);

router.use(auth);
router.post("/track-score/:fcId", trackScore);
router.post("/undo-copy/:stackId", undoMyLibraryFC);
router.get("/:resourceId", list);

router.use(admin);
router.delete("/delete-all/:snackId", deleteAllBySnack);
router.delete("/:flashcardId", deleteOne);
router.put("/:flashcardId", updateOne);
router.post("/", addFC);

module.exports = router;
