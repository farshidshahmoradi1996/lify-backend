import * as Joi from 'joi';

export const UserValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  name: Joi.string().required(),
  password: Joi.string().required().min(5),
});
