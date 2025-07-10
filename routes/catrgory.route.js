import express from 'express';
import { uploadSingle } from '../middlewares/multer.js';
import { createCategory,getAllCategories,getCategoryById } from '../controllers/category.controller.js';

const categoryRouter = express.Router();

// Get all categories
categoryRouter.get('/categories', getAllCategories);
// Get category by ID
categoryRouter.get('/categories/:id', getCategoryById);
// Create a new category
categoryRouter.post('/categories', uploadSingle('image'), createCategory);

export default categoryRouter;
