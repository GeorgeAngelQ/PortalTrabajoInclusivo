import express from "express";
import {
  createApplication,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../Controllers/applicationController.js";

import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, authorizeRoles("usuario"), createApplication);
router.get("/user", protect, authorizeRoles("usuario"), getUserApplications);
router.get("/job/:jobId",   protect, authorizeRoles("empresa", "admin"), getJobApplications);
router.put("/:id/status", protect, authorizeRoles("empresa", "admin"), updateApplicationStatus);
router.delete("/:id", protect, authorizeRoles("usuario", "admin"), deleteApplication);

export default router;
