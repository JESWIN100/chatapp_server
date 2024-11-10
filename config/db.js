import mongoose from 'mongoose'

export const dbConnect=async()=>{
    try {  
        await mongoose.connect(process.env.MONGO_URl),
        console.log('DB connected')
        
    } catch (error) {
        console.log(error);
        
    }

}