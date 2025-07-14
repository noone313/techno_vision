import { Sequelize,DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
}
);


const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
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
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true // للحذف اللين
});



const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING), // لحفظ عدة صور للمنتج
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true // للحذف اللين
});




Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products'
});


Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});



async function startServer(app) {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
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





export { sequelize, startServer, Category, Product };