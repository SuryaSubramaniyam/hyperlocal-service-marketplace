import Category from "../models/Category.js";


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: "Category already exists" });

  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });

  category.name = name;
  await category.save();
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });

  res.json({ message: "Deleted successfully" });
};
