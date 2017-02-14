var express = require('express');
var router = express.Router();
var mailerService = require('../services/mailerService');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/* Post Mail information */
router.post('/emailInfo', function (req, res) {
    // var test = JSON.parse(req.body);
    mailerService.emailSendGrid(req.body, function (err, data) {
        console.log(data);
        if (err) {
            res.status(404).json({ message: 'not found.', data: null });
        }
        else
            res.json({ message: 'success', data: data });
    });
   
});

/* Post priorities */
router.post('/postPriorities', function (req, res) {
    // var test = JSON.parse(req.body);
    mailerService.savePriorities(req.body, function (err, data) {
        console.log(data);
        if (err) {
            res.status(404).json({ message: 'not found.', data: null });
        }
        else
            res.json({ message: 'success', data: "priorities added successfully." });
    });
   
});

/* get sent emails*/
router.get('/getSentEmails', function (req, res) {
    // var test = JSON.parse(req.body);
    mailerService.getSentMails(function (err, sentEmailData) {
        if (err) {
            res.status(404).json({ message: 'not found.', data: null });
        }
        else
            res.json({ message: 'success', data: sentEmailData });
    });
});
module.exports = router;