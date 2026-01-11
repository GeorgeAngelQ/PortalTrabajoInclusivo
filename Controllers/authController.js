import User from "../Models/userModel.js";
import Enterprise from "../Models/enterpriseModel.js";
import JWT from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, lastname, email, password, location } = req.body;

    if (!name || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "El correo ya está registrado" });

    const newUser = await User.create({
      name,
      lastname,
      email,
      password,
      profile: {location},
      role: "usuario",
    });

    const token = newUser.createJWT(newUser._id);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno al registrar usuario" });
  }
};


export const registerEnterprise = async (req, res) => {
  try {
    const { email, password, companyName, ruc, description, sector, companySize, webSite, phone, direction } = req.body;

    if (!email || !password || !companyName || !ruc) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El correo ya está registrado" });

    const newUser = await User.create({
      name: companyName, 
      email,
      password,
      role: "empresa",
    });

    const newEnterprise = await Enterprise.create({
      userId: newUser._id,
      companyName,
      ruc,
      description,
      sector,
      companySize,
      webSite,
      phone,
      direction,
    });

    const token = newUser.createJWT();

    res.status(201).json({
      message: "Empresa registrada exitosamente",
      token,
      enterprise: {
        id: newEnterprise._id,
        companyName: newEnterprise.companyName,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("❌ Error al registrar empresa:", error);
    res.status(500).json({ message: "Error interno al registrar empresa" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
        success: false,
        message: "Por favor, complete todos los campos",
      });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
        success: false,
        message: "Nombre de usuario inválido",
      });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
  }
  const { password: _, ...userData } = user.toObject();
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Inicio de sesión exitoso",
    userData,
    token,
  });
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error interno al cerrar sesión" });
  }
};
