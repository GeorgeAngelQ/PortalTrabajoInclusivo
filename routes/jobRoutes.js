import express from "express";
import userAuth from "../Middlewares/authMiddleware.js";
import {
  CreateJobController,
  GetAllJobsController,
  UpdateJobController,
  DeleteJobController,
  JobStatsController,
} from "../Controllers/jobController.js";
import Job from "../Models/jobModel.js";

const router = express.Router();

router.post("/create-job", userAuth, CreateJobController);
router.get("/get-jobs", userAuth, GetAllJobsController);
router.patch("/update-job/:id", userAuth, UpdateJobController);
router.delete("/delete-job/:id", userAuth, DeleteJobController);
router.get("/job-stats", userAuth, JobStatsController);

export default router;
