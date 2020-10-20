const express = require('express');
const fs = require('fs');

var router = express.Router();

router.get('/edit/:id', function(req, res, next) {
    const fileName = decodeURI(req.params.id);
    const path = __dirname + "/../public/files/" + fileName;

    fs.readFile(path, function(error, contentBuffer) {
        if(error) {
            const path = '/../public/files'
            const files = fs.readdirSync(__dirname + path);
            res.render('edit_list', {
                titles: files,
            });
        } else {
            const content = contentBuffer.toString("utf-8");
            res.render('edit_file', {
                title: req.params.id,
                content: content,
            });
        }
    });
    
});

router.get('/search', function(req, res, next) {
    res.send("search page");
});

module.exports = router;