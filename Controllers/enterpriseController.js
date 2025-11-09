import Enterprise from "../Models/enterpriseModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getEnterpriseProfile = async (req, res) => {
  try {
    const enterprise = await Enterprise.findOne({ userId: req.user.id }).select("-password");
    if (!enterprise)
      return res.status(404).json({ message: "Empresa no encontrada" });

    res.json(enterprise);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

export const updateEnterpriseProfile = async (req, res) => {
  try {
    const enterprise = await Enterprise.findOne({ userId: req.user.id });
    if (!enterprise)
      return res.status(404).json({ message: "Empresa no encontrada" });

    enterprise.name = req.body.name || enterprise.name;
    enterprise.sector = req.body.sector || enterprise.sector;
    enterprise.location = req.body.location || enterprise.location;

    const updated = await enterprise.save();
    res.json({ message: "Perfil actualizado", enterprise: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};

export const deleteEnterprise = async (req, res) => {
  try {
    const enterprise = await Enterprise.findOneAndDelete({ userId: req.user.id });
    if (!enterprise)
      return res.status(404).json({ message: "Empresa no encontrada" });

    res.json({ message: "Empresa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empresa", error });
  }
};
