const router = require("express").Router();

const {
  create,
  login,
  updatePassword,
  me,
  createSystemUser,
  changeRole,
  uploadUserImage,
  updateProfile,
  emailList,
  saveStats,
} = require("../app/controllers/user");

const { dasboardStats } = require("../app/controllers/user");
const { auth, admin } = require("../middlewares/auth");

router.put("/admin-access/:userId", changeRole);
router.post("/", create);
router.post("/create-system-user", createSystemUser);
router.post("/login", login);
router.use(auth);
router.post("/update-password", updatePassword);
router.post("/stats", saveStats);
router.get("/me", me);
router.get("/profiles", emailList);
router.get("/dasboard-stats", dasboardStats);
router.post("/user-image", uploadUserImage);
router.put("/", updateProfile);

module.exports = router;
