var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

var userDB = require('../db/user.js');
var db = require('../db/mysql.js');
var hash = require('../api/hash');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'storynotificationteam26@gmail.com',
        pass: 'nhy6&UJM'
    }
});

router.get('/', function (req, res, next) {
    //if(req.session.test){
    res.render('signup', {
        title: 'SignUp'
    });
    //}
});

router.post('/', function (req, res, next) {
    // req.session.check = true;
    console.log("signup router");
    console.log(req.body);

    // create user in the user table 
    email = req.body.email;
    username = req.body.username;
    first = req.body.first;
    last = req.body.last;
    password = req.body.password;
    type = req.body.type;

    var signup = userDB.insertUser(email, username, first, last, password, type);

    console.log(signup);

    db.getCon(signup, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
        }

        console.log("result: " + result);

        var h = hash.createHash(username, password, first, last)
        
        console.log(h);
    
        var mailOptions = {
            from: 'storynotificationteam26@gmail.com',
            to: email,
            subject: 'Story Notification : Confirm your email',
            html: "Hi " + first + ",<br><a href=http://" + req.get('host') + "/verify?id=" + username + "&hash=" +
                h + ">Verify your email</a><br> Thanks!"
        };
    
        // email sent
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send(error);
                return;

            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('email sent');
                return;
            }
        });
    });
});

module.exports = router;