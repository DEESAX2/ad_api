import Joi from "joi";

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(1024).required(),
    role: Joi.string().valid('vendor', 'customer').default('customer')
});

export const signUpSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('vendor', 'customer').default('vendor'),
    password: Joi.string().min(5).max(1024).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(5).max(1024).required()
})