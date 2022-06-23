import jwt from 'jsonwebtoken';

export const getJwtToken = (id, expiresIn) =>
  jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, { expiresIn });
