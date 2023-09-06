const router = require("express").Router();
const { create, list,deleteUnit,editUnit } = require("../app/controllers/unit");
const { auth, admin } = require("../middlewares/auth");
router.use([auth, admin]);

router.post("/", create);
router.get("/:courseId", list);
router.delete("/:unitId", deleteUnit);
router.put("/:unitId", editUnit);


module.exports = router;
