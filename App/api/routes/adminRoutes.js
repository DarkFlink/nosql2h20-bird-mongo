const fs = require('fs').promises;
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const multer = require("multer");
const mongoose = require("mongoose")
const { startOfDay, endOfDay, parseISO } = require("date-fns")

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
      const { startDate = null, endDate = null, search = '', author = '' } = req.query;
      const users = await User.find({ login: { "$regex": search, "$options": "i" }});
      let filter = {
        author: { $in: users.map(user => user._id) }
      };
      if (startDate && endDate) {
        filter = {
          ...filter,
          createdAt: {
            $gte: startOfDay(parseISO(startDate)),
            $lte: endOfDay(parseISO(endDate))
          }
        }
      }
      if (author) {
        filter = {
          ...filter,
          author
        };
      }
      const posts = await Post.find(filter);
      const comments = await Comment.find(filter);
      return res.send({
        postsCount: posts.length,
        commentsCount: comments.length,
        users
      })
    } catch (err) {
      res.status(400).send({
        error: "error"
      });
    }
  })

}
