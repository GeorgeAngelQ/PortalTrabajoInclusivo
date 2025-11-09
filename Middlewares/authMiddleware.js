import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import Enterprise from "../Models/enterpriseModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No autorizado, falta token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user =
      (await User.findById(decoded.userId).select("-password")) ||
      (await Enterprise.findOne({ userId: decoded.userId }));

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
    }
    next();
  };
};