import { askAIS, ragS, agentS} from '../services/aiEngineeringService.js';
import { CONSTANT_MSG } from '../config/constant_messages.js';

export async function askAIC(req, res) {
    try {
        const askAI = await askAIS(req.body);
        return res.status(askAI.statusCode).send(askAI);
    } catch (error) {
        console.log("Error in Register API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

export async function ragC(req, res) {
    try {
        let rag = await ragS(req.body);
        return res.status(rag.statusCode).send(rag);
    } catch (error) {
        console.log("Error in rag API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

export async function agentC(req, res) {
    try {
        let agent = await agentS(req.body);
        return res.status(agent.statusCode).send(agent);
    } catch (error) {
        console.log("Error in agent API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}