import express from 'express';
import { dashboard,addimgforslider,deleteSlider, portfolio, deletePortfolio, addPortfolio,system,addSystem,deleteSystem, aboutStat,addAboutStat, deleteAboutStat, category, addCategory, deleteCategory, addContactMessage, contactMessage, productCompany, addProductCompany, deleteCompany, getSolutionById, createSolution,deleteSolution, getAllSolutions } from '../controllers/dashboard.controller.js';
import { uploadImagesMiddleware } from '../middlewares/multer.js';
import { verifyToken } from '../middlewares/auth.js';
import {  showAddProduct } from '../controllers/product.controller.js';
const dashboardRouter = express.Router();



// slider
dashboardRouter.get('/dashboard',verifyToken, dashboard)
dashboardRouter.post('/dashboard',verifyToken, uploadImagesMiddleware, addimgforslider);
// حذف سلايدر
dashboardRouter.delete('/dashboard/:id',verifyToken, deleteSlider);

// إضافة مسار للصفحة الخاصة بالـ Portfolio
dashboardRouter.get('/dashboard/portfolio',verifyToken, portfolio);
dashboardRouter.post('/dashboard/portfolio',verifyToken, uploadImagesMiddleware, addPortfolio);
dashboardRouter.delete('/dashboard/portfolio/:id',verifyToken, deletePortfolio);

// إضافة مسار للصفحة الخاصة بالـ System
dashboardRouter.get('/dashboard/systems',verifyToken, system);
dashboardRouter.post('/dashboard/systems',verifyToken, uploadImagesMiddleware, addSystem);
dashboardRouter.delete('/dashboard/systems/:id',verifyToken, deleteSystem);

// إضافة مسار للصفحة الخاصة بالـ AboutStat
dashboardRouter.get('/dashboard/aboutStat',verifyToken, aboutStat);
dashboardRouter.post('/dashboard/aboutStat',verifyToken, uploadImagesMiddleware, addAboutStat);
dashboardRouter.delete('/dashboard/aboutStat/:id',verifyToken, deleteAboutStat);


dashboardRouter.get('/dashboard/category',verifyToken,category);
dashboardRouter.post('/dashboard/category', verifyToken,addCategory);
dashboardRouter.delete('/dashboard/category/:id', verifyToken,deleteCategory);


dashboardRouter.get('/dashboard/products',verifyToken,showAddProduct);


dashboardRouter.post('/dashboard/contactMessage',verifyToken, addContactMessage);
dashboardRouter.get('/dashboard/contactMessage',verifyToken, contactMessage);

dashboardRouter.get('/dashboard/productCompany',verifyToken,productCompany);
dashboardRouter.post('/dashboard/productCompany',verifyToken,addProductCompany);
dashboardRouter.delete('/dashboard/productCompany/:id',verifyToken,deleteCompany);

dashboardRouter.get('/dashboard/sol',getAllSolutions);
dashboardRouter.get('/sol/:id',getSolutionById);
dashboardRouter.post('/dashboard/sol',uploadImagesMiddleware, createSolution);
dashboardRouter.delete('/dashboard/sol/:id', deleteSolution);
export default dashboardRouter;
