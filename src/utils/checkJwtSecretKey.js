export const checkJwtSecretKey = (req, res, next) => {
  if (!process.env.JWT_SECRET_KEY) {
    res.status(500).json({ message: 'Не удалось зарегистрироваться' });
    return;
  }

  next();
};
