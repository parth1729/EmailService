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
module.exports = router;