import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    }
  },
  logging: true,
});

const Slider = sequelize.define('Slider', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true
});

const Portfolio = sequelize.define('Portfolio', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  paranoid: true
});




const System = sequelize.define('System', {
  mainTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  features:{
    type: DataTypes.STRING,
    allowNull: true
  }
  
}, {
  timestamps: true,
  paranoid: true
});



const AboutStat = sequelize.define('AboutStat', {
  statTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  projects: {
    type: DataTypes.STRING,
    allowNull: false
  },
  employee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  years: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: true,
  paranoid: true
});






const Translation = sequelize.define('Translation', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['key', 'locale']
    }
  ]
});




const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  paranoid: true
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // هذا الحقل سيحتفظ بعلاقة بالفئة (سيتم إضافته تلقائياً عبر العلاقة)
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false, // كل منتج يجب أن ينتمي لفئة
    references: {
      model: 'Categories', // اسم الجدول في قاعدة البيانات
      key: 'id'
    }
  },
  productTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'لا يوجد'
  },
  productFeature: {
    type: DataTypes.STRING(500), // زيادة السعة للنصوص الطويلة
    allowNull: false
  },
  technicalProductDetails: {
    type: DataTypes.TEXT, // استخدام TEXT بدلاً من STRING للتفاصيل الطويلة
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    
  }
}, {
  timestamps: true,
  paranoid: true
});

// إعداد العلاقات
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'RESTRICT' // منع حذف الفئة إذا كانت تحتوي على منتجات
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
  onUpdate: 'CASCADE' // عند تحديث id الفئة، يتم التحديث تلقائياً في المنتجات
});


async function startServer(app) {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // استخدام alter بدلاً من sync للبيئة التنموية
    console.log("Database connected ✅");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
   
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

export { 
  sequelize, 
  startServer, 
  Slider, 
  Portfolio, 
  System, 
  AboutStat ,
  Category, 
  Product
};