var Promise = require("bluebird");
var p = Promise.promisifyAll(require("nodemailer"));
//var nodemailer = require('nodemailer'); //create nodemail object
var sgTransport = require('nodemailer-sendgrid-transport'); //sendGrid transport
var mgTransport = require('nodemailer-mailgun-transport'); //mailGun transport
var mdTransport = require('nodemailer-mandrill-transport'); //mandrill/mailchimp transport
var mailerClient = require('../constants/Const');
var mongoose = require('mongoose');






exports.emailSendGrid = function (emailInfo, callback) {
    var EmailServicePriorities = mongoose.model('emailServicePriorities');
    var SentMail = mongoose.model('SentMail');
    EmailServicePriorities.findOne({}, function (err, priorities) {
        if (err) { }
        // configOption(mailerClient.mailerClient.sendGrid, function (mailer) {    //use SendGrid transport
        configOption(priorities.priority1, function (mailer) {  //use SendGrid transport
            configEmail(emailInfo, function (emailData) {
                mailer.sendMail(emailData).then(function (data) {
                    
                    saveMail(emailInfo, function (savedMailInfo) {
                        callback(null, data);
                    });
                        
                    
                   

                }).catch(function (err) {
                    //configOption(priorities.priority1, function (mailer) {   //if sendGrid transport fails try mailGun
                    configOption(priorities.priority1, function (mailer) {   //if sendGrid transport fails try mailGun
                        configEmail(emailInfo, function (emailData) {
                            
                            mailer.sendMail(emailData).then(function (data) {
                                
                                saveMail(EmailInfo, function (savedMailInfo) {
                                    callback(null, data);
                                });
                               
                            }).catch(function (err) {
                                emailInfo.error = err;
                                saveMail(emailInfo, function (savedMailInfo) {
                                    callback(err, null);
                                });
                        
                            
                             
                            });
                        });

                    });
                });
            
            });
        });
    });
     
};


exports.savePriorities = function (emailPriorities, callback) {
    var EmailServicePriorities = mongoose.model('emailServicePriorities');
    
    EmailServicePriorities.findOneAndUpdate({ userId : 'test' }, { userId : 'test', 'priority1': emailPriorities.priority1, 'priority2' : emailPriorities.priority2 }, { upsert: true }, function (err, doc) {
        if (err) callback(err, null);
        callback(null, doc);
    });
};


exports.getSentMails = function (callback) {
    var SentMail = mongoose.model('SentMail');
    
    SentMail.find({}, function (err, doc) {
        if (err) callback(err, null);
        callback(null, doc);
    });
};

//configure options for sending mails 
var configOption = function (opt, callback) {
    //var serviceId = opt;
    var mailer = null;
    switch (opt) {
        case 'SendGrid':
            var options = {
                auth: {
                    api_user: 'testmail123',
                    api_key: 'test12345'
                }
            }
            
            //mailer = nodemailer.createTransport(sgTransport(options));
            mailer = p.createTransport(sgTransport(options));
            break;
        case 'MailGun':
            var options = {
                auth: {
                    api_key: 'key-2a4b753aa7181c34cb0985445a1878de',
                    domain: 'sandbox54bdea6774864fb2bc402d448a70c81b.mailgun.org'
                }
            }
            mailer = p.createTransport(mgTransport(options));
            // mailer = nodemailer.createTransport(mgTransport(options));
            break;
        case 2:
            var options = {
                auth: {
                    apiKey: 'wSTG8WyPNEPq-sdvl2NEkw'
                }
            }
            
            mailer = nodemailer.createTransport(mdTransport(options));
            break;
    }
    callback(mailer);
};



var configEmail = function (EmailInfo, callback) {
    //var serviceId = opt;
    var email = {
        from: EmailInfo.senderEmail,   // "vishal.bandiwadekar@varahitechnologies.com",
        to: [EmailInfo.email],
        subject: EmailInfo.subjectMail,
        text: 'Come inside for an urgent meeting',
        html: '<p>' + "test" + '</p>'
    };
    callback(email);
};

var saveMail = function (emailData, callback) {
    var SentMail = mongoose.model('SentMail');
    var SentMail = new SentMail();  //create an object to save a sent mail
    SentMail.to = emailData.email;
    SentMail.from = emailData.senderEmail;
    SentMail.subject = emailData.subjectMail;
    SentMail.error = emailData.error;
    SentMail.date = new Date();
    
    SentMail.save(function (err, doc) { // save the sent mail
        if (!err)
            callback(doc);
    });
};


