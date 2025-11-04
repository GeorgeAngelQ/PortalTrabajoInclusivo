import User from "../Models/userModel.js";

export const updateUserController = async (req, res, next) => {
    const { name, email, lastname, location } = req.body;
    if(!name || !lastname || !email || !location){
        return next("Todos los campos son obligatorios")
    }
    const user = await User.findOne({_id: req.user.userId});
    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.location = location;
    await user.save();
    const token = user.createJWT();
    res.status(200).json({
        user,
        token
    })    
}