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
        minlength: 5
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
    //비밀번호를 암호화 시킨다.
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

UserSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err,decoded){
        //유저 id를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', UserSchema);

module.exports = {User}