import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Некорректный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];
