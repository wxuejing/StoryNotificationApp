var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');

var message = require('../db/message.js');
var db = require('../db/mysql.js');

var config = new AWS.Config({
  accessKeyId: 'AKIAIBQQWV6CZ3LZFKNA',
  secretAccessKey: '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',
});

AWS.config.update(config);
var s3 = new AWS.S3();

router.get('/', function (req, res, next) {
  res.render("reader", {
    title: 'Reader'
  });
});

router.get('/messages.json', function (req, res, next) {
  var getAllMessages = message.getAllMessages();

  db.getCon(getAllMessages, (err, result) => {
    if (err != null) {
      res.status(500).send(err);
      return;
    }

    console.log("server: " + result);

    res.status(200).json({
      "result": result
    }).send();
    return;
  });
});

router.get('/view', function (req, res, next) {

  var fileKey = req.query.key;
  console.log(fileKey);

  // download the file 
  console.log('Trying to download file', fileKey);
  var options = {
    Bucket: 'cloud-cube',
    Key: 'f5xol9kgdwhj/' + fileKey
  };

  var filePath = path.join(__dirname, "..", "public", "tmp", fileKey);

  var out = fs.createWriteStream(filePath, {
    flags: 'w',
    encoding: null,
    mode: 0666
  });
  s3.getObject(options).createReadStream().pipe(out).on('finish', function () {
    res.sendFile(filePath);
    return;
  });
});

module.exports = router;