import joi  from "joi";

export const categorySchema = joi.object({
    _id: joi.string(),
    name: joi.string().required().min(3).max(255),
    description: joi.string().required().min(3).max(255),
    books: joi.alternatives().try(joi.string(), joi.array().items(joi.string())),
})