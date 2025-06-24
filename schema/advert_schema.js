import Joi from "joi"

export const advertSchema = Joi.object({
    title: Joi.string().required(),
    contact: Joi.number().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number(),
    image: Joi.string(),
    category: Joi.string().valid('Tech & Programming', 'Artisans', 'Food & Beverages', 'Education & Training', 'Health & Wellness' ).required(),
})