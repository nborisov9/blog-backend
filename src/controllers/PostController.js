import { PostModel } from '../models/index.js';

export const getLastTags = async (_, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.flatMap(({ tags }) => tags).slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось найти теги',
    });
  }
};

export const getAll = async (_, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Не удалось найти статьи' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          res.status(500).json({ message: 'Не удалось найти статью' });
          return;
        }

        if (!doc) {
          res.status(404).json({ message: 'Статья не найдена' });
          return;
        }

        res.json(doc);
      },
    );
  } catch (err) {
    res.status(500).json({ message: 'Не удалось найти статью' });
  }
};

export const remove = (req, res) => {
  const postsId = req.params.id;

  PostModel.findOneAndDelete({ _id: postsId }, (err, doc) => {
    if (err) {
      res.status(500).json({ message: 'Не удалось удалить статью' });
      return;
    }

    if (!doc) {
      res.status(404).json({ message: 'Статья не найдена' });
      return;
    }

    res.json({ success: true });
  });
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось создать статью' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Не удалось обновить статью' });
  }
};
