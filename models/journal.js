var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var journalSchema = new Schema({
    dummyvalue:String,
    bloodpressuredata: [{
        date:String,
        diastolicpressure:Number,
        systolicpressure:Number,
        bp:Number
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
           heartrate: Number,
           antibodies: Number,
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
    }]


})

module.exports = mongoose.model('Journal', journalSchema)