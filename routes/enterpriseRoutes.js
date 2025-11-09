import express from "express";
import {
  getEnterpriseProfile,
  updateEnterpriseProfile,
  deleteEnterprise
} from "../Controllers/enterpriseController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// router.post("/register", registerEnterprise);
// router.post("/login", loginEnterprise);
router.get("/profile", protect, getEnterpriseProfile)
router.put("/profile", protect, updateEnterpriseProfile)
router.delete("/profile", protect, deleteEnterprise);

export default router;