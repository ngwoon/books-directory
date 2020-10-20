var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  SERVER = "http://localhost:3000/"
  res.render('index', {
      title: 'Book Directory',
      menuList: ['1. 문서 편집', '2. 문서 찾기', '3. 로그인'],
      href: ['document/edit/main', 'document/search', 'users/login'],
    });
});

module.exports = router;
