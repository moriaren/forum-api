const authMiddleware = (req, res, next) => {
  if (!req.auth || !req.auth.credentials) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing authentication',
    });
  }

  return next();
};

export default authMiddleware;