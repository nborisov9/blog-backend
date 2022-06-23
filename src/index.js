import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import { registerValidation } from './validations/register.js';
import { loginValidation } from './validations/login.js';
import { postCreateValidation } from './validations/post.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import { checkAuth } from './utils/checkAuth.js';

const PORT = 4444;
const DB_CONNECT_STRING = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.gzzp4.mongodb.net/blog?retryWrites=true&w=majority`;

mongoose
  .connect(DB_CONNECT_STRING)
  .then(() => console.log('DB OK'))
  .catch(() => console.log('DB ERROR'));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// TODO: доделать роуты
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
// app.patch('/posts', PostController.update);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);

app.listen(PORT, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('server OK');
});
