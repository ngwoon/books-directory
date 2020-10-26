const express = require('express');
const mysql = require('mysql2');
const secret = require('../secrets.json');
const os = require("os");
const router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
    const id = req.body.username;
    const pw = req.body.pass;

    const connection_param = {
        host     : secret.DEVELOP_HOST,
        user     : secret.DEVELOP_ID,
        password : secret.DEVELOP_PW,
        database : secret.DB,
    };
    if(os.hostname() !== secret.HOSTNAME) {
        connection_param.host = secret.DEPLOY_HOST;
        connection_param.user = secret.DEPLOY_ID;
        connection_param.password = secret.DEPLOY_PW;
    }
    const connection = mysql.createConnection(connection_param);
    connection.connect();

    const sql = "SELECT * FROM " + secret.TABLE + " WHERE id = ? AND password = ?";
    connection.query(sql, [id, pw], (error, rows, fileds) => {
        if(error) {
          console.log("database sql execute error");
          console.log(error);
          res.render('error', {error,});
        } else {
          res.send("환영합니다. " + id + " 님.");
        }
    });
})

module.exports = router;
