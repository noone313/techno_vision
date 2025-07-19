import jwt from 'jsonwebtoken';

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  
  if (!token) {
 res.redirect('/');  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('authToken');
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};