import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { getJwtToken } from '../utils/getJwtToken.js';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = getJwtToken(user._id, '30d');

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось зарегистрироваться' });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      // TODO: причину ошибки написал для теста, в реальном проекте стоит максимально поверхностно ее указывать
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(404).json({ message: 'Неверный логин или пароль' });
    }

    const token = getJwtToken(user._id, '30d');

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось авторизоваться' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Нет доступа' });
  }
};
