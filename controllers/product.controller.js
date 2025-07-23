import { Product,Category,Company,AboutStat } from "../models/models.js";
import { Op } from 'sequelize';





export const getAllProducts = async (req, res) => {
  try {
    const { category: categoryId, company: companyId } = req.query;

    const whereClause = {};
    if (categoryId) whereClause.categoryId = categoryId;
    if (companyId) whereClause.companyId = companyId;

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: Company,
          as: 'company',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    const Companies = await Company.findAll({
      order: [['name', 'ASC']]
    });

    res.render('products', {
      products,
      categories,
      selectedCategory: categoryId || null,
      Companies,
      selectedCompany: companyId || null
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
}



export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render('productDetails', { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
}



export const showAddProduct = async (req,res) =>{

 try {
   const allProducts = await Product.findAll({
  order: [['createdAt', 'DESC']],
  attributes: [
    'id',
    'name',
    'description',
    'categoryId',
    'productFeature',
    'technicalProductDetails',
    'companyId',
    'imageUrl',
    'createdAt',
    'updatedAt'
  ],
  include: [
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name'] // أو أي أعمدة تريدها من جدول الفئات
    },
    {
      model: Company,
      as: 'company',
      attributes: ['id', 'name'] // أو أي أعمدة تريدها من جدول الشركات
    }
  ]
});



      const allCategories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    const allCompany = await Company.findAll({
      order: [['name', 'ASC']]
    });

    res.render('addProduct', {
      allProducts,
       categories: allCategories,
       allCompany
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send('error', {
      message: 'حدث خطأ أثناء جلب بيانات المنتجات',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}





export const createProduct = async (req, res) => {
  try {
    const { name, description, productCategory, productTitle, productFeature, technicalProductDetails,companyId, categoryId } = req.body;

    // استخراج رابط الصورة من imageLinks بدلاً من req.file
    let imageUrl = null;
    if (Array.isArray(req.imageLinks)) {
      imageUrl = typeof req.imageLinks[0] === 'string' ? req.imageLinks[0] : null;
    } else if (typeof req.imageLinks === 'string') {
      imageUrl = req.imageLinks;
    }

    const newProduct = await Product.create({
      name,
      description,
      productCategory,
      productFeature,
      technicalProductDetails,
      companyId,
      imageUrl,
      categoryId
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ أثناء إضافة المنتج'
    });
  }
};





export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const { name, description, price } = req.body;
    const images = req.files ? req.files.map(file => file.path) : product.images;

    await product.update({
      name,
      description,
      price,
      images
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await product.destroy();
      res.status(200).json({ 
            success: true,
            message: "تم حذف المنتج بنجاح" 
        });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
}


export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.findAll({
      where: { categoryId, isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.render('categoryProducts', { products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['name']
      }
    });

    if (!product) {
      return res.status(404).send('المنتج غير موجود');
    }

     // جلب المنتجات ذات الصلة من نفس الفئة، مع استثناء المنتج الحالي
  const relatedProducts = await Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: id }
    },
    limit: 4 // عدد المنتجات المقترحة
    , include: {
        model: Category,
        as: 'category',
        attributes: ['name']
      }
  });

    res.render('singleProduct', { product,relatedProducts });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('حدث خطأ أثناء جلب المنتج');
  }
};


export const aboutUs = async (req, res) => {
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
   
  res.render('aboutUs',{
    statTitle,
        description,
        projects,
        employee,
        years,
        imageUrl
  }); // Render the about us page
}

export const contactUs = async (req, res) => {
  res.render('contactUs'); // Render the contact us page
}







