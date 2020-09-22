//bioModel.js
var mongoose = require('mongoose');
//schema
var bioSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Export Bio Model
var Bio = module.exports = mongoose.model('bio', bioSchema);
module.exports.get = function (callback, limit) {
   Bio.find(callback).limit(limit);
}
