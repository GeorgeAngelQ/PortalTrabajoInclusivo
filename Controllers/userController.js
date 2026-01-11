import User from "../Models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.name = req.body.name ?? user.name;
    user.lastname = req.body.lastname ?? user.lastname;
    user.email = req.body.email ?? user.email;

    if (req.body.profile) {
      user.profile = {
        ...user.profile.toObject(), 
        ...req.body.profile,        
      };
    }

    if (req.body.profile?.experience) {
      user.profile.experience = req.body.profile.experience; 
    }

    if (req.body.profile?.education) {
      user.profile.education = req.body.profile.education; 
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};
