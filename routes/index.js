const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const Pic = require('../models/pic')
var url = require('url');
const upload = require('../utilis/upload')
const deletepost = require('../utilis/deletepost')
var fs = require('fs');

module.exports = (app, passport) => {

    /* init variable. */
    var order_home, order_user, order_cate
    var keyword, category
    var filter_home, filter_user, filter_cate

    /* GET index page. */
    router.get('/', function(req, res) {
        res.render('index', { user: req.user });
    })

    /* GET official page. */
    router.get('/official', function(req, res) {
        res.render('official', { user: req.user });
    });

    /* GET sell page. */
    router.get('/sell', function(req, res) {
        res.render('sell', { user: req.user });
    });

    /* GET signup page. */
    router.get('/signup', function(req, res) {
        res.render('signup')
    })

    /* GET signin page. */
    router.get('/signin', function(req, res) {
        res.render('signin')
    })

    /* GET logout logic. */
    router.get('/logout', function(req, res) {
        req.logout()
        req.flash('成功退出！')
        res.redirect('/home')
    });

    /* GET home page. */
    router.get('/home', function(req, res) {
        //Model.find(condition, fields, { sort: [['_id', -1]] }, callback);
        //Model.find().sort({ '_id': -1 }).limit(1).exec(function (err, docs) { })
        var params = url.parse(req.url, true).query;
        keyword = params.s
        if (keyword == null) {
            filter_home = {}
        } else filter_home = {
            postname: eval("/" + keyword + "/i")
                //postname: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;
        switch (x) {
            case 'price':
                order_home = { 'price': 1 };
                break;
            case 'price-desc':
                order_home = { 'price': -1 };
                break;
            case '_id':
                order_home = { '_id': 1 };
                break;
            case '_id_desc':
                order_home = { '_id': -1 };
                break;
            case 'postname':
                order_home = { 'postname': 1 };
                break;
            case 'date':
                order_home = { 'date': 1 };
                break;
            case 'date_desc':
                order_home = { 'date': -1 };
                break;
            default:
                order_home = { '_id': 1 };
        }
        Post.find(filter_home).sort(order_home).exec(function(err, allPosts) {
            if (err) {
                console.log(err);
            } else {
                res.render('home', { user: req.user, posts: allPosts });
            }
        });
    })

    /* GET user page. */
    router.get('/user/:username', function(req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s;
        var x = params.orderby;
        if (keyword == null) {
            filter_user = { username: req.params.username };
        } else filter_user = {
            postname: eval("/" + keyword + "/i"),
            username: req.params.username
                //postname: { $regex: title, $Option: "$i" }  
        }
        switch (x) {
            case 'price':
                order_user = { 'price': 1 };
                break;
            case 'price-desc':
                order_user = { 'price': -1 };
                break;
            case '_id':
                order_user = { '_id': 1 };
                break;
            case '_id_desc':
                order_user = { '_id': -1 };
                break;
            case 'postname':
                order_user = { 'postname': 1 };
                break;
            case 'date':
                order_home = { 'date': 1 };
                break;
            case 'date_desc':
                order_home = { 'date': -1 };
                break;
            default:
                order_user = { '_id': 1 };
        }
        Post.find(filter_user).sort(order_user).exec(function(err, userPosts) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('user', { user: req.user, posts: userPosts });
            }
        })
    })

    /* category ------------------------------------------------------- */

    /* GET category page. */
    router.get('/category/:category', function(req, res) {
        var params = url.parse(req.url, true).query;
        keyword = params.s
        category = req.params.category
        if (keyword == null) {
            filter_cate = { classification: category }
        } else filter_cate = {
            postname: eval("/" + keyword + "/i"),
            classification: category
                //postname: { $regex: title, $Option: "$i" }   
        }
        var x = params.orderby;
        switch (x) {
            case 'price':
                order_cate = { 'price': 1 };
                break;
            case 'price-desc':
                order_cate = { 'price': -1 };
                break;
            case '_id':
                order_cate = { '_id': 1 };
                break;
            case '_id_desc':
                order_cate = { '_id': -1 };
                break;
            case 'postname':
                order_cate = { 'postname': 1 };
                break;
            case 'date':
                order_home = { 'date': 1 };
                break;
            case 'date_desc':
                order_home = { 'date': -1 };
                break;
            default:
                order_cate = { '_id': 1 };
        }
        Post.find(filter_cate).sort(order_cate).exec(function(err, classPosts) {
            if (err) {
                console.log(err);
                res.redirect('home')
            } else {
                res.render('category', { user: req.user, posts: classPosts });
            }
        });
    });

    /* POST add new category logic. */
    router.post('/category', function(req, res) {
        fs.readFile('./public/category.json', function(err, data) {
            if (err) {
                console.log(err);
            }
            var cate = data.toString(); //将二进制的数据转换为字符串
            cate = JSON.parse(cate); //将字符串转换为json对象
            cate.categories.push(req.body); //将传来的对象push进数组对象中
            var str = JSON.stringify(cate); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
            fs.writeFile('./public/category.json', str, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('----------新增成功-------------');
            })
        })
        res.redirect('newpost');
    });

    /* POST signup logic. */
    router.post('/signup', function(req, res) {
        User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                res.render('signup')
            }
            passport.authenticate('local')(req, res, function() {
                req.flash('注册成功！')
                res.redirect('/home')
            })
        })
    })

    /* POST singnin logic. */
    router.post('/signin', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/signin',
    }))

    /* post ------------------------------------------------------- */

    /* GET post page. */
    router.get('/post/:id', function(req, res) {
        Post.findById(req.params.id).populate("pics").exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                res.render('post', { user: req.user, post: foundPost });
            }
        });
    });

    /* GET newpost page. */
    router.get('/newpost', function(req, res) {
        res.render('newpost', { user: req.user });
    });

    /* POST add newpost logic. */
    router.post('/newpost', upload.single('file'), function(req, res) {
        var newpost = {
            postname: req.body.postname,
            postimage: req.file.path.replace("magic", "").split("\\").join("/"),
            username: req.user.username,
            price: req.body.price,
            classification: req.body.classification,
            date: new Date(),
            description: req.body.description
        };
        var newpic = {
            picname: req.file.filename,
            image: req.file.path.replace("magic", "").split("\\").join("/"),
            price: req.body.price,
            date: new Date(),
            description: req.body.description
        };
        Post.create(newpost, function(err, newpost) {
            if (err) {
                console.log(err);
            } else {
                console.log('added a post');
                Pic.create(newpic, function(err, newpic) {
                    if (err) {
                        console.log(err);
                    } else {
                        newpost.pics.push(newpic);
                        newpost.save();
                        res.redirect('home');
                    }
                });

            }
        });
    });

    /* GET edit post page. -*/
    router.get('/post/:id/edit', function(req, res) {
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                res.render('postedit', { user: req.user, post: foundPost });
            }
        });
    });

    /* PUT edit post logic.- */
    router.put('/post/:id', function(req, res) {
        var newpost = {
            postname: req.body.postname,
            postimage: req.body.image,
            username: req.user.username,
            price: req.body.price,
            classification: req.body.classification,
            date: new Date(),
            description: req.body.description
        };
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                fs.rename('./magic/' + foundPost.classification + "/" + foundPost.postname, './magic/' + newpost.classification + "/" + newpost.postname, function(error) {
                    if (error) {
                        console.log(error);
                        return false;
                    }
                    console.log('修改名字成功');
                })
            }
        });
        Post.findByIdAndUpdate(req.params.id, newpost, function(err, updatePost) {
            if (err) {
                console.log(err);
            } else {
                updatePost.save();
                res.redirect('/post/' + req.params.id);
            }
        });
    });

    /* DELETE post logic.- */
    router.delete('/post/:id', function(req, res) {
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                deletepost('./magic/' + foundPost.classification + "/" + foundPost.postname, function(error) {
                    if (error) {
                        console.log(error);
                        return false;
                    }
                    console.log('修改名字成功');
                })
            }
        });
        Post.findByIdAndDelete(req.params.id, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('删除成功！');
                res.redirect('/home');

            }
        });
    });

    /* pic ------------------------------------------------------- */

    /* GET product/pic page. */
    router.get('/post/:id/product/:picid', function(req, res) {
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                Pic.findById(req.params.picid, function(err, foundPic) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('product', { user: req.user, post: foundPost, pic: foundPic });
                    }
                });
            }
        });
    });

    /* GET newpic page. */
    router.get('/post/:id/newpic', function(req, res) {
        Post.findById(req.params.id, function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                res.render('newpic', { user: req.user, post: foundPost });
            }
        })
    })

    /* POST add newpic logic. */
    router.post('/post/:id/newpic', upload.single('file'), function(req, res) {
        var newpic = {
            picname: req.file.filename,
            image: req.file.path.replace("magic", "").split("\\").join("/"),
            price: req.body.price,
            date: new Date(),
            description: req.body.description
        };
        Post.findById(req.params.id, function(err, foundPost) {
            if (err) {
                console.log(err);
                res.redirect('/home');
            } else {
                Pic.create(newpic, function(err, newpic) {
                    if (err) {
                        console.log(err);
                    } else {
                        foundPost.pics.push(newpic);
                        foundPost.save();
                        console.log(newpic.picname);
                        res.redirect('/post/' + req.params.id);
                    }
                });
            }
        });
    });

    /* GET edit product/pic page. */
    router.get('/post/:id/product/:picid/edit', function(req, res) {
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                Pic.findById(req.params.picid, function(err, foundPic) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('edit', { user: req.user, post: foundPost, pic: foundPic });
                    }
                });
            }
        });
    });

    /* PUT edit product/pic logic. */
    router.put('/post/:id/product/:picid', function(req, res) {
        var newpic = {
            picname: req.body.picname,
            image: req.body.image,
            price: req.body.price,
            date: new Date(),
            description: req.body.description,
        };
        Post.findById(req.params.id).exec(function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                Pic.findById(req.params.picid, function(err, foundPic) {
                    fs.rename('./magic/' + foundPost.classification + "/" + foundPost.postname + '/' + foundPic.picname, './magic/' + foundPost.classification + "/" + foundPost.postname + '/' + newpic.picname, function(error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                        console.log('修改名字成功');
                    })
                })
                Pic.findByIdAndUpdate(req.params.picid, newpic, function(err, updatePic) {
                    if (err) {
                        console.log(err);
                    } else {
                        // foundPost.pics.push(updatePic);
                        foundPost.save();
                        res.redirect('/post/' + req.params.id + '/product/' + req.params.picid);
                    }
                });
            }
        });
    });

    /* DELETE product/pic logic. */
    router.delete('/post/:id/product/:picid', function(req, res) {
        Post.findById(req.params.id, function(err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                Pic.findById(req.params.picid, function(err, foundPic) {
                    fs.unlink('./magic/' + foundPost.classification + "/" + foundPost.postname + '/' + foundPic.picname, function(error) {
                        if (error) {
                            console.log(error);
                        }
                        console.log('删除文件成功');
                    })
                })
                Pic.findByIdAndDelete(req.params.picid, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        foundPost.save();
                        res.redirect('/post/' + req.params.id);
                    }
                });
            }
        })

    });

    app.use('/', router)
}