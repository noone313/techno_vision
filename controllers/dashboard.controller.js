import { Slider,Portfolio,System,AboutStat, Category,ContactMessage, Company } from "../models/models.js";






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
const imageUrl = req.imageLinks?.[0] || null;

    // مثال لحفظها في قاعدة بيانات
  
      await Slider.create({ imageUrl});
    

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Error adding image to slider:", error);
    res.status(500).json({ message: "فشل في إضافة الصور", error });
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
    // حذف السلايدر من قاعدة البيانات
    await slider.destroy();

    res.status(200).json({ 
      success: true,
      message: "تم حذف السلايدر بنجاح" 
    });
  } catch (error) {
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
const imageUrl = req.imageLinks?.[0] || null;

    if (!imageUrl) {
      return res.status(400).json({ message: "لم يتم تحميل أي صورة" });
    }

    const newPortfolio = await Portfolio.create({
      imageUrl, // الرابط المباشر من S3
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






export const addSystem = async (req, res) => {
  try {
    // التحقق من وجود البيانات المطلوبة
    if (!req.body.mainTitle) {
      return res.status(400).json({ 
        success: false,
        message: "العنوان الرئيسي مطلوب" 
      });
    }

    // استخدام الرابط من S3
const imageUrl = req.imageLinks?.[0] || null;

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
    res.status(500).send('error', {
      message: "حدث خطأ في تحميل الصفحة",
      error: process.env.NODE_ENV === 'development' ? error : null
    });
  }
}


export const addAboutStat = async (req, res) => {
  try {
    // التحقق من وجود البيانات المطلوبة
    if (!req.body.description || !req.body.statTitle) {
      return res.status(400).json({ 
        success: false,
        message: "العنوان والوصف مطلوبان" 
      });
    }

    // استخدام رابط الصورة من S3
   const imageUrl = req.imageLinks?.[0] || null;


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
};



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


export const category = async (req,res) => {


  try {
     
    const category = await Category.findAll({ order: [['createdAt', 'DESC']]});
  
    res.render('category',{category})


    
  } catch (error) {
     console.error("Error adding About Stat:", error);
        res.status(500).json({ 
        success: false,
        message: "حدث خطأ في الفئة",
        error: process.env.NODE_ENV === 'development' ? {
            message: error.message,
            stack: error.stack
        } : undefined
        }); 
  }

}


export const addCategory = async (req, res) => {
  try {
    const { name } = req.body; 
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'اسم الفئة مطلوب'
      });
    }

    const newCategory = await Category.create({ 
      name: name.trim() 
    });

    res.status(201).json({
      success: true,
      message: 'تمت إضافة الفئة بنجاح',
      category: {
        id: newCategory.id,
        name: newCategory.name,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt
      }
    });
    
  } catch (error) {
    console.error("حدث خطأ أثناء إضافة الفئة:", error);
    
    let message = 'حدث خطأ أثناء إضافة الفئة';
    if (error.name === 'SequelizeValidationError') {
      message = error.errors.map(err => err.message).join('، ');
    } 
    else if (error.name === 'SequelizeUniqueConstraintError') {
      message = 'هذه الفئة موجودة بالفعل';
    }

    res.status(500).json({ 
      success: false,
      message
    });
  }
}



export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // التحقق من وجود المعرف
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرّف الفئة غير صالح'
      });
    }

    // البحث عن الفئة أولاً للتأكد من وجودها
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'الفئة غير موجودة'
      });
    }

    // محاولة الحذف
    const deletedRows = await Category.destroy({
      where: { id }
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الفئة للحذف'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الفئة بنجاح',
      deletedCategoryId: id
    });

  } catch (error) {
    console.error("حدث خطأ أثناء حذف الفئة:", error);
    
    let errorMessage = 'حدث خطأ أثناء حذف الفئة';
    let statusCode = 500;

    // معالجة أنواع الأخطاء المختلفة
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = 'لا يمكن حذف الفئة لأنها مرتبطة بمنتجات أو عناصر أخرى';
      statusCode = 409; // Conflict
    } else if (error.name === 'SequelizeDatabaseError') {
      errorMessage = 'خطأ في قاعدة البيانات';
    }

    res.status(statusCode).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
}



export const addContactMessage = async (req, res) => {
  try {
    
    const { fullName, phoneNumber, email, subject, message } = req.body;

    // التحقق البسيط من وجود الحقول
    if (!fullName || !phoneNumber || !email || !subject || !message) {
      return res.status(400).json({
        message: "جميع الحقول مطلوبة",
        error: null
      });
    }

    // إنشاء الرسالة في قاعدة البيانات
    await ContactMessage.create({
      fullName,
      phoneNumber,
      email,
      subject,
      message
    });

    // إعادة التوجيه أو عرض رسالة نجاح
    res.redirect('/contact-us')

  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى.",
      error: process.env.NODE_ENV === 'development' ? error : null
    });
  }
};


export const contactMessage = async(req,res)=>{

  try {

     const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
     res.render('contactMessage', { messages });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى.",
      error: process.env.NODE_ENV === 'development' ? error : null
    });
  }
}


export const productCompany = async(req,res) =>{
try {
  const productCompanies = await Company.findAll({
order: [['name', 'ASC']]
  });
  res.render('productCompany',{
    productCompanies
  });
} catch (error) {
   console.error("Error sending product company:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء تحميل شركة المنتج، حاول مرة أخرى.",
      error: process.env.NODE_ENV === 'development' ? error : null
    });
}

}



export const addProductCompany = async (req, res) => {
  try {
    const newCompany = await Company.create({
      name: req.body.name
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة شركة المنتج بنجاح',
      company: newCompany
    });
  } catch (error) {
    console.error("Error sending product company:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء ارسال شركة المنتج، حاول مرة أخرى.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // البحث عن الشركة
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "شركة المنتج غير موجودة"
      });
    }

    // حاول حذف الشركة
    await company.destroy();

    res.status(200).json({
      success: true,
      message: "تم حذف شركة المنتج بنجاح"
    });

  } catch (error) {
    console.error("Error deleting product company:", error);

    // ممكن الخطأ بسبب قيد foreign key (ارتباط منتجات بالشركة)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: "لا يمكن حذف الشركة لأنها مرتبطة بمنتجات"
      });
    }

    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء حذف شركة المنتج، حاول مرة أخرى.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
