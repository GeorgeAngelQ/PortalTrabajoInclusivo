import express from "express";
import userAuth from "../Middlewares/authMiddleware.js";
import { CreateJobController, GetAllJobsController, UpdateJobController, DeleteJobController } from "../Controllers/jobController.js";

const router = express.Router();

router.post("/create-job", userAuth, CreateJobController);
router.get("/get-jobs", userAuth, GetAllJobsController);
router.patch("/update-job/:id", userAuth, UpdateJobController);
router.delete("/delete-job/:id", userAuth, DeleteJobController);
export default router;