var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: function (req, res) {
        if ((!req.body.firstname) ||(!req.body.password) || (!req.body.lastname)) {
            res.json({success: false, msg: 'hello there Enter all fields'})
        }
        else {
            var newUser = User({
                UserId: req.body.UserId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                emailaddress: req.body.emailaddress,
                backupemail: req.body.backupemail,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
                datejoined:req.body.datejoined,
                password: req.body.password,
                alarms: req.body.alarms,
                journalid: req.body.journalid
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    authenticate: function (req, res) {
        User.findOne({
            firstname: req.body.firstname
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
                }
                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.json({success: true, token: token})
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
        })
    },
    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'Hello ' + decodedtoken.name})
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    }
}

module.exports = functions