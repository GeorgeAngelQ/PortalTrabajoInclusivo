import User from "../Models/userModel.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "El nombre es obligatorio" });
    }
    if (!lastname) {
      return res
        .status(400)
        .send({ success: false, message: "El apellido es obligatorio" });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "El correo electronico es obligatorio",
      });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "La contraseña es obligatoria" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "El usuario ya está registrado" });
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
      user: userData
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error en el registro del usuario",
      error: error.message
    });
  }
};
