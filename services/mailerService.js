var Promise = require("bluebird");
var p = Promise.promisifyAll(require("nodemailer"));
//var nodemailer = require('nodemailer'); //create nodemail object
var sgTransport = require('nodemailer-sendgrid-transport'); //sendGrid transport
var mgTransport = require('nodemailer-mailgun-transport'); //mailGun transport
var mdTransport = require('nodemailer-mandrill-transport'); //mandrill/mailchimp transport
var mailerClient = require('../constants/Const');



exports.emailSendGrid = function (emailInfo, callback) {
    // var err = null;
    // emailInfo = JSON.parse(emailInfo);
   // var test = JSON.parse(emailInfo);
    configOption(mailerClient.mailerClient.sendGrid, function (mailer) {    //use SendGrid transport
        configEmail(emailInfo, function (emailData) {
            mailer.sendMail(emailData).then(function (data) {
                console.log(data);
                callback(null,data);

            }).catch(function (err) {
                configOption(mailerClient.mailerClient.mailGun, function (mailer) {   //if sendGrid transport fails try mailGun
                    configEmail(emailInfo, function (emailData) {
                       
                        mailer.sendMail(emailData).then(function (data) {
                            callback(null,data);
                        }).catch(function (err) {
                            console.log(err);
                            callback(err, null);
                        });
                    });

                });
            });
            
        });
    });
     
};

//configure options for sending mails 
var configOption = function (opt, callback) {
    //var serviceId = opt;
    var mailer = null;
    switch (opt) {
        case 0:
            var options = {
                auth: {
                    api_user: 'testmail123',
                    api_key: 'test12345'
                }
            }
            
            //mailer = nodemailer.createTransport(sgTransport(options));
            mailer = p.createTransport(sgTransport(options));
            break;
        case 1:
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
        to: EmailInfo.email,
        subject: EmailInfo.subjectMail,   //'Urgent Meeting',
        text: 'Come inside for an urgent meeting',
        html: '<p>' + EmailInfo.emailBody + '</p>'
    };
    callback(email);
};
