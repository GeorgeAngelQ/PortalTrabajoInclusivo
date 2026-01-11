import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


const experienceSchema = new mongoose.Schema({
  position: { type: String, trim: true },
  enterprise: { type: String, trim: true },
  inite: { type: String, trim: true }, 
  end: { type: String, trim: true },    
  description: { type: String, trim: true }
});

const educationSchema = new mongoose.Schema({
  grado: { type: String, trim: true },
  institucion: { type: String, trim: true },
  anio: { type: String, trim: true },
  descripcion: { type: String, trim: true }
});


const profileSchema = new mongoose.Schema({
  phone: { type: String, trim: true },
  location: { type: String, trim: true, default: "Lima" },
  title: { type: String, trim: true }, 
  summary: { type: String, trim: true }, 
  skills: [{ type: String, trim: true }],

  experience: [experienceSchema],
  education: [educationSchema],

  discapacity: { type: String, trim: true },
  curriculumURL: { type: String, trim: true }
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
      required: function() { return this.userType === 'usuario'; },
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
    { expiresIn: "4h" }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
