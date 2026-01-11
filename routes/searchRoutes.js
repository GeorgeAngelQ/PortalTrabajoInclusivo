import express from "express";
import { searchFunction } from "../Controllers/searchController.js";
import { protect,authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",protect, authorizeRoles("usuario","empresa"), searchFunction);

export default router;