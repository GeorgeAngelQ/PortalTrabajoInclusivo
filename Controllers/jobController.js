import Job from "../Models/jobModel.js";

export const CreateJobController = async (req, res, next) => {
    const {company, position, jobLocation} = req.body;
    if(!company || !position || !jobLocation){
        return next("Por favor, complete todos los campos obligatorios")
    }
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({job});
};

export const GetAllJobsController = async (req, res, next) => {
    const jobs =  await Job.find({createdBy: req.user.userId}).sort({createdAt: -1});
    res.status(200).json({TotalJobs: jobs.length, jobs});
}

export const UpdateJobController = async (req, res, next) => {
    const {id: jobId} = req.params;
    const {company, position, jobLocation} = req.body;
    if(!company || !position || !jobLocation){
        return next("Por favor, complete todos los campos obligatorios")
    }
    const job = await Job.findOne({_id: jobId});
    if(!job){
        return next(`No se encontró el trabajo con id: ${jobId}`);
    }
    if(job.createdBy.toString() !== req.user.userId){
        return next("No está autorizado para actualizar este trabajo");
    }
    const updatedJob = await Job.findOneAndUpdate(
        {_id: jobId},
        req.body,
        {new: true, runValidators: true}
    );
    res.status(200).json({updatedJob});
}

export const DeleteJobController = async (req, res, next) => {
    const {id: jobId} = req.params;
    const job = await Job.findOne({_id: jobId});
    if(!job){
        return next(`No se encontró el trabajo con id: ${jobId}`);
    }
    if(job.createdBy.toString() !== req.user.userId){
        return next("No está autorizado para eliminar este trabajo");
    }
    await Job.findOneAndDelete({_id: jobId});
    res.status(200).json({msg: "Trabajo eliminado correctamente"});
}