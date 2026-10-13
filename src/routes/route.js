import { Router } from 'express';
import multer, { memoryStorage } from 'multer';

import { checkJwtToken } from "../middleware/authendication.js";
import { checkManagerRole, checkAdminRole } from "../middleware/authorization.js";
import { register, login } from '../controllers/authController.js';
import { singleFileUpload, multiFileUpload, readS3Files } from "../config/fileUpload.js";
import { agentC, askAIC, ragC } from '../controllers/aiEngineeringController.js';
export const router = Router();

const multerMid = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
})

//Auth Controller
router.post('/register', register);
router.post('/login', login);


router.post('/ask-ai', askAIC);
router.post('/rag', ragC);
router.post('/agent', agentC);
