const router = require("express").Router();
const { create, login, updatePassword ,makeAdmin,usersList,deleteUser} = require("../app/controllers/systemUser");
const {auth,admin} =require("../middlewares/auth")

router.post("/", create);
router.post("/login", login);
router.use(auth);
router.use(admin)
router.post("/update-password", updatePassword);
router.put("/admin-rights/:userId", makeAdmin);
router.get('/list',usersList)
router.delete('/:userId',deleteUser)



module.exports = router;
