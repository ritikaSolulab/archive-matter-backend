import Joi from 'joi';

export const addUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})