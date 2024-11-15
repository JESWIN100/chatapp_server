import jwt from 'jsonwebtoken'
import User from '../model/userSchema.js';


 const isLogin=(req,res,next)=>{
    try {
        
        const token=req.cookies.jwt; 
        console.log(token);
        
        if(!token) return res.status(401).json({msg:'Please login first'})
            const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({msg:'Token is invalid'})
        }
        const user=User.findById(decode.userId).select("-password")
        if(!user) return res.status(404).json({msg:'User not found'})
            req.user=user,
        next();

        
    } catch (error) {
        console.log("error from isLogin",error);
         res.status(500).send({scuess:false ,message:error.message})
        
    }

}
export default isLogin

