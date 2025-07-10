import { Product } from "../models/models.js";


export const getAllProducts = async (req, res) => {
  try {
    // const products = await Product.findAll({
    //   where: { isActive: true },
    //   order: [['createdAt', 'DESC']]
    // });
    res.render('products');
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render('productDetails', { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const images = req.files.map(file => file.path); // Assuming multiple images are uploaded

    const newProduct = await Product.create({
      name,
      description,
      price,
      images
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const { name, description, price } = req.body;
    const images = req.files ? req.files.map(file => file.path) : product.images;

    await product.update({
      name,
      description,
      price,
      images
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
}


export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.findAll({
      where: { categoryId, isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.render('categoryProducts', { products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const getSingleProduct = async (req, res) => {

  res.render('singleProduct'); // Render a single product details page
}