var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var journalSchema = new Schema({
    bloodpressuredata: [{
        date:String,
        diastolicpressure:Number,
        systolicpressure:Number
    }],
    ironintake:[
        {
            date: String,
            medicinename: String,
            unitstaken: Number
        }
    ],
    bloodtransfusion:[
        {
           date: String,
           age: Number,
           whitebloodcells: Number,
           amounttransfused: Number 
        }
    ],
    DoctorVisits:[
        {
            DoctorName: String,
            date: String,
            symptoms: String,
            diagnosis: String
        }
    ],
    MedicineIntake:[{
        date:String,
        time: String,
        medicinename:String,
        unitstaken:Number
    }],
    heartrate:[
        {
            date: String,
            time: String,
            bpm: Number
        }
    ]
    ,
    dailyintake:[
        {
            date: String,
            goodfoodcount: Number,
            avgfoodcount: Number,
            badfoodcount: Number
        }
    ]


})

module.exports = mongoose.model('Journal', journalSchema)