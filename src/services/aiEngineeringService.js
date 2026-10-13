
import { runAgent } from '../ai-engineering/ai-agents/agent.js';
import { askLLM } from '../ai-engineering/openai-api/openai.js';
import { answerFromKnowledge } from '../ai-engineering/rag/rag.js';
import { CONSTANT_MSG } from '../config/constant_messages.js';

export async function askAIS(reqBody) {
    try {
        const { question } = reqBody;

        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                message: 'Question is required'
            });
        }
            askLLM
        const answer = await  askLLM(question.trim());

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "Success",
            data: answer
        };
    } catch (error) {
        console.error('LLM error:', error.message);

        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

export async function ragS(reqBody, res) {
    try {
        const { question } = reqBody;

        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                message: 'Question is required'
            });
        }
        const result = await answerFromKnowledge(question.trim());

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "Success",
            data: answer
        };
    } catch (error) {
        console.error('RAG error:', error.message);

        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

export async function agentS(reqBody, res) {
    try {
        const { question } = reqBody;

        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                message: 'Question is required'
            });
        }
        const answer = await runAgent(question.trim());

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: "Success",
            data: answer
        };
    } catch (error) {
        console.error('Agent error:', error.message);

        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}