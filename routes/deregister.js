var express = require('express');
var router = express.Router();

var userDB = require('../db/user.js')
var db = require('../db/mysql.js');

router.get('/', function (req, res, next) {
    res.render('deregister', {
        title: 'deregister'
    });
});

router.post('/dereg.json', function(req, res, next){
    user_name = req.body.user_name;
    password = req.body.password;
    email = req.body.email;

    console.log("user_name: ", user_name);
    console.log("psw: ", password);
    console.log("email: ", email);

    var deleteUser = userDB.deleteUser(user_name, password, email);

    db.getCon(deleteUser, (err, messages) => {
        if(err) {
            console.log(messages);
            res.status(500).send(messages);
            return;
        }
        console.log(messages);
        res.status(200).send('OK');
        return;
    });
});

module.exports = router;