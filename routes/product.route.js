import express from 'express';
import { uploadImagesMiddleware } from '../middlewares/multer.js';
import { getAllProducts,getProductById,getProductsByCategory,createProduct,getSingleProduct,aboutUs,contactUs, deleteProduct, updateProduct } from '../controllers/product.controller.js';

const productRouter = express.Router();



// Contact Us page
productRouter.get('/contact-us', contactUs);
// About Us page
productRouter.get('/about-us', aboutUs);
// Get single product for details page
productRouter.get('/products/:id', getSingleProduct);
// Get all products
productRouter.get('/products', getAllProducts);
// Get product by ID
productRouter.get('/products/one/:id', getProductById);
// Create a new product
productRouter.post('/products', uploadImagesMiddleware, createProduct);
// Get products by category
productRouter.get('/categories/:categoryId/products', getProductsByCategory);

productRouter.delete('/products/:id',deleteProduct);

productRouter.put('/products/:id', uploadImagesMiddleware, updateProduct);



export default productRouter;
