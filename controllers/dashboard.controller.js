import { Slider,Portfolio,System,AboutStat } from "../models/models.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import e from "express";





export const dashboard = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('dashboard', { sliders });
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("Internal Server Error");
  }
};





export const addimgforslider = async (req, res) => {
   try {
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم تحميل أي صورة" });
    }

    // إنشاء مسار ويب للملف المرفوع
    const imageUrl = `../uploads/${req.file.filename}`;

    const newSlider = await Slider.create({
    
      imageUrl,
    });

    res.status(201).json({ message: "تم الحفظ بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء الحفظ" });
  }
};


export const deleteSlider = async (req, res) => {
  const { id } = req.params;

  try {
    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ 
        success: false,
        message: "السلايدر غير موجود" 
      });
    }

   
  

// حل بديل لـ __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, '..', 'uploads', slider.imageUrl);

    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // حذف السلايدر من قاعدة البيانات
    await slider.destroy();

    res.status(200).json({ 
      success: true,
      message: "تم حذف السلايدر بنجاح" 
    });
  } catch (error) {
    console.error("Error deleting slider:", error);
    console.error("Error deleting slider:", error);

    res.status(500).json({ 
      success: false,
      message: "حدث خطأ أثناء حذف السلايدر",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}



export const portfolio = async (req, res) => {
    try {
        const portfolios = await Portfolio.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.render('portfolio', { portfolios });


    }catch (error) {
        console.error("Error rendering Portfolio:", error);
        res.status(500).send("Internal Server Error");
    }
}



export const addPortfolio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم تحميل أي صورة" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.join(__dirname, '..');
    const relativePath = path.relative(projectRoot, req.file.path);
    const webPath = `../${relativePath.replace(/\\/g, '/')}`;

    const newPortfolio = await Portfolio.create({
      imageUrl: webPath,
      title: req.body.title,
      slug: req.body.slug, 
      description: req.body.description,
      isFeatured: req.body.isFeatured === 'on'
    });

    res.status(200).json({ message: 'تم الحفظ بنجاح' });

  } catch (error) {
    console.error("Error uploading portfolio image:", error);
    res.status(500).json({ message: "حدث خطأ في السيرفر" }); 
  }
};


export const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    try {
        const portfolio = await Portfolio.findByPk(id);
        if (!portfolio) {
            return res.status(404).json({ 
                success: false,
                message: "Portfolio not found" 
            });
        }

        // حل بديل لـ __dirname:
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const imagePath = path.join(__dirname, '..', 'uploads', portfolio.imageUrl);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // حذف Portfolio من قاعدة البيانات
        await portfolio.destroy();

        res.status(200).json({ 
            success: true,
            message: "Portfolio deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while deleting the portfolio",
          
        });
    }
}





export const system = async (req, res) => {
    try {
        const systems = await System.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.render('systems', { systems });
    } catch (error) {
        console.error("Error rendering system page:", error);
        res.status(500).send("Internal Server Error");
    }
}




// الحصول على __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addSystem = async (req, res) => {
  try {
    // التحقق من وجود البيانات المطلوبة
    if (!req.body.mainTitle) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        message: "العنوان الرئيسي مطلوب" 
      });
    }

    // إنشاء المسار النسبي للصورة
    let imageUrl = null;
    if (req.file) {
      // إنشاء مجلد uploads إذا لم يكن موجوداً
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // إنشاء مسار URL للصورة
      const relativePath = path.relative(
        path.join(__dirname, '../public'), 
        req.file.path
      );
      imageUrl = '/' + relativePath.replace(/\\/g, '/');
    }

    // إنشاء النظام في قاعدة البيانات
    const newSystem = await System.create({
      mainTitle: req.body.mainTitle,
      subTitle: req.body.subTitle || null,
      description: req.body.description || null,
      imageUrl,
      features: req.body.features || null,
      isActive: true
    });

    res.status(201).json({ 
      success: true,
      message: 'تم إضافة النظام بنجاح',
      system: newSystem
    });

  } catch (error) {
    // حذف الصورة إذا تم تحميلها وحدث خطأ
    if (req.file) fs.unlinkSync(req.file.path);
    
    console.error("Error adding system:", error);
    res.status(500).json({ 
      success: false,
      message: "حدث خطأ في إضافة النظام",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    }); 
  }
};







export const deleteSystem = async (req, res) => {
    const { id } = req.params;

    try {
        const system = await System.findByPk(id);
        if (!system) {
            return res.status(404).json({ 
                success: false,
                message: "System not found" 
            });
        }

        // حل بديل لـ __dirname:
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const imagePath = path.join(__dirname, '..', 'uploads', system.imageUrl);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // حذف System من قاعدة البيانات
        await system.destroy();

        res.status(200).json({ 
            success: true,
            message: "System deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting system:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while deleting the system",
          
        });
    }
}



export const aboutStat = async (req, res) => {
  try {
    const aboutstat = await AboutStat.findAll({
      order: [['createdAt', 'DESC']]
    });

    // إذا كانت هناك سجلات
    if (aboutstat.length > 0) {
      const {
        id,
        statTitle,
        description,
        projects,
        employee,
        years,
        imageUrl
      } = aboutstat[0].dataValues;

      res.render('aboutStat', { 
        id: id || 0,
        statTitle: statTitle || 'لا يوجد عنوان',
        description: description || 'لا يوجد وصف',
        projects: projects || 0,
        employee: employee || 0,
        years: years || 0,
        imageUrl: imageUrl || '/images/default-about.jpg',
        hasData: true
      });
    } else {
      // إذا لم توجد سجلات
      res.render('aboutStat', {
        id: 0,
        statTitle: 'لا توجد بيانات',
        description: 'لم يتم إضافة إحصائيات بعد',
        projects: 0,
        employee: 0,
        years: 0,
        imageUrl: '/images/default-about.jpg',
        hasData: false
      });
    }
    
  } catch (error) {
    console.error("Error rendering About Stat page:", error);
    res.status(500).render('error', {
      message: "حدث خطأ في تحميل الصفحة",
      error: process.env.NODE_ENV === 'development' ? error : null
    });
  }
}


export const addAboutStat = async (req, res) => {
    try {

         // التحقق من وجود البيانات المطلوبة
    if (!req.body.description || !req.body.statTitle) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        message: "العنوان الرئيسي مطلوب" 
      });
    }

     // إنشاء المسار النسبي للصورة
    let imageUrl = null;
    if (req.file) {
      // إنشاء مجلد uploads إذا لم يكن موجوداً
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // إنشاء مسار URL للصورة
      const relativePath = path.relative(
        path.join(__dirname, '../public'), 
        req.file.path
      );
      imageUrl = '/' + relativePath.replace(/\\/g, '/');
    }

    
        const newAboutStat = await AboutStat.create({
        statTitle: req.body.statTitle,
        description: req.body.description || null,
        projects: req.body.projects,
        employee: req.body.employee,
        years: req.body.years,
        imageUrl
        });
    
        res.status(201).json({ 
        success: true,
        message: 'تم إضافة الإحصائية بنجاح',
        aboutStat: newAboutStat
        });
    
    } catch (error) {
        console.error("Error adding About Stat:", error);
        res.status(500).json({ 
        success: false,
        message: "حدث خطأ في إضافة الإحصائية",
        error: process.env.NODE_ENV === 'development' ? {
            message: error.message,
            stack: error.stack
        } : undefined
        }); 
    }
    }


export const deleteAboutStat = async (req, res) => {
    const { id } = req.params;

    try {
        const aboutStat = await AboutStat.findByPk(id);
        if (!aboutStat) {
            return res.status(404).json({
                success: false,
                message: "لم يتم العثور على العناصر المطلوبة" 
            });
        }

        // حل بديل لـ __dirname:
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const imagePath = path.join(__dirname, '..', 'uploads', aboutStat.imageUrl);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // حذف About Stat من قاعدة البيانات
        await aboutStat.destroy();

        res.status(200).json({ 
            success: true,
            message: "تم حذف من نحن بنجاح" 
        });
    } catch (error) {
        console.error("حدث خطا اثناء حذف من نحن:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while deleting the About Stat",
          
        });
    }
}