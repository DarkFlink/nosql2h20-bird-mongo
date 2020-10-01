const fs = require('fs').promises;
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const multer = require("multer");
const mongoose = require("mongoose")
const { startOfDay, endOfDay } = require("date-fns")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

module.exports = app => {
  app.get('/export', async (req, res) => {
    const { userFromToken: { isAdmin } } = req;
    if (isAdmin) {
      const json = {};
      json.posts = await Post.find({ }).exec();
      json.comments = await Comment.find({ }).exec();
      json.users = await User.find({ }).select('+achievements').select('+password').exec();

      const exportDir = './exportTemp';

      try {
        await fs.mkdir(exportDir);
      } catch (err) {}

      try {
        await fs.writeFile('./exportTemp/birdwatching-db.json', JSON.stringify(json), 'utf8');
      } catch (err) {}

      res.download('./exportTemp/birdwatching-db.json');

    } else {
      res.status(400).send({
        error: 'user is not admin'
      })
    }
  });

  app.post('/import', upload.single('file'), async (req, res) => {
    const { file } = req;
    const newDb = JSON.parse(file.buffer);
    await mongoose.connection.dropDatabase();
    await User.insertMany(newDb.users);
    await Post.insertMany(newDb.posts);
    await Comment.insertMany(newDb.comments);
    res.send('database has been imported successfully');
  });

  app.get('/admin/statistics', async (req, res) => {
    try {
      const { startDate = null, endDate = null, author = null } = req.query;
      const posts = await Post.find({
        createdAt: {
          $gte: startDate ? startOfDay(startDate) : null,
          $lte: endDate ? endOfDay(endDate) : null
        },
        author
      });
      const comments = await Comment.find({
        createdAt: {
          $gte: startDate ? startOfDay(startDate) : null,
          $lte: endDate ? endOfDay(endDate) : null
        },
        author
      });
      return res.send({
        postsCount: posts.length,
        commentsCount: comments.length
      })
    } catch (err) {
      res.status(400).send({
        error: "error"
      });
    }
  })

  app.get('/admin/users', async (req, res) => {
    try {
      const { search = '' } = req.query;
      const users = User.find({ login: { "$regex": search, "$options": "i" }});
      return res.send(users);
    } catch (err) {
      res.status(400).send({
        error: "error"
      });
    }
  })

}
