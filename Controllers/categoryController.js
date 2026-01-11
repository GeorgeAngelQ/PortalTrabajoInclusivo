
import Category from "../Models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }
    const newCategory = new Category({
      name,
      description,
    });
    await newCategory.save();
    res.status(201).json({
      message: "Categoría creada exitosamente",
      category: newCategory,
    });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
}
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
}