const router = require("express").Router();
const { insertLearnObj } = require("../app/controllers/userLearnObj");
const { auth } = require("../middlewares/auth");
router.use(auth);
router.post("/:loId", insertLearnObj);

module.exports = router;
