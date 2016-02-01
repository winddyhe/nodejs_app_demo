var db = require('../models');

var async = require('async');
var gravatar = require('gravatar');

exports.findUserById = function(_userID, callback) {
   db.User.findOne({ _id: _userID }, callback);
};

exports.findByEmailOrCreate = function(email, callback){
    db.User.findOne({ email: email }, function(err, user){
        if (user){
            callback(err, user);
        } else{
            user = new db.User;
            user.name = email.split('@')[0];
            user.email = email;
            user.avatarUrl = gravatar.url(email);
            user.save(callback);
        }
    });  
};