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
            var newJour = Journal({
                bloodpressuredata:[],
               ironintake:[],
               bloodtransfusion:[],
               DoctorVisits:[],
               MedicineIntake:[],
               heartrate:[],
               dailyintake:[],
            });
            newJour.save(function (err, newJour) {
               if (err) {
                   return res.json({success: false, msg: 'Failed to save'})
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
                    password: req.body.password,
                    alarms : [],
                    journalid: newJour.id
                   
                });
                newUser.save(function (err1, newUser) {
                    if (err1) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                })
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
            }
        )
    },
    // getinfo: function (req, res) {
    //     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //         var token = req.headers.authorization.split(' ')[1]
    //         var decodedtoken = jwt.decode(token, config.secret)
    //         return res.json({success: true, msg: 'Hello ' + decodedtoken.name})
    //     }
    //     else {
    //         return res.json({success: false, msg: 'No Headers'})
    //     }
    // },
    getuser: function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id: id1}, function (err, user) {
            if (err) throw err
            if (!user) {
                res.status(403).send({success: false, msg: 'User not found'})
            }
            else {
                return  res.json({success: true, msg: user})
            }
        })
    },
    postajournal:function(req,res){
        var newJour = Journal({
             bloodpressuredata:[],
            ironintake:[],
            bloodtransfusion:[],
            DoctorVisits:[],
            MedicineIntake:[],
            heartrate:[]
        });
        newJour.save(function (err, newJour) {
            if (err) {
                return res.json({success: false, msg: 'Failed to save'})
            }
            else {
                return res.json({success: true, msg: newJour, id:newJour._id })
            }
        })
    },
    getjournal: function(req,res){
       var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                    
                })
            }
        }) 
    },
    addalarm:function(req,res){
        if ((!req.body.time)|| (!req.body.id) || (!req.body.medicinename)){
            res.json({success:false,msg:'Enter all fields'})
        }
        else{
            var id= new mongoose.Types.ObjectId(req.body.id)
            User.findById({_id: id},function(err,user){
                if (err) throw err
                if (!user){
                    res.status(403).send({success: false, msg: 'User not found'})
                }
                else{
                    var data=JSON.parse(JSON.stringify(user))
                    var alarmsdata=data.alarms
                    alarmsdata.push({
                        'medicinename' : req.body.medicinename,
                        'time': req.body.time
                    })
                    User.findOneAndUpdate({_id: id},{alarms: alarmsdata  },function(err1,user2){
                        if (err1) throw err1
                        if (!user2){
                            res.status(403).send({success: false, msg: 'update unsuccessful'})
                        }
                        else{
                            return res.json({success: true, msg:'updated'})
                        }                    

                })
            }
        })
    }
    },


    addtoarr:function(req,res){
        if ((req.body.type == 'bloodpressuredata' && (!req.body.id || !req.body.date || !req.body.diastolicpressure || !req.body.systolicpressure))
            || (req.body.type == 'ironintake' && (!req.body.id || !req.body.date || !req.body.medicinename || !req.body.unitstaken)) 
            || (req.body.type == 'heartrate' && (!req.body.id || !req.body.date || !req.body.time || !req.body.bpm))
            || (req.body.type == 'bloodtransfusion' && (!req.body.id || !req.body.date || !req.body.age  ||!req.body.whitebloodcells || !req.body.amounttransfused))
            || (req.body.type) == 'dailyintake' && (!req.body.id || !req.body.date || !req.body.goodfoodcount || !req.body.avgfoodcount || !req.body.badfoodcount)
        ){
            res.json({success: false, msg: 'Enter all fields'})    
        }
        else {
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var entry = journaldata[req.body.type]
                        if (req.body.type == 'bloodpressuredata'){
                            entry.push({
                                "date":req.body.date,
                                "diastolicpressure":req.body.diastolicpressure,
                                "systolicpressure":req.body.systolicpressure
                            })
                            Journal.findOneAndUpdate({_id: id},{bloodpressuredata: entry },function(err2,jour2){
                                if (err2) throw err2
                                if (!jour2){
                                    res.status(403).send({success: false, msg:'Couldnt update'})
                                }
                                else{
                                    return res.json({success: true, msg:'updated'})
                                }      
                            })
                        }
                        else if (req.body.type == 'bloodtransfusion'){
                            entry.push({
                                "date":req.body.date,
                                "age":req.body.age,
                                "whitebloodcells":req.body.whitebloodcells,
                                "amounttransfused":req.body.amounttransfused 
                            })
                            Journal.findOneAndUpdate({_id: id},{bloodtransfusion:entry },function(err2,jour2){
                                if (err2) throw err2
                                if (!jour2){
                                    res.status(403).send({success: false, msg: 'no scen hose'})
                                }
                                else{
                                    return res.json({success: true, msg:'updated'})
                                }
                            })
                        }
                        else if (req.body.type == 'ironintake'){
                            entry.push({
                                "date":req.body.date,
                                "medicinename":req.body.medicinename,
                                "unitstaken":req.body.unitstaken
                            })
                            Journal.findOneAndUpdate({_id: id},{ironintake:entry },function(err2,jour2){
                                if (err2) throw err2
                                if (!jour2){
                                    res.status(403).send({success: false, msg: 'no scen hose'})
                                }
                                else{
                                    return res.json({success: true, msg: 'updated'})
                                }   
                            })
                        }
                        else if (req.body.type == 'dailyintake'){
                            entry.push({
                                "date":req.body.date,
                                "goodfoodcount":req.body.goodfoodcount,
                                "avgfoodcount":req.body.avgfoodcount,
                                "badfoodcount" : req.body.badfoodcount
                            })
                            Journal.findOneAndUpdate({_id: id},{dailyintake:entry },function(err2,jour2){
                                if (err2) throw err2
                                if (!jour2){
                                    res.status(403).send({success: false, msg: 'no scen hose'})
                                }
                                else{
                                    return res.json({success: true, msg: 'updated'})
                                }   
                            })
                        }
                        else if (req.body.type == 'heartrate'){
                            entry.push({
                                "date":req.body.date,
                                "time":req.body.time,
                                "bpm":req.body.bpm
                            })
                            Journal.findOneAndUpdate({_id: id},{heartrate:entry },function(err2,jour2){
                                if (err2) throw err2
                                if (!jour2){
                                    res.status(403).send({success: false, msg: 'no scen hose'})
                                }
                                else{
                                    return res.json({success: true, msg: 'updated'})
                                }    
                            })
                        }
                    }    
                })    
            }
        })
    }},



    addbp:function(req,res){
        if ((!req.body.id || !req.body.date || !req.body.diastolicpressure || !req.body.systolicpressure)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bpd = journaldata.bloodpressuredata
                        bpd.push({
                            "date":req.body.date,
                            "diastolicpressure":req.body.diastolicpressure,
                            "systolicpressure":req.body.systolicpressure
                        })
                        Journal.findOneAndUpdate({_id: id},{bloodpressuredata: bpd },function(err2,jour2){
                            if (err2) throw err2
                            if (!jour2){
                                res.status(403).send({success: false, msg:'Couldnt update'})
                            }
                            else{
                                return res.json({success: true, msg:'updated'})
                            }
                            
                        })
                    }    
                })    
            }
        })
        }
    },
    addtranfusion:function(req,res){
        if ((!req.body.id || !req.body.date || !req.body.age  ||!req.body.whitebloodcells || !req.body.amounttransfused)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bt = journaldata.bloodtransfusion
                        bt.push({
                            "date":req.body.date,
                            "age":req.body.age,
                            "whitebloodcells":req.body.whitebloodcells,
                            "amounttransfused":req.body.amounttransfused 
                        })
                        Journal.findOneAndUpdate({_id: id},{bloodtransfusion:bt },function(err2,jour2){
                            if (err2) throw err2
                            if (!jour2){
                                res.status(403).send({success: false, msg: 'no scen hose'})
                            }
                            else{
                                return res.json({success: true, msg:'updated'})
                            }
                            
                        })
                    } 
                })    
            }
        })
        }
    },
    addiron:function(req,res){
        if ((!req.body.id || !req.body.date || !req.body.medicinename || !req.body.unitstaken)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id : id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var iron = journaldata.ironintake
                        iron.push({
                            "date":req.body.date,
                            "medicinename":req.body.medicinename,
                            "unitstaken":req.body.unitstaken
                        })
                        Journal.findOneAndUpdate({_id: id},{ironintake:iron },function(err2,jour2){
                            if (err2) throw err2
                            if (!jour2){
                                res.status(403).send({success: false, msg: 'no scen hose'})
                            }
                            else{
                                return res.json({success: true, msg: 'updated'})
                            }
                            
                        })
                    }    
                })
            }
        })
        }
    },
    addheartrate:function(req,res){
        if ((!req.body.id || !req.body.date || !req.body.time || !req.body.bpm)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
        var id1 = new mongoose.Types.ObjectId(req.body.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var hr = journaldata.heartrate
                        hr.push({
                            "date":req.body.date,
                            "time":req.body.time,
                            "bpm":req.body.bpm
                        })
                        Journal.findOneAndUpdate({_id: id},{heartrate:hr },function(err2,jour2){
                            if (err2) throw err2
                            if (!jour2){
                                res.status(403).send({success: false, msg: 'no scen hose'})
                            }
                            else{
                                return res.json({success: true, msg: 'updated'})
                            }
                            
                        })
                    }  
                })
            }
        })
        }
    },

    getalltype : function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var entries = journaldata[req.query.type]
                        return res.json({success: true, msg: entries})
                    }
                })
            }
        })
    },
    

    getallbp:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bpd = journaldata.bloodpressuredata
                        return res.json({success: true, msg: bpd})
                    }
                })
            }
        })
    },
    getalltransfusion:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bt = journaldata.bloodtransfusion
                        return res.json({success: true, msg: bt})
                    }
                })
            }
        })
    },
    getalliron:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var iron = journaldata.ironintake
                        return res.json({success: true, msg: iron})
                    }
                })
            }
        })
    },
    getallheartrate:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id: id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var heartrate = journaldata.heartrate
                        return res.json({success: true, msg: heartrate})
                    }
                })
            }
        })
    },
    
    getrecenttype: function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var entries = journaldata[req.query.type]
                        var recent= entries[entries.length -1]
                        return res.json({success: true, msg: recent})
                    }
                })
            }
        })},
    getrecentbp:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bp = journaldata.bloodpressuredata
                        var recent= bp[bp.length -1]
                        return res.json({success: true, msg: recent})
                    }
                })
            }
        })
    },
    getrecenttranfusion:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var bt = journaldata.bloodtransfusion
                        var recent= bt[bt.length -1]
                        return res.json({success: true, msg: recent})
                    }
                }) 
            }
        })
    },
    getrecentiron:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var iron = journaldata.ironintake
                        var recent= iron[iron.length -1]
                        return res.json({success: true, msg: recent})
                    }
                })    
            }
        })
    },
    getmonthlyfoodintake:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var food = journaldata.dailyintake
                        var recent= JSON.parse(JSON.stringify(food[food.length -1]))
                        var goodcount= recent.goodfoodcount
                        var avgcount= recent.avgfoodcount
                        var badcount= recent.badfoodcount
                        var month = parseInt(recent.date[4,6])
                        for (var i = 0 ; i < food.length ; i++) {
                            if(parseInt(food[i].date[4,6])!= month){
                                break;
                            }
                            else{
                                goodcount = goodcount + food[i].goodfoodcount
                                avgcount = avgcount + food[i].avgfoodcount
                                badcount = badcount+ food[i].badfoodcount
                            }
                        }
                        
                        return res.json({success: true, good: goodcount, bad: badcount, avg:avgcount})
                    }
                })    
            }
        })
    },
    getrecentheartrate:function(req,res){
        var id1 = new mongoose.Types.ObjectId(req.query.id)
        User.findById({
            _id:id1}, function (err, user) {
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
                        res.status(403).send({success: false, msg: "no journal found"})
                    }
                    else{
                        var journaldata= JSON.parse(JSON.stringify(jour))
                        var hr = journaldata.heartrate
                        var recent= hr[hr.length -1]
                        return res.json({success: true, msg: recent})
                    }
                })
            }
        })
    }
}

module.exports = functions