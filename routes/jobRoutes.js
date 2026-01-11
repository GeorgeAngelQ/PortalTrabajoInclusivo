import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobEnums,
  updateJobStatus
} from "../Controllers/jobController.js";

import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getJobs);

router.get("/enums", protect, getJobEnums);
router.get("/:id", protect, getJobById);

router.post("/", protect, authorizeRoles("empresa"), createJob);
router.put("/:id", protect, authorizeRoles("empresa"), updateJob);
router.delete("/:id", protect, authorizeRoles("empresa"), deleteJob);
router.patch("/:id/status", protect, authorizeRoles("empresa"), updateJobStatus);

export default router;
