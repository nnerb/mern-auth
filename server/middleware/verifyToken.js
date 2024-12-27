import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized - token not provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Unauthorized - token invalid' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error verifying token", error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
}