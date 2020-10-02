const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const { upload, deleteImage } = require('../helpers/upload');
const achievements = require('../constants/achievements')
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const getAchievementsList = completedAchievements =>
    Object.values(achievements).map(achievement => ({
    codeName: achievement,
    completed: completedAchievements.indexOf(achievement) >= 0
  }))

module.exports = (app) => {
  app.post("/register", async (req, res) => {
    const user = new User();
    const {isAdmin = false, login, password} = req.body;

    const users = await User.find({});

    bcrypt.hash(password, 10, (err, hash) => {
      user.isAdmin = users.length > 0 ? isAdmin : true;
      user.login = login;
      user.password = hash;
      user.save( (err) => {
        if (err) {
          res.status(400).send({
            error: 'login already exists'
          })
        } else {
          const token = jwt.sign({_id: user._id}, jwtConfig.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.send({
            ...user.toObject(),
            token
          });
        }
      });
    })
  });
  app.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.send(user);
    });
  });

  app.post('/login', (req, res) => {
    const {login, password} = req.body;
    if (!login || !password) {
      return res.status(400).send({
        error: 'No login/password entered'
      });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      User.findOne({login}).select('+password').exec( (err, user) => {
        if (err || !user) {
          return res.status(400).send({
            error: 'No such user found'
          });
        }
        bcrypt.compare(password, user.password, async (err, result) => {
          if (err || !result) {
            return res.status(400).send({
              error: 'wrong password'
            });
          }
          if (result) {
            const token = jwt.sign({_id: user._id}, jwtConfig.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
            const targetUser = await User.findOne({ _id: user._id }).exec();

            res.send({
              ...targetUser.toObject(),
              token // token: token = token
            });
          }
        });

      });
    });
  });



  app.put(
    '/profile',
    upload.single('image'),
    async (req, res, next) => {
    const { description } = req.body;
    const { userFromToken } = req;
    if (req.file && userFromToken.image) {
      await deleteImage(userFromToken.image);
    }

    await User.findOneAndUpdate(
      {_id: userFromToken._id},
      {
        $set: {
          image: req.file ? req.file.location : userFromToken.image,
          description: description || userFromToken.description
        }
      },
      {new: true, returnOriginal: false, useFindAndModify: false},
    );
    const user = await User.findOne({_id: userFromToken._id}).exec();
    res.send(user);
    next();
  });

  app.get('/users/:id/achievements', (req, res) => {
    const { id } = req.params;
    User.findById(id).select('+achievements').exec((err, user) => {
      const completedAchievements = user.achievements;
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(getAchievementsList(completedAchievements));
      }
    });
  });

  app.get('/statistics', async (req, res) => {
    const { userFromToken: { _id, isAdmin } } = req;
    const posts = await Post.find({ author: _id });
    const comments = await Comment.find({ author: _id });
    const user = await User.findOne({ _id }).select('+achievements');

    const commonStatistics = {
      userPostsCount: posts.length,
      userCommentsCount: comments.length,
      achievements: [
        getAchievementsList(user.achievements).filter(achievement => achievement.completed).length,
        getAchievementsList(user.achievements).length
      ],
    }

    res.send(commonStatistics);

  });


}
