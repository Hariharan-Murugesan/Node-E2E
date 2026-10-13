import { CONSTANT_MSG } from '../config/constant_messages.js';
import { ObjectId as ObjectID } from 'mongodb';

export function checkManagerRole(feature, options) {
    return async (req, res, next) => {
        if (!req.user.userRole.includes('Manager')) {
            return res.status(401).send({ statusCode: 401, status: CONSTANT_MSG.STATUS.ERROR, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_ERROR });
        }
        next()
    }
}

export function checkAdminRole(feature, options) {
    return async (req, res, next) => {
        if (!req.user.userRole.includes('Admin')) {
            return res.status(401).send({ statusCode: 401, status: CONSTANT_MSG.STATUS.ERROR, message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_ERROR });
        }
        next()
    }
}