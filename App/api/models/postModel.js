const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: false
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

const Post = module.exports = mongoose.model('Post', postSchema);
