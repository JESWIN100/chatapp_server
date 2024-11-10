import express from 'express'
import userRoute from './userRoute.js'
import messageRoute from './messageRoute.js'


const v1Router=express.Router();

v1Router.use("/user",userRoute)
v1Router.use("/message",messageRoute)

export default v1Router