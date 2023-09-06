const router = require("express").Router();
const { checkEmail, forgotPassword,validate_forgotpassword,updatePassword } = require("../app/controllers/auth");
const { auth, admin } = require("../middlewares/auth");
// router.use([auth, admin]);

router.get("/check-email/:email", checkEmail);
router.post("/validate-forgotpassword", validate_forgotpassword);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", updatePassword);



module.exports = router;
