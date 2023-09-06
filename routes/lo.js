const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
  create,
  deleteOne,
  updateOne,
  list,
  loOfChapter,
  uploadImage,
  getLoById,
} = require("../app/controllers/lo");
const { auth, admin } = require("../middlewares/auth");

router.use(auth);
// its course id not chapterId - course syllabus
router.get("/chapterId/:chapterId", list);
router.get("/chapter/:chapterId", loOfChapter);
router.use(admin);
router.post("/", create);
router.delete("/:loId", deleteOne);
router.put("/:loId", updateOne);
router.post("/upload-image", upload.single("image"), uploadImage);

/**
 * Author: Farzan
 * @description: Fetch learnign objective by Id
 */
router.get("/:id", getLoById);

module.exports = router;
