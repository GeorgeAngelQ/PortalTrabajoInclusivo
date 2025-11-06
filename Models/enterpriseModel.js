import mongoose from "mongoose";

const enterpriseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del usuario empresa es obligatorio"],
      unique: true, 
    },
    companyName: {
      type: String,
      required: [true, "La razón social es obligatoria"],
      trim: true,
    },
    ruc: {
      type: String,
      required: [true, "El RUC es obligatorio"],
      match: [/^\d{11}$/, "El RUC debe tener 11 dígitos"],
      unique: true,
    },
    comercialName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "La descripción no puede superar 500 caracteres"],
      trim: true,
    },
    sector: {
      type: String,
      enum: [
        "Tecnología",
        "Educación",
        "Salud",
        "Finanzas",
        "Servicios",
        "Manufactura",
        "Otro",
      ],
      default: "Otro",
    },
    companySize: {
      type: String,
      enum: ["Micro", "Pequeña", "Mediana", "Grande"],
      default: "Pequeña",
    },
    webSite: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v);
        },
        message: "Ingrese una URL válida",
      },
    },
    phone: {
      type: String,
      match: [/^\d{6,15}$/, "Ingrese un número de teléfono válido"],
    },
    logoURL: {
      type: String,
      trim: true,
    },
    direction: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

export default Enterprise;
