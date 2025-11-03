import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

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

userSchema.pre("save", async function (){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("User", userSchema);

export default User;