import User from "../Models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!name) {
      return next("El nombre es obligatorio");
    }
    if (!lastname) {
      return next("El apellido es obligatorio");
    }
    if (!email) {
      return next("El correo electronico es obligatorio");
    }
    if (!password) {
      return next("La contraseña es obligatoria");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next("El usuario ya está registrado")
    }

    const newUser = await User.create({name, lastname, email, password});
    const { password: _, ...userData } = newUser.toObject();
    const token = newUser.createJWT();

    res.status(201).send({
      success: true,
      message: "Usuario registrado exitosamente",
      user: userData,
      token: token
    });
  } catch (error) {
    next(error);
  }
};
