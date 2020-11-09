const express = require('express');
const mysql = require('mysql2/promise');
const os = require("os");
const secret = require('../secrets.json');

const router = express.Router();

let HOST = secret.DEVELOP_HOST; 
let ID = secret.DEVELOP_ID;
let PW = secret.DEVELOP_PW; 
let SERVER = secret.DEVELOP_SERVER;
let DB = secret.DB;
let connection;

function setInfoVariables() {
    if(os.hostname() !== secret.HOSTNAME) {
        HOST = secret.DEPLOY_HOST;
        ID = secret.DEPLOY_ID;
        PW = secret.DEPLOY_PW;
        SERVER = secret.DEPLOY_SERVER;
    }
}
/*
    DB connection
*/
function connectDB() {
    connection = mysql.createPool({
        host            : HOST,
        user            : ID,
        password        : PW,
        database        : DB,
        port            : "3306",
        charset         : "utf8",
    });
}

function init() {

    setInfoVariables();
    connectDB();

    /* GET users listing. */
    router.get('', function(req, res, next) {
        console.log(req.session.user);
        if(req.session.user) {
            res.send('이미 로그인 하신 상태입니다.');
            return;
        }
        res.render('login');
    });

    router.post('', async function(req, res, next) {
        const id = req.body.username;
        const pw = req.body.pass;
        
        console.log(id, pw);

        const querying = async () => {
            const result = {};
            let conn;
            try {
                conn = await connection.getConnection(async c => c);
                try {
                    const sql = "SELECT * FROM " + secret.TABLE + " WHERE id = ? and password = ?";
                    const [rows] = await connection.query(sql, [id, pw]);
                    result.data = rows;
                } catch(error) {
                    console.log("데이터베이스 쿼리 오류");
                    console.log(error);
                    result.data = [];
                }
            } catch(error) {
                console.log("데이터베이스 연결 오류");
                console.log(error);
                result.data = [];
            } finally {
                conn.release();
                return result;
            }
        }

        const result = await querying();

        console.log(result);
        if(result.data.length === 0) {
            res.json({state: "fail"});
        } else {
            req.session.user = id;
            res.json({
                state: "success",
                href: SERVER,
            });
        }
    });

    router.delete("", function(req, res, next) {
        req.session.destroy();
        res.redirect(SERVER);
    });
}

init();

module.exports = router;
