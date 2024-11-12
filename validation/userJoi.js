import Joi from "joi";

// Define Joi validation schema
 export const userSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    image: Joi.string().uri().optional()
});
