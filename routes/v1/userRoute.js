import express from 'express'
import { getCurrentChatters, getUserBySearch, logout, userCreate, userLogin, userProfile } from '../../controllers/userController.js'
import { upload } from '../../middleware/uploadMiddleWare.js'
import isLogin from '../../middleware/isLogin.js'


const router=express.Router()

router.post('/create',upload.single('image'),userCreate)
router.post('/login',userLogin)
router.post('/logout',logout)
router.get('/profile', isLogin,userProfile);

router.get('/search',isLogin, getUserBySearch)
router.get('/currentChatters',isLogin, getCurrentChatters)


export default router