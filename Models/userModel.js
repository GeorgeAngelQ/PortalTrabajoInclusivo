import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const profileSchema = new mongoose.Schema({
  habilities: [{ type: String, trim: true }],
  discapacity: { type: String, trim: true },
  location: { type: String, default: "Perú", trim: true },
  curriculumURL: { type: String, trim: true },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Ingrese un correo electrónico válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "Debe tener al menos 6 caracteres"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "empresa", "usuario"],
      default: "usuario",
    },
    profile: profileSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
userSchema.methods.createJWT = function () {
  return JWT.sign(
    {
      userId: this._id,
      role: this.role,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
