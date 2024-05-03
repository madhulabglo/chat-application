const express = require("express")
const {protect}= require("../middleware/authmiddleware")

const messageController = require("../controller/messagecontroller")

const router = express.Router()

router.post(`/`,protect,messageController?.sendMessage)
router.get(`/:chatId`,protect,messageController?.allMessages)


module.exports = router