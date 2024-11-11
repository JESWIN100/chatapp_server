import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import { userSchema } from "../validation/userJoi.js";
import jwtToken from "../utils/jsonWebToken.js"
import Conversation from "../model/conversationSchema.js";

export const userCreate = async (req, res) => {
    try {
        const { fullName, userName, email, password, gender, profilePic } = req.body;

        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if the username or email already exists
        const existingUsername = await User.findOne({ userName });
        const existingEmail = await User.findOne({ email });
        if (existingUsername || existingEmail) {
            return res.status(400).json({ message: "User with this username or email already exists" });
        }

        // Ensure all required fields are provided
        if (!fullName || !userName || !email || !password || !gender) {
            return res.status(400).json({ message: "Fill all the blanks" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Default image URL
        let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s";

        // Check if an image was uploaded
        if (req.file) {
            const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "chatapp" });
            if (uploadResult?.url) {
                imageUrl = uploadResult.url;
            }
        }

        // Create new user
        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashPassword,
            gender,
            profilePic: imageUrl
        });

        await newUser.save();
        jwtToken(newUser._id,res)
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email Doesn't Exist" });
        }

        const comparePassword = bcrypt.compareSync(password, user.password || "");
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        jwtToken(user._id,res)

        res.status(200).json({
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "User Login Error" });
    }
};



export const userLoginByUsername = async (req, res) => {
    try {
        const { userName } = req.body;

        // Ensure the username is provided
        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Find the user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a JWT token
        jwtToken(user._id, res);

        res.status(200).json({ message: "Login successful", user: { userName: user.userName, email: user.email } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const userLoginByEmail = async (req, res) => {
    try {
        const { email } = req.body;

       
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        jwtToken(user._id, res);

        res.status(200).json({ message: "Login successful", user: { email: user.email } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};






export const userProfile=(async(req,res,next)=>{
  

    const userId=req.user._conditions._id
    
    const userData = await User.findById(userId).select("-password");

    
  res.json({success:true,message:'user data fetched',data:userData})


    } )
     



export const checkUser=(async(req,res,next)=>{


        const user=req.user._conditions._id
        console.log(user);
        
        if(!user){
            return res.status(401).json({success:false,message:'user not authenticated'})
            }
        
      res.json({success:true,message:'user is authenticated'})
    
    
        } )

export const logout=async(req,res)=>{
    try {
        res.clearCookie('jwt','',{
            maxAge:0,
        })
        res.status(200).json({ message: "User logged out successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "User logout Error" });
        
        
    }
}
export const updateProfilePic = async (req, res) => {
    try {
        const userId = req.user._conditions._id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file) {
            // Upload the new image to Cloudinary
            const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "chatapp" });
            const newImageUrl = uploadResult?.url;

            user.profilePic = newImageUrl;

            await user.save();
            return res.status(200).json({ message: "Profile picture updated successfully", profilePic: newImageUrl });
        }

        return res.status(400).json({ message: "No image file uploaded" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" }); 
    }
};




export const getUserBySearch=async(req,res)=>{
try {
    const search=req.query.search || ''
    const currentUserId=req.user._conditions._id;

    const user=await User.find({
        $and:[
            {
                $or: [
                    {userName:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullName:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            },{
                _id:{$ne:currentUserId}
            }
        ]
    }).select('-password').select('-email')
    res.status(200).json(user);
    
} catch (error) {
    console.log(error);
    res.status(500).send({ scuess: false, message: error.message })
    
}
}

export const getCurrentChatters=async(req,res,next)=>{
    try {
        const currentUserId=req.user._conditions._id;
        const CurrentChatters=await Conversation.find({
            participants:currentUserId
        }).sort({
            updatedAt: -1
        })
        if(!CurrentChatters || CurrentChatters.length===0){
            return res.status(200).send([])
        }
        const participantsIds=CurrentChatters.reduce((ids,Conversation)=>{
            const otherParticipants=Conversation.participants.filter(id=>id !== currentUserId)
            return [...ids, ...otherParticipants]
        },[])
        const otherParticipantsIds=participantsIds.filter(id=>id.toString() !==currentUserId.toString())

        const user=await User.find({_id:{$in:otherParticipantsIds}}).select("-password").select("-email")

        const users=otherParticipantsIds.map(id=>user.find(user=>user._id.toString()===id.toString()))

        res.status(200).json(users)
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ scuess: false, message: error.message })

    }
}