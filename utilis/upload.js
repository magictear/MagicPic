const fs = require('fs');
var multer = require('multer');
const Post = require('../models/post')
const path = require('path');
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        function mkdirsSync(dirname) {
            //console.log(dirname);
            if (fs.existsSync(dirname)) {
                return true;
            } else {
                if (mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname);
                    return true;
                }
            }
        }
        if (req.params.id) {
            Post.findById(req.params.id, function(err, foundPost) {
                if (err) {
                    console.log(err);
                } else {
                    var uploadFolder = './magic/' + foundPost.classification + "/" + foundPost.postname + '/';
                    mkdirsSync(uploadFolder, null);
                    // 接收到文件后输出的保存路径（若不存在则需要创建）
                    cb(null, uploadFolder);
                }
            })
        } else {
            var uploadFolder = './magic/' + req.body.classification + "/" + req.body.postname + '/';
            mkdirsSync(uploadFolder, null);
            // 接收到文件后输出的保存路径（若不存在则需要创建）
            cb(null, uploadFolder);
        }
    },

    filename: function(req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, file.originalname);
    }
});


// 创建 multer 对象
var upload = multer({ storage: storage });

module.exports = upload;