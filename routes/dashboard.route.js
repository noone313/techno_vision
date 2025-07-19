import express from 'express';
import { dashboard,addimgforslider,deleteSlider, portfolio, deletePortfolio, addPortfolio,system,addSystem,deleteSystem, aboutStat,addAboutStat, deleteAboutStat } from '../controllers/dashboard.controller.js';
import { uploadSingle } from '../middlewares/multer.js';
import { verifyToken } from '../middlewares/auth.js';
const dashboardRouter = express.Router();



// dashboard
dashboardRouter.get('/dashboard',verifyToken, dashboard)
dashboardRouter.post('/dashboard',verifyToken, uploadSingle('image'), addimgforslider);
// حذف سلايدر
dashboardRouter.delete('/dashboard/:id',verifyToken, deleteSlider);
// إضافة مسار للصفحة الخاصة بالـ Portfolio
dashboardRouter.get('/dashboard/portfolio',verifyToken, portfolio);
dashboardRouter.post('/dashboard/portfolio',verifyToken, uploadSingle('image'), addPortfolio);
dashboardRouter.delete('/dashboard/portfolio/:id',verifyToken, deletePortfolio);

// إضافة مسار للصفحة الخاصة بالـ System
dashboardRouter.get('/dashboard/systems',verifyToken, system);
dashboardRouter.post('/dashboard/systems',verifyToken, uploadSingle('image'), addSystem);
dashboardRouter.delete('/dashboard/systems/:id',verifyToken, deleteSystem);

// إضافة مسار للصفحة الخاصة بالـ AboutStat
dashboardRouter.get('/dashboard/aboutStat',verifyToken, aboutStat);
dashboardRouter.post('/dashboard/aboutStat',verifyToken, uploadSingle('image'), addAboutStat);
dashboardRouter.delete('/dashboard/aboutStat/:id',verifyToken, deleteAboutStat);

export default dashboardRouter;
