import Joi from 'joi';

const authorSchema = Joi.object({
  name: Joi.string().required().min(2).max(255),
  bio: Joi.string().max(1000), // Điều này cho phép bio có tối đa 1000 ký tự
});

export { authorSchema };