import express from "express";
import {
  registerController,
  loginController,
} from "../Controllers/authController.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})

const router = express.Router();

router.post("/register", limiter, registerController);
router.post("/login", limiter, loginController);

export default router;
