const router = require("express").Router();
const {
  createNewCourse,
  getCourses,
  myCourses,
  courseVisited,
  courseSyllabus,
  publishCourse,
  deleteCourse,
  clearCourses,
  extractTitles,
} = require("../app/controllers/course");
const { auth, admin } = require("../middlewares/auth");
// router.use([auth,admin]);

router.use(auth);
// my courses
router.get("/:courseId", courseSyllabus); // Optional query param - type = ['syllabus', 'notes', 'flashcards']
router.get("/user/courses", myCourses);
router.post("/visit", courseVisited);
router.use(admin);
router.put("/:courseId", publishCourse);
router.delete("/:courseId", deleteCourse);
router.delete("/clear/all", clearCourses);
router.post("/", createNewCourse);
router.get("/", getCourses);

/**
 * Get units, chapters and snacks of a course by Id
 */
router.get("/extracttitles/:id", extractTitles);

module.exports = router;
