import express from "express";
import { testController } from "../Controllers/testController.js";
import userAuth from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/test-post", userAuth, testController);

export default router;