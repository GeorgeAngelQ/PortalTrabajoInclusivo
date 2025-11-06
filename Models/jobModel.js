import mongoose from "mongoose";

const accesibilitySchema = new mongoose.Schema({
  remote: { type: Boolean, default: false },
  physicalAdaptation: { type: Boolean, default: false },
  languageInterpreter: { type: Boolean, default: false },
});

const jobSchema = new mongoose.Schema(
  {
    enterpriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID de la empresa es obligatorio"],
    },
    title: {
      type: String,
      required: [true, "El título del puesto es obligatorio"],
      maxlength: [120, "El título no puede tener más de 120 caracteres"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción del puesto es obligatoria"],
      minlength: [20, "Debe incluir al menos 20 caracteres"],
      trim: true,
    },
    requisites: {
      type: [String],
      default: [],
    },
    contractType: {
      type: String,
      enum: ["Tiempo completo", "Medio tiempo", "Prácticas", "Temporal"],
      default: "Tiempo completo",
    },
    location: {
      type: String,
      enum: [
        "Lima Norte",
        "Lima Sur",
        "Lima Este",
        "Lima Centro",
        "Callao",
        "Remoto",
      ],
      default: "Lima Sur",
    },
    accesibility: accesibilitySchema,
    publishDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["activa", "pausada", "cerrada"],
      default: "activa",
    },
    categoriaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
