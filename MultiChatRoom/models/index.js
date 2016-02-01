var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ChatRoom');
exports.User = mongoose.model('User', require('./user'));