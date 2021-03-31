var User = require('../models/user')
var Journal=require('../models/journal')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var mongoose = require('mongoose')
var functions = {
    addNew: function (req, res) {
        if ((!req.body.firstname) ||(!req.body.password) || (!req.body.lastname)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                emailaddress:req.body.emailaddress,
                backupemail:req.body.backupemail,
                phone: req.body.phone,
                age:req.body.age,
                gender: req.body.gender,
                datejoined : req.body.datejoined,
                password: req.body.password
               
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
    ,
    getuser: function(req,res){
        User.findOne({
            firstname:req.body.firstname}, function (err, user) {
            if (err) throw err
            if (!user) {
                res.status(403).send({success: false, msg: 'User not found'})
            }
            else {
                return  res.json({success: true, msg: user})
            }
        })
    }
    ,getone:function(req,res){
        var data=new mongoose.Types.ObjectId(req.body.id)
        Journal.findOne({
            _id:data},function(err,jour){
                if (err) throw err
                if (!jour){
                    res.status(403).send({success: false, msg: 'User not found'})
                }
                else{
                    return res.json({success: true, msg: jour})
                }

            })
    },
    postajournal:function(req,res){
        if ((!req.body.dummyvalue)) {
        res.json({success: false, msg: 'Enter all fields'})
    }
    else {
        var newUser = Journal({dummyvalue:req.body.dummyvalue
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

    }
    ,
    getjournal: function(req,res){
        User.findOne({
            firstname:req.body.firstname}, function (err, user) {
            if (err) throw err
            if (!user) {
                res.status(403).send({success: false, msg: 'User not found'})
            }
            else {
                var data= JSON.parse(JSON.stringify(user))
                var id = new mongoose.Types.ObjectId(data.journalid)
                Journal.findById({_id: id},function(err1,jour){
                    if (err1) throw err1
                    if (!jour){
                        res.status(403).send({success: false, msg: id})
                    }
                    else{
                        return res.json({success: true, msg: jour})
                    }
                    
                }
                )
            }
        }) 
    }
}

module.exports = functions