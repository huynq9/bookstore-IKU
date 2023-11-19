import joi  from "joi";

export const bookSchema = joi.object({
    _id: joi.string(),
    title: joi.string().required().min(3).max(255),
    description: joi.string().required().min(3),
    authorName: joi.array().items(joi.string()).required(),
    categoryId: joi.alternatives().try(joi.string(), joi.array().items(joi.string())),
    images: joi.array().items(
        joi.object({
            url: joi.string().required(),
            publicId: joi.string().required()
        })
    ),
    price:joi.number().min(1).required(),
    stock:joi.number().min(0).required(),
    publishedAt: joi.date().iso(),
    soldCount: joi.number(),
    discount:joi.number().min(1)
})