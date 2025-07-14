import express from 'express';
import { startServer } from './models/models.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRouter from './routes/catrgory.route.js';
import productRouter from './routes/product.route.js';


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






// المسار الرئيسي
app.get('/', (req, res) => {
  res.render('r'); // views/home.ejs يجب أن يكون موجودًا
});


app.use('/', categoryRouter); // استخدام مسار الفئات
app.use('/',productRouter); // استخدام مسار المنتجات


// تشغيل الخادم وقاعدة البيانات
startServer(app);
