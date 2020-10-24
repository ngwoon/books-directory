var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  SERVER = "http://localhost:3000/"
  res.render('index', {
      title: 'Books Directory',
    });
});

module.exports = router;
