import express from 'express';
import { uploadSingle } from '../middlewares/multer.js';
import { getAllProducts,getProductById,getProductsByCategory,createProduct,getSingleProduct,aboutUs,contactUs,sol } from '../controllers/product.controller.js';

const productRouter = express.Router();



// Contact Us page
productRouter.get('/contact-us', contactUs);
// sol page
productRouter.get('/sol',sol);
// About Us page
productRouter.get('/about-us', aboutUs);
// Get single product for details page
productRouter.get('/products/single', getSingleProduct);
// Get all products
productRouter.get('/products', getAllProducts);
// Get product by ID
productRouter.get('/products/:id', getProductById);
// Create a new product
productRouter.post('/products', uploadSingle('image'), createProduct);
// Get products by category
productRouter.get('/categories/:categoryId/products', getProductsByCategory);




export default productRouter;
