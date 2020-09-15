var express = require('express');
var router = express.Router();

var hash = require('../api/hash.js');
var userDB = require('../db/user.js');
var db = require('../db/mysql.js');


/* GET users listing. */
router.get('/', function (req, res, next) {

    console.log(req.query.id);
    console.log(req.query.hash);

    var getUser = userDB.getUser(req.query.id);

    db.getCon(getUser, (err, getUserResult) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
        }

        console.log(getUserResult);
        if (getUserResult.length === 1) {
            console.log(getUserResult[0]);
            createdHash = hash.createHash(getUserResult[0].user_name, getUserResult[0].password, getUserResult[0].first_name, getUserResult[0].last_name);

            console.log(createdHash);

            if (createdHash === Number(req.query.hash)) {

                console.log("make active");

                var makeActive = userDB.makeActive(req.query.id);
                db.getCon(makeActive, (err, activeResult) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                        return;
                    }

                    console.log(activeResult);
                    res.render('verify', {
                        title: 'Verify'
                    }); 
                    return;
                });
            } else {
                res.status(200).send('hashes do not match');
                return;
            }
        } else {
            res.status(500).send("could not find user");
            return;
        }

    });

   
});

module.exports = router;