import Job from "../Models/jobModel.js";
import {
  contractType,
  location,
  status,
  modality,
  educationLevel
} from "../Models/jobModel.js";
import Enterprise from "../Models/enterpriseModel.js";

export const createJob = async (req, res) => {
  try {
    const userId = req.user.id;

    const enterprise = await Enterprise.findOne({ userId });

    if (!enterprise) {
      return res.status(404).json({
        ok: false,
        message: "No se encontró la empresa asociada al usuario.",
      });
    }

    let {
      title,
      description,
      requisites,
      contractType,
      location,
      accesibility,
      salaryMin,
      salaryMax,
      modality,
      skills,
      benefits,
      deadline,
      tags,
      category,
      categoriaId,
      experienceMin,
      educationLevel
    } = req.body;

    requisites = requisites || [];
    skills = skills || [];
    benefits = benefits || [];
    tags = tags || [];

    accesibility = {
      remote: accesibility?.remote || false,
      physicalAdaptation: accesibility?.physicalAdaptation || false,
      languageInterpreter: accesibility?.languageInterpreter || false,
    };

    if (!title || !description) {
      return res.status(400).json({
        ok: false,
        message: "El título y la descripción son obligatorios.",
      });
    }

    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return res.status(400).json({
        ok: false,
        message: "El salario mínimo no puede ser mayor al salario máximo.",
      });
    }

    const newJob = new Job({
      enterpriseId: userId,
      title,
      description,
      requisites,
      contractType,
      location,
      accesibility,
      salaryMin,
      salaryMax,
      modality,
      skills,
      benefits,
      deadline,
      tags,
      category,
      categoriaId,
      experienceMin,
      educationLevel,

      enterpriseName: enterprise.companyName,
      enterpriseLogo: enterprise.logoURL,
      industry: enterprise.sector,
    });

    await newJob.save();

    return res.status(201).json({
      ok: true,
      message: "Oferta laboral creada correctamente.",
      job: newJob,
    });
  } catch (error) {
    console.error("❌ Error en createJob:", error);

    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al crear la oferta laboral.",
      error: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "empresa") {
      filter = { enterpriseId: req.user.id };
    } else if (req.user.role === "usuario") {
      filter = { status: "activa" };
    }

    const jobs = await Job.find(filter)
      .populate("enterpriseId", "name email")
      .populate("categoriaId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Error al listar ofertas:", error);
    res.status(500).json({ message: "Error interno al listar ofertas" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("enterpriseId", "name email")
      .populate("categoriaId", "name");

    if (!job) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("❌ Error al obtener oferta:", error);
    res.status(500).json({ message: "Error interno al obtener oferta" });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    if (job.enterpriseId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado para editar esta oferta" });
    }

    const fields = [
      "title",
      "description",
      "requisites",
      "contractType",
      "location",
      "accesibility",
      "status",
      "categoriaId",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();

    res.status(200).json({
      message: "Oferta actualizada correctamente",
      job,
    });
  } catch (error) {
    console.error("❌ Error al actualizar oferta:", error);
    res.status(500).json({ message: "Error interno al actualizar oferta" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    if (job.enterpriseId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado para eliminar esta oferta" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar oferta:", error);
    res.status(500).json({ message: "Error interno al eliminar oferta" });
  }
};
export const getJobEnums = (req, res) => {
  try {
    res.status(200).json({
      contractType,
      location,
      status,
      modality,
      educationLevel,
    });
  } catch (error) {
    console.error("❌ Error al obtener enums de oferta:", error);
    res.status(500).json({ message: "Error interno al obtener enums de oferta" });
  }
}
export const updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        message: "El estado es requerido (activo, pausado, cerrado)" 
      });
    }

    const validStatuses = ["activo", "pausado", "cerrado", "activa"];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: `Estado inválido. Estados permitidos: ${validStatuses.join(", ")}`
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    job.status = status; 
    await job.save();
    
    return res.status(200).json({
      message: "Estado de la oferta actualizado correctamente",
      job,
    });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ message: "Error interno al cambiar estado de la oferta" });
  }
};
