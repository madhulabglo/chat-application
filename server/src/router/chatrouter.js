const express = require("express")
const {protect}= require("../middleware/authmiddleware")

const chatController = require("../controller/chatcontroller")

const router = express.Router()

router.post(`/`,protect,chatController?.accessChat)
router.get(`/`,protect,chatController?.fetchChats)
router.post(`/group`,protect,chatController?.createGroupChat)
router.put(`/rename`,protect,chatController?.renameGroup)
router.put(`/groupremove`,protect,chatController?.removeFromGroup)
router.put(`/groupadd`,protect,chatController?.addToGroup)

module.exports = router

