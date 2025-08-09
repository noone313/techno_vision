import express from 'express';
import { AboutStat, startServer, System } from './models/models.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRouter from './routes/catrgory.route.js';
import productRouter from './routes/product.route.js';
import dashboardRouter from './routes/dashboard.route.js';
import { Slider,Portfolio } from './models/models.js';
import jwt from 'jsonwebtoken'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// إعداد EJS كمحرك عرض
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // مجلد views
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ملفات استاتيكية (css, js, images)
app.use(express.static(path.join(__dirname, 'public'))); // مجلد public






app.get('/', async (req, res) => { // أضيف async هنا
  try {
const lang = req.query.lang || 'en';    const sliders = await Slider.findAll({
      order: [['createdAt', 'DESC']]
    });

    const portfolios = await Portfolio.findAll({
      order: [['createdAt', 'DESC']]
    });

    const systems = await System.findAll({
      order: [['mainTitle', 'ASC']]
    });

    const aboutstat = await AboutStat.findAll({
      order: [['createdAt', 'DESC']]
    });

    
      const {
        statTitle,
        description,
        projects,
        employee,
        years,
        imageUrl
      } = aboutstat[0].dataValues;
   
    
    res.render('r', { 
      lang,
        sliders,
        portfolios,
        systems,
    //
        statTitle,
        description,
        projects,
        employee,
        years,
        imageUrl }); 
  }
  catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).send("Internal Server Error");
  }
});
// عرض صفحة تسجيل الدخول
app.get('/login', (req, res) => {
  res.render('login', { success: true, message: null });
});


// معالجة تسجيل الدخول (POST)
app.post('/login', async (req, res) => {
  try {
    const { email,password } = req.body;
    const correctEmail = process.env.LOGIN_EMAIL
    const correctPhoneNumber = process.env.correctPhoneNumber;

    if (!email || email !== correctEmail||!password|| password!==correctPhoneNumber) {
      return res.status(401).render('login', {
        success: false,
        message: 'ادخل معلومات صحيحة و عاود المحاولة'
      });
    }

    const token = jwt.sign(
      { correctPhoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.redirect('/dashboard');

  } catch (error) {
    console.error('حدث خطأ في تسجيل الدخول:', error);
    res.status(500).render('login', {
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
});


app.get('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.redirect('/');
});
app.use('/', categoryRouter); // استخدام مسار الفئات
app.use('/',productRouter); // استخدام مسار المنتجات
app.use('/', dashboardRouter); // استخدام مسار لوحة التحكم

// تشغيل الخادم وقاعدة البيانات
startServer(app);
