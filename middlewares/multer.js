import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// الحصول على المسار الرئيسي للمشروع
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// المسار الرئيسي للمشروع (بجوار package.json)
const projectRoot = path.join(__dirname, '..'); // الانتقال لمستوى أعلى

// مسار مجلد التحميلات
const uploadsDir = path.join(projectRoot, 'uploads');

// إنشاء المجلد إذا لم يكن موجوداً
const createUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`تم إنشاء مجلد التحميلات في: ${uploadsDir}`);
  }
};

// إعدادات multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createUploadsDir(); // التأكد من وجود المجلد
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// تصدير middleware مخصص
export const uploadSingle = (fieldName) => {
  return multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB حد أقصى
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('نوع الملف غير مدعوم'), false);
      }
    }
  }).single(fieldName);
};