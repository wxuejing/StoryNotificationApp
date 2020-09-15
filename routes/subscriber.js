var express = require('express');
var router = express.Router();

var subscriptions = require('../db/subscriptions.js');
var message = require('../db/message.js');
var db = require('../db/mysql.js');
var dbuser = require('../db/user.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('subscriber', {
    title: 'subscriber'
  });
});

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

      res.render('sub_message', {
        title: 'view active messages'
      });
      return;
    });
  });
});

// get messages
router.post('/sub_message.json', function (req, res, next) {

  console.log(req.body);

  console.log("sub_message.json: ", req.body.user);

  user = req.body.user;
  lat = req.body.lat;
  lng = req.body.lng;
  startdate = req.body.startdate;
  starttime = req.body.starttime;
  enddate = req.body.enddate;
  endtime = req.body.endtime;
  categories = req.body.categories;
  publishers = req.body.publishers;

  console.log("user: ", user);
  console.log("lat: ", lat);
  console.log("lng: ", lng);
  console.log("categories: ", categories);
  console.log("publishers: ", publishers);

  var checkuser = dbuser.isActiveSub(user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length == 1) {
      var sql = message.filterMessagesForSubscriber(user, lat, lng, startdate, starttime, enddate, endtime, categories, publishers);

      console.log(sql);

      db.getCon(sql, (err, messages) => {
        if (err) {
          console.log("messages:", messages);
          res.status(500).send(err);
          return;
        }

        console.log("messages:", messages);

        res.status(200).json({
          "messages": messages
        }).send();
        return;
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });
});

router.get('/opt', function (req, res, next) {
  res.render('sub_opt', {
    title: 'edit subscriptions'
  });
});

router.post('/sub_opt.json', function (req, res, next) {
  // db query to get subscription of publishers
  // req.body.username
  user = req.body.user;

  // user = 'dax'; //hard code for now, delete in the future
  console.log("username: " + user);
  var getAllPublishers = subscriptions.getPublishersByUser(user);
  var getAllCategories = subscriptions.getCategoriesByUser(user);
  var getUnsubscribedCategoriesByUser = subscriptions.getUnsubscribedCategoriesByUser(user);
  var getUnsubscribedPublishersByUser = subscriptions.getUnsubscribedPublishersByUser(user);
  var pubs;
  var cats;
  var uncats;
  var unpubs;


  db.getCon(getAllPublishers, (err, publishers) => {
    if (err != null) {
      console.log("err1: ", err);
      res.status(500).send(err);
      return;
    }
    pubs = JSON.parse(JSON.stringify(publishers));
    console.log("publishers: ", pubs);

    db.getCon(getAllCategories, (err, categories) => {
      if (err != null) {
        console.log("err2: ", err);
        res.status(500).send(err);
        return;
      }
      cats = JSON.parse(JSON.stringify(categories));
      console.log("categories: ", cats);

      db.getCon(getUnsubscribedCategoriesByUser, (err, uncategories) => {
        if (err != null) {
          console.log("err3: ", err);
          res.status(500).send(err);
          return;
        }
        uncats = JSON.parse(JSON.stringify(uncategories));
        console.log("un_categories: ", uncats);

        db.getCon(getUnsubscribedPublishersByUser, (err, unpublishers) => {
          if (err != null) {
            console.log("err4: ", err);
            res.status(500).send(err);
            return;
          }
          unpubs = JSON.parse(JSON.stringify(unpublishers));
          console.log("un_publishers: ", unpubs);

          res.status(200).json({
            "publishers": pubs,
            "categories": cats,
            "unpubs": unpubs,
            "uncats": uncats
          }).send();
          return;

        });
      });
    });
  });

});


router.post('/sub_opt/delete_publisher.json', function (req, res, next) {

  user = req.body.user;
  pubDelete = req.body.delete;

  console.log(user);
  console.log(pubDelete);

  var checkuser = dbuser.isActiveSub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length == 1) {

      var deletePublisherByUser = subscriptions.deletePublisherByUser(user, pubDelete);

      db.getCon(deletePublisherByUser, (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        res.status(200).send('OK');
        return;
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });
});


router.post('/sub_opt/delete_category.json', function (req, res, next) {

  user = req.body.user;
  catDelete = req.body.delete;

  console.log(user);
  console.log(catDelete);

  var checkuser = dbuser.isActiveSub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length == 1) {
      var deleteCategoryByUser = subscriptions.deleteCategoryByUser(user, catDelete);

      db.getCon(deleteCategoryByUser, (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        res.status(200).send('OK');
        return;
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });
});

router.post('/sub_opt/add_publisher.json', function (req, res, next) {

  user = req.body.user;
  pubAdd = req.body.add;

  console.log(user);
  console.log(pubAdd);

  var checkuser = dbuser.isActiveSub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length == 1) {
      var addPublisherByUser = subscriptions.addPublisherByUser(user, pubAdd);

      db.getCon(addPublisherByUser, (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }


        res.status(200).send('OK');
        return;
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });
});

router.post('/sub_opt/add_category.json', function (req, res, next) {

  user = req.body.user;
  catAdd = req.body.add;

  console.log(user);
  console.log(catAdd);
  var checkuser = dbuser.isActiveSub(req.body.user);
  console.log(checkuser);

  db.getCon(checkuser, (err, chk) => {
    if (err) {
      console.log("checkuser failed: " + chk);
      res.status(500).send(chk);
      return;
    }

    if (chk.length == 1) {
      var addCategoryByUser = subscriptions.addCategoryByUser(user, catAdd);

      console.log(addCategoryByUser);

      db.getCon(addCategoryByUser, (err, result) => {
        if (err) {
          // console.trace();
          res.status(500).send(result);
          return;
        }

        res.status(200).send(result);
        return;
      });
    } else {
      console.log("checkuser failed");
      res.status(500).send("invalid user");
      return;
    }
  });

});
module.exports = router;