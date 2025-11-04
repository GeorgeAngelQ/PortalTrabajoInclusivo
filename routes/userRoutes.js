import express from 'express';
import userAuth from '../Middlewares/authMiddleware.js';
import { updateUserController } from '../Controllers/userController.js';

const router = express.Router();

router.put('/update-user', userAuth, updateUserController);

export default router;