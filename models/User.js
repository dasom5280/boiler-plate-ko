const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type : String,
        maxlength: 100
    },
    lastname: {
        type : String,
        maxlength: 50
    },
    role: {
        type : Number,
        default : 0
    },
    image: String,
    token: {
        type : String
    },
    tokenExp: {
        type : String
    },
})

UserSchema.pre('save', function( next ){
    var user = this;
    
    if(user.isModified('password')){
    //비밀번호를 암호와 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

UserSchema.methods.comparePassword = function(plainPassword, cb){
    
    //plainPassword 6789 암호화된 비밀번호$2b$10$PqXZyJYY174oxzkVAamDieaNVghR67n/oQUGAzmoHt6uJGbXC3d/O
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

UserSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    //user._id + 'secretToken' = token
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

    
}

const User = mongoose.model('User', UserSchema);

module.exports = {User}