import express from 'express';
import { 
  login, 
  logout, 
  signup, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  checkAuth,
  checkResetPasswordToken
} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// check auth
router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup)
router.post('/logout', logout)
router.post('/login', login)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.get("/reset-password/:token", checkResetPasswordToken)

export default router