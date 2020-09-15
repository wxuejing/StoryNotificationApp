var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');

var category = require('../db/category.js');
var message = require('../db/message.js');
var archive = require('../db/archive.js');
var db = require('../db/mysql.js');
var hash = require('../api/hash.js');
var user = require('../db/user.js');

var config = new AWS.Config({
  accessKeyId: 'AKIAIBQQWV6CZ3LZFKNA',
  secretAccessKey: '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',
});

AWS.config.update(config);
var s3 = new AWS.S3();

// publisher home page
router.get('/', function (req, res, next) {
  res.render('publisher', {
    title: 'publisher'
  });
});

// router for viewing all published messages
router.get('/message', function (req, res, next) {
  var archive = message.insertIntoArchive();
  console.log(archive);

  db.getCon(archive, (err, messages) => {
    if (err) {
      console.log("messages:", messages);
      res.status(500).send(messages);
      return;
    }

    var delMessage = message.deleteFromMessage();
    console.log(delMessage);

    db.getCon(delMessage, (err, result) => {
      if (err) {
        console.log("result:", result);
        res.status(500).send(result);
        return;
      }

      res.render('pub_message', {
        title: 'edit message',
      });
      return;
    });
  });
});

// get all messages for publisher
router.post('/message.json', function (req, res, next) {
  uid = req.body.user;

  lat = req.body.lat;
  lng = req.body.lng;

  startdate = req.body.startdate;
  starttime = req.body.starttime;
  enddate = req.body.enddate;
  endtime = req.body.endtime;

  categories = req.body.categories;

  console.log(uid);
  console.log(lat);
  console.log(lng);
  console.log(startdate);
  console.log(starttime);
  console.log(enddate);
  console.log(endtime);
  console.log(categories);

  var checkuser = user.isActivePub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length === 1) {
      var sql = message.filterMessagesForPublisher(uid, lat, lng, startdate, starttime, enddate, endtime, categories);
      console.log(sql);

      db.getCon(sql, (err, result) => {
        if (err) {
          res.status(500).send(result);
          return;
        }

        var archivesql = archive.filterMessagesForPublisher(uid, lat, lng, startdate, starttime, enddate, endtime, categories);
        console.log(archivesql);

        db.getCon(archivesql, (err2, arcResult) => {
          if (err2) {
            res.status(500).send(arcResult);
            return;
          }

          console.log("archive: " + arcResult);

          res.status(200).json({
            "result": result,
            "arcResult": arcResult
          }).send();
          return;
        });
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });
});

// display edit category
router.get('/category', function (req, res, next) {
  // res.send('category');

  res.render('pub_category', {
    title: 'edit category'
  });
});

// create category
router.post('/category.json', function (req, res, next) {
  //console.log(req.body.user);
  cat = req.body.newCat;
  if (req.body.parentCat === 'no parent') {
    pat = cat;
  } else {
    pat = req.body.parentCat;
  }

  console.log(cat);
  console.log(pat);

  var checkuser = user.isActivePub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length === 1) {
      var createCategory = category.createCategory(cat, pat);

      db.getCon(createCategory, (err, result) => {
        if (err) {
          res.status(500).send(result);
          return;
        }

        res.status(200).send('OK');
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });


});

// display edit message
router.get('/edit', function (req, res, next) {
  // res.send('edit');
  res.render('pub_upload', {
    title: 'pub_upload'
  });
});

// get categories
router.post('/edit/display/categories.json', function (req, res, next) {
  var getAllCategories = category.getAllCategories();

  db.getCon(getAllCategories, function (err, result) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.status(200).send({
      "result": result
    });
    return;
  });

});

// add story
router.post('/edit', function (req, res, next) {

  var fstream;
  var formData = new Map();
  var fname;

  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {
    fname = filename;
    console.log("Uploading: " + filename);

    fstream = fs.createWriteStream(path.join(__dirname, '..', 'public', 'tmp', fname));
    file.pipe(fstream);
    fstream.on('close', function () {
      console.log("Upload Finished of " + fname);
    });
  });
  req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    formData.set(fieldname, val);
  });
  req.busboy.on('finish', function () {
    console.log(formData);
    console.log(fname);

    var checkuser = user.isActivePub(formData.get('username'));
    console.log(checkuser);

    db.getCon(checkuser, (err, chk) => {
      if (err) {
        console.log("checkuser failed: " + chk);
        res.status(500).send(chk);
        return;
      }

      if (chk.length === 1) {

        //Path where image will be uploaded
        var filestream = fs.createReadStream(path.join(__dirname, '..', 'public', 'tmp', fname));
        var fileid = hash.guid();
        var myBucket = 'cloud-cube';
        var myKey = 'f5xol9kgdwhj/' + fileid + fname;

        params = {
          Bucket: myBucket,
          Key: myKey,
          Body: filestream
        };

        s3.putObject(params, function (err, data) {

          if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
          }

          var username = formData.get('username');

          var startdate = formData.get('startdate');
          var enddate = formData.get('enddate');
          var starttime = formData.get('starttime');
          var endtime = formData.get('endtime');

          var latitude = formData.get('latitude');
          var longitude = formData.get('longitude');
          var radius = formData.get('radius');

          var category = formData.get('cat');

          let insertLocation = message.insertMessage(username, category,
            ('http:\/\/' + req.get('host') + '\/reader\/view?key=' + fileid + fname),
            latitude, longitude, radius, startdate + ' ' + starttime, enddate + ' ' + endtime);

          console.log(insertLocation);

          db.getCon(insertLocation, (err, result) => {
            if (err) {
              res.status(500).send(result);
              return;
            }

            console.log(result);
            console.log("Successfully uploaded data to myBucket/myKey");
            //res.status(200).send(result);
            res.render('submit', {
              title: 'submit'
            });
            return;
          });

        });
      } else {
        console.log("checkuser failed");
        res.status(500).send("invalid user");
        return;
      }
    });
  });


});

module.exports = router;