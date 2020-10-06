const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { upload, deleteImage } = require('../helpers/upload');
const fs = require('fs');

module.exports = (app) => {
  app.post("/posts", upload.single('image'), (req, res, next) => {
    const post = new Post();
    const { text } = req.body;
    const { userFromToken: { _id } } = req;
    post.author = _id;
    post.image = req.file.location;
    post.text = text;
    post.createdAt = new Date();

    post.save( (err) => {
      if (err) {
        res.send({
          error: 'error while saving post'
        });
      }

      Post.findById(post._id).populate('author', '-password').exec((err, createdPost) => {
        if (!err) {
          res.send(createdPost);
          next();
        }
      });
    });
  });

  app.get("/posts", async (req, res) => {
    const { search = '', authorId = null } = req.query;
    const posts = await Post.find(
      authorId ?
        { author: authorId, text: { "$regex": search, "$options": "i" }}
        :
        { text: { "$regex": search, "$options": "i" }}
      )
        .sort('-createdAt')
        .populate('author')
        .exec();
    res.send(posts);
  });

  app.put('/posts/:id', upload.single('image'), async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;
    const { userFromToken } = req;

    const post = await Post.findOne(
      {_id: id, author: userFromToken._id},
    );

    if (req.file && post.image) {
      await deleteImage(post.image);
    }

    try {
      await Post.findOneAndUpdate(
        { _id: id, author: userFromToken._id },
        {
          $set: {
            image: req.file ? req.file.location : post.image,
            text: text || post.text
          }
        },
        {new: true, returnOriginal: false, useFindAndModify: false}
      );
      const updatedPost = await Post.findOne({ _id: id }).populate('author').exec();
      res.send(updatedPost)
    } catch (err) {
      res.status(400).send({
        error: 'error while editing post'
      });
    }

  });

  app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { userFromToken: { _id } } = req;

    Post.findOne(
      {_id: id, author: _id},
      async (err, post) => {

        try {
          // await deleteImage(post.image);
          await Post.deleteOne({ _id: id, author: _id });
          await Comment.deleteMany({ post: id })
          res.send('OK')
        } catch (err) {
          res.status(400).send({
            error: 'error while deleting post'
          });
        }
      }
    );
  });

  app.get('/posts/:id/comments', async (req, res, next) => {
    const { id } = req.params;
    const { limit = null } = req.query;

    try {
      const commentsCount =
        await Comment.find({ post: id })
          .exec();

      const comments =
        await Comment.find({ post: id })
          .limit(parseFloat(limit))
          .sort('-createdAt')
          .populate('author', '-password')
          .exec()

      res.send({
        count: commentsCount.length,
        comments
      });
    } catch (e) {
      res.status(400).send({
        error: 'comments error'
      })
    }

  });

  app.post('/posts/:id/comments', async (req, res, next) => {
    const { id } = req.params;
    const { text } = req.body;
    const { userFromToken: { _id } } = req;
    const comment = new Comment();
    comment.author = _id;
    comment.post = id;
    comment.text = text;
    comment.createdAt = new Date();

    comment.save(async (err) => {
      if (err) {
        res.send({
          error: 'error while saving comment'
        });
      } else {
        const commentsCount =
          await Comment.find({ post: id })
            .exec();

        const comments =
          await Comment.find({ post: id })
            .sort('-createdAt')
            .populate('author', '-password')
            .exec()

        res.send({
          count: commentsCount.length,
          comments
        });

        next();
      }
    });
  });

  app.delete('/posts/:id/comments/:commentId', (req, res) => {
    const { id, commentId } = req.params;
    const { userFromToken: { _id } } = req;
    Comment.deleteOne({ _id: commentId, author: _id }, async err => {
      if (err) {
        res.status(400).send({
          error: 'error while deleting comment'
        });
      } else {
        const commentsCount =
          await Comment.find({ post: id })
            .exec();

        const comments =
          await Comment.find({ post: id })
            .sort('-createdAt')
            .populate('author', '-password')
            .exec()

        res.send({
          count: commentsCount.length,
          comments
        });
      }
    });
  });

}
