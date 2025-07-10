import {Category} from '../models/models.js';


// Get all categories
export const getAllCategories = async (req, res) => {

    try {
        // res.status(200).render('allCategories');
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    }

// Get category by ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// Create a new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const imageFile = req.file;

  const imageUrl = imageFile ? `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}` : null;


  try {
    const newCategory = await Category.create({
      name,
      description,
      image: imageUrl 
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
