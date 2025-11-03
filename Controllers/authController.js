import User from "../Models/userModel.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res, next) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!name) {
      next("El nombre es obligatorio");
    }
    if (!lastname) {
      next("El apellido es obligatorio");
    }
    if (!email) {
      next("El correo electronico es obligatorio");
    }
    if (!password) {
      next("La contraseña es obligatoria");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next("El usuario ya está registrado")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = newUser.toObject();

    res.status(201).send({
      success: true,
      message: "Usuario registrado exitosamente",
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};
