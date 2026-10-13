import { User } from '../models/mongo/index.js';
import { hash } from 'bcryptjs';
import { CONSTANT_MSG } from '../config/constant_messages.js';

export async function createUserS(reqBody) {
    try {
        let user = User(reqBody)
        if (reqBody.mobile && await User.findOne({ mobile: reqBody.mobile })) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.EMAIL.MOBILENO_EXISTING
            };
        }
        if (reqBody.email != null && await User.findOne({ email: reqBody.email })) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.EMAIL.EMAIL_EXISTING
            };
        }
        reqBody.password = reqBody.password ? await hash(reqBody.password, 5) : '';
        await user.save()
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.RESIGTER_SUCCESSFULLY,
            data: userDetails
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
}

export const loginS = async (reqBody) => {
    try {
        let user = await User.findOne({ $or: [{ mobile: reqBody.username }, { email: reqBody.username }] }, { createdAt: 1, mobile: 1, email: 1, name: 1, password: 1 })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.USER_NOT_REGISTED
            };
        }
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.LOGIN_SUCCESSFULLY,
            data: userDetails
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};