import { Schema, model } from 'mongoose';

const tokenSchema = Schema(
    {
        token: {
            type: String,          
        },
        userId: {
            type: String,
        },           
        isactive:{
            type: Boolean,
            default: true
        },        
    },
    {
        timestamps: true,
    }
);

export const TokenM = model('Token', tokenSchema,'Token');