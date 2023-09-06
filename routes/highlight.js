const router = require("express").Router();

const { auth } = require("../middlewares/auth");
const {
  create,
  listHighlights,
  updateHlight,
  deleteHighlights,
} = require("../app/controllers/highlight");
router.use(auth);
router.post("/", create);
router.get("/:resourceId", listHighlights);
router.put("/:id", updateHlight);
router.delete("/:resourceId", deleteHighlights);

module.exports = router;
