const express = require('express');
const fs = require('fs');

const router = express.Router();
let fileList = [];

function init() {
    const path = '/../public/files'
    const files = fs.readdir(__dirname + path, function(error, files) {
        if(error) {
            // 디렉토리 파일 읽어오기 에러 처리 -> 500에러
        }
        files.forEach(file => {
            const splited = file.split(".");
            fileList.push(splited[0]);
        });
    });



    router.get('/search', function(req, res, next) {
        const title = req.query['file'];
        const fileName = title + ".txt";
        
        const path = "/../public/files/" + fileName;
        fs.readFile(__dirname + path, function(error, content) {
            if(error) {
                res.render("404");
            } else
                res.render("show_file", {title, content,});
        });
    });

    router.post('/search', function(req, res, next) {
        const searchTerm = req.body.searchTerm.split(" ");

        const coincideFiles = [];
        fileList.forEach(file => {
            for(let i=0; i<searchTerm.length; ++i) {
                if(file.indexOf(searchTerm[i]) !== -1) {
                    coincideFiles.push(file);
                    break;
                }
            }
        });

        res.render("search_result", {
            files: coincideFiles,
        })
    });
}

init();
module.exports = router;


// router.get('/', function(req, res, next) {
    //     const oTitle = req.query.title.concat('.txt');
    //     const fileName = decodeURI(oTitle);
    //     const reqType = req.query.type;
    //     const path = __dirname + "/../public/files/" + fileName;
    
    //     console.log(fileName, reqType, path);
    
    //     fs.readFile(path, function(error, contentBuffer) {
    //         const content = contentBuffer.toString("utf-8");
    //         res.render('edit_file', {
    //             title: fileName,
    //             content: content,
    //             reqType: reqType,
    //         });
    //     });
        
    // });
    
    // router.get('/list', function(req, res, next) {
    //     const path = '/../public/files'
    //     const files = fs.readdir(__dirname + path, function(error, files) {
    //         if(error) {
    //             // 디렉토리 파일 읽어오기 에러 처리 -> 500에러
    //         }
    //         res.render('edit_list', {
    //             titles: files,
    //         });
    //     });
    // });
    