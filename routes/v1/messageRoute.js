import express from 'express'
import isLogin from '../../middleware/isLogin.js'
import { getMessages, sendMessage } from '../../controllers/messageController.js'


const router=express.Router()

router.post('/send/:receiverId',isLogin,sendMessage)
router.get('/get/:receiverId',isLogin,getMessages)

export default router