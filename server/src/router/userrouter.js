const express = require("express")

const router = express.Router()

const Usercontroller = require("../controller/user.controller")
const {protect} = require("../middleware/authmiddleware")

router.post(`/user/register`,Usercontroller?.Register)
router.post(`/user/login`,Usercontroller?.Login)
router.get(`/user/list`,Usercontroller?.userList)
router.get(`/user`,protect,Usercontroller?.allUsers)

module.exports = router;
