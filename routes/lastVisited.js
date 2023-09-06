const router = require("express").Router();
const {
  newVisited,
  listLastVisited,
} = require("../app/controllers/lastVisited");
const { auth, admin } = require("../middlewares/auth");
router.use(auth);

router.post("/", newVisited);
router.get("/", listLastVisited);

module.exports = router;
