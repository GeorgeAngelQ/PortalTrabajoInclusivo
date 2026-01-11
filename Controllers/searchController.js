import Job from "../Models/jobModel.js";

export const searchFunction = async (req, res) => {
  try {
    const { keyword, location, category, type, status } = req.query;

    const filters = {};

    if (keyword) {
      filters.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requisites: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) filters.location = location;

    if (category) filters.categoriaId = category;

    if (type) filters.contractType = type;
    
    if (status) filters.status = status;
    const jobs = await Job.find(filters).populate("categoriaId");

    res.json({
      success: true,
      results: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export default { searchFunction };