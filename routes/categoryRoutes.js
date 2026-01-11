import express from "express";
import {createCategory , getCategories} from "../Controllers/categoryController.js";

import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("empresa"), createCategory);
router.get("/", protect, authorizeRoles("empresa", "usuario"), getCategories);


export default router;