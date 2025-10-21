import joi from 'joi';

export const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

export const blogSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    content: joi.string().min(10).required(),
});

export function validateSchema<T>(schema: joi.ObjectSchema<T>, data: any): { value?: T; error?: string } {
    const { value, error } = schema.validate(data, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return { error: errorMessage };
    }
    return { value };
}