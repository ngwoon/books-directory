var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  SERVER = "http://localhost:3000/"
  retObj = {
    title: 'Book Directory',
    menuList: ['1. 문서 편집', '2. 문서 찾기', '3. 로그인'],
    href: ['edit', 'search', 'login'],
  }
  res.render('index', retObj);
});

module.exports = router;
