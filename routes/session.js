const express = require('express');
const secret = require("../secrets.json");
const connection = require("../dbconn.js");
const router = express.Router();

const SERVER = secret.SERVER;
const TABLE = "user";

function init() {

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
                    const sql = "SELECT * FROM " + TABLE + " WHERE id = ? and password = ?";
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
