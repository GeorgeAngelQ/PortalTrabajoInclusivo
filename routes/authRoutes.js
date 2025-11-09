import express from "express";
import {
  registerUser,
  loginController,
  registerEnterprise,
} from "../Controllers/authController.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-enterprise", registerEnterprise);
router.post("/login", loginController);

export default router;
