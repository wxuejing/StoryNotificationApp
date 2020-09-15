var express = require('express');
var router = express.Router();

var userDB = require('../db/user.js');
var db = require('../db/mysql.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/', function (req, res, next) {
    console.log("redirecting...");
    console.log(req.body);
    command = req.body.command;
    if (command === "redirect to signup page") {
        res.redirect('/signup');
    } else if (command === "redirect to deregister page"){
        res.redirect('/deregister');
    }else {
        username = req.body.username;
        password = req.body.password;

        var login = userDB.loginUser(username, password);

        console.log(login);

        db.getCon(login, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (result.length === 1) {
                res.send(result[0]);
                return;
            } else {
                res.status(200).send(err);
                return;
            }
        });
    }

});

module.exports = router;