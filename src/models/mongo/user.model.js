import { Schema, model } from 'mongoose';

const userSchema = Schema(
    {
        name: {
            type: String,
        },
        password: {
            type: String,
        },
        mobile: {
            type: String,
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const UserM = model('User', userSchema, 'User');