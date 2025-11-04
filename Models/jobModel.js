import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "El puesto es obligatorio"],
      maxlength: [100, "El puesto no puede tener más de 100 caracteres"],
    },
    company: {
      type: String,
      required: [true, "La empresa es obligatoria"],
      maxlength: [
        100,
        "El nombre de la empresa no puede tener más de 100 caracteres",
      ],
    },
    jobLocation: {
      type: String,
      default: "Lima-Sur",
      enum: ["Santiago de Surco", "Chorrillos", "San Juan de Miraflores", "Villa el Salvador"],
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Tiempo completo", "Medio tiempo", "Remoto", "Presencial"],
      default: "Tiempo completo",
    },
    status: {
      type: String,
      enum: ["Pendiente", "En progreso", "Completado"],
      default: "Pendiente",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User"    },
  },
  { timestamps: true }
);
const Job = mongoose.model("Job", jobSchema);

export default Job;