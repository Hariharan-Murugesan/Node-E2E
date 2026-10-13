import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export const MODEL = process.env.OPENAI_MODEL || 'gpt-5.5';

export async function askLLM(question) {
    const response = await openai.responses.create({
        model: MODEL,
        instructions: 'You are a helpful Node.js programming assistant. Give clear, accurate answers.',
        input: question
    });

    return response.output_text;
}