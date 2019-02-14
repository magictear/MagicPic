const fs = require('fs');
const Post = require('../models/post')
const path = require('path');
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名

function deletepost(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
module.exports = deletepost;