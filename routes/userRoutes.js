import express from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile, deleteUser } from '../Controllers/userController.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/update-user', protect, updateUserProfile);
router.delete('/delete-user', protect, deleteUser);
export default router;