import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  const token = req.headers.authorization || '';

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.userId = decoded._id;

      next();
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: 'Нет доступа' });
    }

    return;
  }

  res.status(403).json({ message: 'Нет доступа' });
};
