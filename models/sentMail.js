var mongoose = require('mongoose');

var SentMail = new mongoose.Schema({
   to : String,
   from: String,
   subject: String,
    date : Date,
   error : String
});





mongoose.model('SentMail', SentMail);