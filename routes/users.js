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

    router.get('', function(req, res, next) {
        res.render('signup');
    });

    router.post('', async function(req, res, next) {
        const id = req.body.username;
        const pw = req.body.pass;
        const type = "normal";
        
        console.log(id, pw);

        const querying = async () => {
            let result = {};
            let conn;

            result.type = true;
            
            try {
                conn = await connection.getConnection(async c => c);
                try {
                    let sql = "SELECT * FROM user WHERE id=? and password=?";
                    connection.query(sql, [id, pw], function(error, rows, fields) {
                        if(error) {
                            console.log("database select error");
                            console.log(error);
                            result.type = false;
                            result.reason = "server db error";
                        } else {
                            if(rows.length !== 0) {
                                result.type = false;
                                result.reason = "exist id";
                            }
                        }
                    });

                    if(result.type) {
                        sql = "INSERT INTO " + secret.TABLE + "(id, password, type) VALUES(?,?,?)";
                        connection.query(sql, [id, pw, type], function(error, rows, fields) {
                            if(error) {
                                console.log("database insert error");
                                console.log(error);
                                result.type = false;
                                result.reason = "server db error";
                            } else {
                                console.log("user insert complete");
                                console.log(rows);
                                result.type = true;
                            }
                        });
                    }
                } catch(error) {
                    console.log("데이터베이스 쿼리 오류");
                    console.log(error);
                    result.type = false;
                    result.reason = "server db error";
                }
            } catch(error) {
                console.log("데이터베이스 연결 오류");
                console.log(error);
                result.type = false;
                result.reason = "server db error";
            } finally {
                conn.release();
                return result;
            }
        }

        const result = await querying();

        if(!result.type) {
            res.json({
                state: "fail",
                reason: result.reason,
            });
        } else {
            res.json({
                state: "success",
                href: SERVER+"/session",
            });
        }
    });
}


init();
module.exports = router;
