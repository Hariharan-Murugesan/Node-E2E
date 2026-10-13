import { createUserS, loginS } from '../services/authService.js';
import { signIn, signUp } from '../validator/validation.js';
import { getJwtToken } from "../middleware/authendication.js";
import { CONSTANT_MSG } from '../config/constant_messages.js';

// Register
export async function register(req, res) {
    try {
        await signUp.validateAsync(req.body);
        const user = await createUserS(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Register API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}

// Login
export async function login(req, res) {
    try {
        await signIn.validateAsync(req.body);
        let user = await loginS(req.body);
        if (user.status != 'error') {
            user.token = await getJwtToken(user.data);
        }
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Login API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
}