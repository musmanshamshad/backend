const router = require("express").Router();
const {
  moveNotes,
  listUserNotes,
  deleteUserNote,
  moveFlashcards,
  listUserFC,
  deleteUserFC,
  updateUserNote,
  updateUserFlashcard,
  resetUserNote,
  resetUserFlashcard,
  createFlashcardStack,
  clearNotes,
  clearFC,
  userNoteDetail,
  fetchContentOfUserNoteTag,
} = require("../app/controllers/myLibrary");
const { auth } = require("../middlewares/auth");
router.use(auth);

router.delete("/notes/clear", clearNotes);
router.delete("/flashcards/clear", clearFC);
router.get("/note-detail/:id", userNoteDetail);
router.put("/note/:id", updateUserNote);
router.put("/note/reset/:id", resetUserNote);
router.put("/flashcard/reset/:id", resetUserFlashcard);
router.put("/flashcard/:id", updateUserFlashcard);
router.post("/move/notes", moveNotes);
router.post("/move/flashcards", moveFlashcards);
router.post("/fcstack", createFlashcardStack);
router.get("/notes", listUserNotes);
router.get("/notes/content", fetchContentOfUserNoteTag);
router.get("/flashcards", listUserFC);
router.delete("/note/:noteId", deleteUserNote);
router.delete("/flashcard/:fcId", deleteUserFC);

module.exports = router;
