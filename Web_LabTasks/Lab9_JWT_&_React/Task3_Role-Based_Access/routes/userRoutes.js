import express from "express";
import {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword,
    verifyToken,
    requireRole,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/api/auth/register', registerUser);
router.post('/api/auth/login', loginUser);
router.post('/api/auth/forgot-password', forgotPassword);
router.post('/api/auth/reset-password/:token', resetPassword);
router.get('/admin', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: "Welcome to the content management panel!" });
});

export default router;