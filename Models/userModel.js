import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nombre es obligatorio"],
    },
    lastname: {
      type: String,
      required: [true, "Apellido es obligatorio"],
    },
    email: {
      type: String,
      required: [true, "Correo electronico es obligatorio"],
      unique: true,
      validate: [
        validator.isEmail,
        "Por favor, ingrese un correo electronico válido",
      ],
    },
    password: {
      type: String,
      required: [true, "Contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    location: {
      type: String,
      default: "Perú",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;