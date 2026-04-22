import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'fail',
        message: 'Missing authentication',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid authentication format',
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.user = {
      id: decoded.id,
    };

    next();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
};

export default authMiddleware;