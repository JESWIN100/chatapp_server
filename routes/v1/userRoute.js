import express from 'express'
import { checkUser, getCurrentChatters, getUserBySearch, logout, updateProfilePic, userCreate, userLogin, userLoginByEmail, userLoginByUsername, userProfile } from '../../controllers/userController.js'
import { upload } from '../../middleware/uploadMiddleWare.js'
import isLogin from '../../middleware/isLogin.js'


const router=express.Router()

router.post('/create',upload.single('image'),userCreate)
router.post('/login',userLogin)
router.post('/Namelogin', userLoginByUsername);
router.post('/Emaillogin', userLoginByEmail);
router.put('/updateProfilePic', isLogin, upload.single('image'), updateProfilePic);

 

router.post('/logout',logout)
router.get('/profile', isLogin,userProfile);
router.get("/check-user",isLogin,(checkUser))

router.get('/search',isLogin, getUserBySearch)
router.get('/currentChatters',isLogin, getCurrentChatters)


export default router