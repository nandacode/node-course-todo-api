const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//user instance method
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123');

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;//input for next promise
    });
};

//user instance method
UserSchema.methods.toJSON = function () { //override existing method
    var user = this;
    var userObj = this.toObject();
    
    return _.pick(user, ['_id', 'email']);
};

//User model method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return new Promise((resolve, reject) => {
            reject();
        });
    }

    return User.findOne({
        _id: decoded._id, 
        'tokens.access': 'auth',
        'tokens.token': token
    }).then((user) => {
        return user;
    });
};

var User = mongoose.model("User", UserSchema);

module.exports = {User};