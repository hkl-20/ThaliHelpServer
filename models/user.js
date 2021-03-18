var mongoose = require('mongoose')
var Schema = mongoose.Schema;
ObjectID = Schema.ObjectID;
var bcrypt = require('bcrypt')
var userSchema = new Schema({
    UserId: {
        type: Int32Array,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    emailaddress: {
        type: String,
        require: true
    },
    backupemail: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    age: {
        type: Int32Array,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    datejoined: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    alarms: {
        type: Array,
        require: true
    },
    journalid: {
        type: ObjectID,
        require: true
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)