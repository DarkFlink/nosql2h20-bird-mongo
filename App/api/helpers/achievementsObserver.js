const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const achievements = require('../constants/achievements')


module.exports = (req, res, next) => {

  if (req.userFromToken) {
    const { userFromToken: { _id } } = req;

    User.findById(_id).select('+achievements').exec( (err, user) => {
      if (err) {

      } else {
        const completedAchievements = user.achievements;
        const completedAchievementsPrevCount = user.achievements.length;

        if (user.image && !~completedAchievements.indexOf(achievements.AVATAR_ACHIEVEMENT)) {
          completedAchievements.push(achievements.AVATAR_ACHIEVEMENT);
        }

        Post.find({ author: _id }, (err, posts) => {
          if (posts.length >= 1 && !~completedAchievements.indexOf(achievements.CREATED_POST_1)) {
            completedAchievements.push(achievements.CREATED_POST_1);
          }
          if (posts.length >= 3 && !~completedAchievements.indexOf(achievements.CREATED_POST_3)) {
            completedAchievements.push(achievements.CREATED_POST_3);
          }
          if (posts.length >= 5 && !~completedAchievements.indexOf(achievements.CREATED_POST_5)) {
            completedAchievements.push(achievements.CREATED_POST_5);
          }

          Comment.find({ author: _id }, (err, comments) => {
            if (comments.length >= 1 && !~completedAchievements.indexOf(achievements.LEFT_COMMENT_1)) {
              completedAchievements.push(achievements.LEFT_COMMENT_1);
            }
            if (comments.length >= 3 && !~completedAchievements.indexOf(achievements.LEFT_COMMENT_3)) {
              completedAchievements.push(achievements.LEFT_COMMENT_3);
            }
            if (comments.length >= 5 && !~completedAchievements.indexOf(achievements.LEFT_COMMENT_5)) {
              completedAchievements.push(achievements.LEFT_COMMENT_5);
            }

            if (completedAchievementsPrevCount < completedAchievements.length) {
              User.findOneAndUpdate(
                { _id },
                {
                  $set: {
                    achievements: completedAchievements
                  }
                },
                (err, user) => {
                  next()
                }
              );
            } else {
            }
          });
        });
      }
    });
  } else {
    next()
  }
}
