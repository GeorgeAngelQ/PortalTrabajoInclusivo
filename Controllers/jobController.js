import moment from "moment";
import Job from "../Models/jobModel.js";
import mongoose from "mongoose";

export const CreateJobController = async (req, res, next) => {
  const { company, position, jobLocation } = req.body;
  if (!company || !position || !jobLocation) {
    return next("Por favor, complete todos los campos obligatorios");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ job });
};

export const GetAllJobsController = async (req, res, next) => {
    const { status, jobType, search, sort } = req.query;
    let queryObject = {
        createdBy: req.user.userId,
    };
    if(status && status !== "all"){
        queryObject.status = status;
    }
    if(jobType && jobType !== "all"){
        queryObject.jobType = jobType;
    }
    if(search){
        queryObject.position = {$regex: search, $options: "i"};
    }
    if(sort === "latest"){
        queryObject = Job.find(queryObject).sort("-createdAt");
    }
    if(sort === "oldest"){
        queryObject = Job.find(queryObject).sort("createdAt");
    }
    if(sort === "a-z"){
        queryObject = Job.find(queryObject).sort("position");
    }
    if(sort === "z-a"){
        queryObject = Job.find(queryObject).sort("-position");
    }
    const queryResult = Job.find(queryObject);
    const jobs = await queryResult;
  res.status(200).json({ TotalJobs: jobs.length, jobs });
};

export const UpdateJobController = async (req, res, next) => {
  const { id: jobId } = req.params;
  const { company, position, jobLocation } = req.body;
  if (!company || !position || !jobLocation) {
    return next("Por favor, complete todos los campos obligatorios");
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return next(`No se encontró el trabajo con id: ${jobId}`);
  }
  if (job.createdBy.toString() !== req.user.userId) {
    return next("No está autorizado para actualizar este trabajo");
  }
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updatedJob });
};

export const DeleteJobController = async (req, res, next) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return next(`No se encontró el trabajo con id: ${jobId}`);
  }
  if (job.createdBy.toString() !== req.user.userId) {
    return next("No está autorizado para eliminar este trabajo");
  }
  await Job.findOneAndDelete({ _id: jobId });
  res.status(200).json({ msg: "Trabajo eliminado correctamente" });
};

export const JobStatsController = async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await Job.aggregate([
      { $match: { createdBy: userObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const defaultStats = {
      Pendiente: stats.find((item) => item._id === "Pendiente")?.count || 0,
      "En progreso":
        stats.find((item) => item._id === "En progreso")?.count || 0,
      Completado: stats.find((item) => item._id === "Completado")?.count || 0,
    };

    let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: userObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM YYYY");
        return { date, count };
      })
      .reverse();

    res.status(200).json({
      success: true,
      defaultStats: defaultStats,
      stats: stats,
      monthlyApplications: monthlyApplications,
    });
  } catch (error) {
    next(error);
  }
};
