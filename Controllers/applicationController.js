import Application from "../Models/applicationModel.js";
import Job from "../Models/jobModel.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Oferta laboral no encontrada" });
    }

    const existing = await Application.findOne({ jobId, userId });
    if (existing) {
      return res.status(400).json({ message: "Ya has postulado a esta oferta" });
    }

    const newApplication = await Application.create({
      jobId,
      userId,
      message,
    });
    
    res.status(201).json({
      message: "Postulación enviada correctamente",
      application: newApplication,
    });
  } catch (error) {
    console.error("❌ Error al crear postulación:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate({
        path: "jobId",
        select: "title location contractType status",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error al obtener postulaciones del usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Oferta laboral no encontrada" });
    }

    if (req.user.role === "empresa" && job.enterpriseId.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para ver estas postulaciones" });
    }

    const applications = await Application.find({ jobId })
      .populate("userId", "name lastname email profile.location profile.discapacity")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error al obtener postulaciones del empleo:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["postulado", "en revisión", "aceptado", "rechazado"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    if (req.user.role === "empresa" && application.jobId.enterpriseId.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para modificar esta postulación" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: "Estado actualizado correctamente",
      application,
    });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    if (
      req.user.role !== "admin" &&
      application.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "No autorizado para eliminar esta postulación" });
    }

    await application.deleteOne();

    res.status(200).json({ message: "Postulación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar postulación:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
