import jwt from 'jsonwebtoken';
import { Token } from '../models/mongo/index.js';
import { CONSTANT_MSG } from '../config/constant_messages.js';
import { ObjectId as ObjectID } from 'mongodb';

export async function checkJwtToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ statuCode: 401, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_NO_PERMISSION_ERROR });
    }
    const token = authHeader.split(' ')[1]
    if (token) {
        const userTokenValid = await Token.findOne({ token: token });
        if (!userTokenValid) {
            return res.status(401).send({ statuCode: 401, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_NO_PERMISSION_ERROR, data: { isLogout: true } });
        }
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).send({ statuCode: 401, message: err.message, data: { isTokenExpired: true } });
            } else {
                req.user = user;
                next();
            }
        });
    }
    else {
        return res.status(401).send({ statuCode: "401", message: "Invalid Request : Authentication Error" });
    }
}

export async function getJwtToken(req) {
    const token = jwt.sign({ email: req.email, userRole: req.userRole, mobile: req.mobile, userId: req._id }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "10d" })
    const Obj = {
        token: token,
        userId: req._id
    }
    const tokenSave = Token(Obj);
    await tokenSave.save();
    return token;
}