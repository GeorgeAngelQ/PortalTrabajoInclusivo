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
      enum: [
        "Tiempo completo",
        "Medio tiempo",
        "Prácticas",
        "Temporal",
        "Freelance",
      ],
      default: "Tiempo completo",
    },
    location: {
      type: String,
      enum: [
        "Ancon",
        "Ate",
        "Barranco",
        "Breña",
        "Carabayllo",
        "Chaclacayo",
        "Chorrillos",
        "Cieneguilla",
        "Comas",
        "El Agustino",
        "Independencia",
        "Jesús María",
        "La Molina",
        "La Victoria",
        "Lima",
        "Lince",
        "Los Olivos",
        "Lurigancho",
        "Lurín",
        "Magdalena del Mar",
        "Miraflores",
        "Pachacamac",
        "Pucusana",
        "Pueblo Libre",
        "Puente Piedra",
        "Punta Hermosa",
        "Punta Negra",
        "Rimac",
        "San Bartolo",
        "San Borja",
        "San Isidro",
        "San Juan de Lurigancho",
        "San Juan de Miraflores",
        "San Luis",
        "San Martín de Porres",
        "San Miguel",
        "Santa Anita",
        "Santa María del Mar",
        "Santa Rosa",
        "Santiago de Surco",
        "Surquillo",
        "Villa El Salvador",
        "Villa María del Triunfo",
      ],
      default: "Lima",
    },
    accesibility: accesibilitySchema,
    publishDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Activo", "Pausado", "Cerrado"],
      default: "Activo",
    },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    modality: {
      type: String,
      enum: ["Presencial", "Híbrido", "Remoto"],
      default: "Presencial",
    },
    enterpriseName: { type: String, trim: true },
    enterpriseLogo: { type: String, trim: true },
    industry: { type: String, trim: true },

    skills: { type: [String], default: [] },
    benefits: { type: [String], default: [] },

    deadline: { type: Date },

    isHighlighted: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },

    tags: { type: [String], default: [] },
    category: { type: String, trim: true },
    experienceMin: { type: Number, default: 0 },
    educationLevel: {
      type: String,
      enum: ["Secundaria", "Técnico", "Universitario", "Titulado", "Maestría"],
    },
    categoriaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export const contractType = Job.schema.path("contractType").enumValues;
export const location = Job.schema.path("location").enumValues;
export const status = Job.schema.path("status").enumValues;
export const modality = Job.schema.path("modality").enumValues;
export const educationLevel = Job.schema.path("educationLevel").enumValues;


export default Job;
