import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import 'dotenv/config';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations/index.js';

import { UserController, PostController } from './controllers/index.js';

import { checkAuth, checkJwtSecretKey, handleValidationErrors } from './utils/index.js';

const PORT = 4444;
const DB_CONNECT_STRING = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.gzzp4.mongodb.net/blog?retryWrites=true&w=majority`;

mongoose
  .connect(DB_CONNECT_STRING)
  .then(() => console.log('DB OK'))
  .catch(() => console.log('DB ERROR'));

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads'),
  filename: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `uploads/${req.file.originalname}` });
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post(
  '/auth/register',
  checkJwtSecretKey,
  registerValidation,
  handleValidationErrors,
  UserController.register,
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

app.listen(PORT, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('server OK');
});
