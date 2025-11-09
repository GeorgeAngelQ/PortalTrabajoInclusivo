import Job from "../Models/jobModel.js";
import Enterprise from "../Models/enterpriseModel.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, requisites, contractType, location, accesibility, categoriaId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Título y descripción son obligatorios" });
    }
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado para crear ofertas laborales" });
    }

    const newJob = new Job({
      enterpriseId: req.user.id, 
      title,
      description,
      requisites,
      contractType,
      location,
      accesibility,
      categoriaId,
    });

    await newJob.save();

    res.status(201).json({
      message: "Oferta laboral creada exitosamente",
      job: newJob,
    });
  } catch (error) {
    console.error("❌ Error al crear oferta:", error);
    res.status(500).json({ message: "Error interno al crear oferta" });
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
