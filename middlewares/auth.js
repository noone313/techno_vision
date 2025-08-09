import jwt from 'jsonwebtoken';

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    if (req.xhr || req.headers.accept.includes('application/json')) {
      // إذا كان الطلب AJAX
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    // إذا كان الطلب عادي من المتصفح
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('authToken');
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    return res.redirect('/');
  }
};
