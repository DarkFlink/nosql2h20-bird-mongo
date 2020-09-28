const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    }
});

const Comment = module.exports = mongoose.model('Comment', commentSchema);
