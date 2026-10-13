import joi from 'joi';

export const signUp = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().max(75).required(),
    mobile: joi.string().min(10).required(),
    password: joi.string().min(6).max(30).required()
});

export const signIn = joi.object({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(6).max(30).required()
});

export const readS3File = joi.object({
    key: joi.string().required(),
});

export const fileUpload = joi.object({
    isConfidential: joi.boolean().required(),
});