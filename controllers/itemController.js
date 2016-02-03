var Item = require('../models/item'),
    User = require('../models/user'),
    async = require('async'),
    url = require('url'),
    fs = require("fs"),
    formidable = require('formidable');


ItemController = {};

ItemController.create_item = function(req, res, next){

    req.checkBody("title", "Enter a valid title (length 4-50)").isLength({ min: 4, max: 50 });
    req.checkBody("price", "Enter a valid price (Example 5500.00)")
        .isCurrency({require_symbol: false, allow_space_after_digits: false, decimal_separator: '.' });

    var errors = req.validationErrors();
    if (errors) {
        res.status(422, "Unprocessable Entity");
        res.json(errors);
    } else {

        User.findOne({"id": req.decoded.id}, function (err, user) {
            if (err) {
                console.log(err);
                res.json(500, err);
            } else if (user) {
                var item = new Item({
                    "title": req.body.title,
                    "price": req.body.price,
                    "user_id": user.id
                });
                item.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json(500, err);
                    } else {
                        res.json(item.getInfo(user.getInfo()));
                    }
                });
            } else {
                res.status(403, "Forbidden");
                res.end();
            }
        });
    }
};

//router.get('/item?title=notebook&user_id=1&order_by=created_at&order_type=desc',
ItemController.search_item = function(req, res, next) {
    var urlParsed = url.parse(req.url, true);

    var title = urlParsed.query.title;
    var user_id = urlParsed.query.user_id;

    var search = { };
    if (title)
        search["title"] = title;
    if (user_id)
        search["user_id"] = user_id;

    //order_by - [price|created_at] (optional, default=created_at)
    var order_by = (urlParsed.query.order_by == "price") ? "price" : "created_at";
    //order_type - [asc|desc] (optional, default=desc)
    var order_type = (urlParsed.query.order_type == "asc") ? "" : "-";
    var sort = order_type + order_by;

    Item.find(search, {}, {sort: sort}, function(err, items) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (items) {
            async.map(
                items,
                function(item, callback) {
                    User.findOne({id: item.user_id}, function (err, user) {
                        if (err) {
                            console.log(err);
                            res.json(500, err);
                        } else if (user) {
                            callback(err, item.getInfo(user.getInfo()));
                        } else {
                            callback(err, item.getInfo("User Not found"));
                        }
                    });
                },
                function(err, result) {
                    if (err){
                        console.log(err);
                        res.json(500, err);
                    }
                    res.json(result)
                }
            );
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });
};

ItemController.get_item = function(req, res, next) {
    var item_id = req.params.id;
    Item.findOne({"id": item_id})/*.populate('user')*/.exec(function (err, item){
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (item) {
            User.findOne({"id": item.user_id}, function (err, user) {
                if (err) {
                    console.log(err);
                    res.json(500, err);
                } else if (user) {
                    res.json(item.getInfo(user.getInfo()));
                } else {
                    res.json(item.getInfo("User not found"));
                }
            });
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });
};

ItemController.put_item = function(req, res, next) {
    if (req.body.title)
    req.checkBody("title", "Enter a valid title (length 4-50)").isLength({ min: 4, max: 50 });
    if (req.body.price)
    req.checkBody("price", "Enter a valid price (Example 5500.00)")
        .isCurrency({require_symbol: false, allow_space_after_digits: false, decimal_separator: '.' });

    var errors = req.validationErrors();

    if (errors) {
        res.status(422, "Unprocessable Entity");
        res.json(errors);
    } else {
        var item_id = req.params.id;
        Item.findOne({"id": item_id}, function (err, item) {
            if (err) {
                console.log(err);
                res.json(500, err);
            } else if (item) {
                var current_user_id = req.decoded.id;
                if (item.user_id == current_user_id){
                    if (req.body.title)
                        item.title = req.body.title;
                    if (req.body.price)
                        item.price = req.body.price;
                    User.findOne({"id": item.user_id}, function (err, user) {
                        if (err) {
                            console.log(err);
                            res.json(500, err);
                        } else if (user) {
                            item.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.json(500, err);
                                } else {
                                    res.json(item.getInfo(user.getInfo()));
                                }
                            })
                        } else {
                            res.json(item.getInfo("User not found"));
                        }
                    });
                } else {
                    res.status(403, "Forbidden");
                    res.end();
                }
            } else {
                res.status(404, "Not found");
                res.end();
            }
        })
    }
};

ItemController.delete = function(req, res, next) {
    var currentuser_id = req.decoded.id;
    var item_id = req.params.id;

    Item.findOne({"id": item_id}, function (err, item) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (item) {
            if (item.user_id == currentuser_id){
                item.remove(function(err){
                    if (err) {
                        console.log(err);
                        res.json(500, err);
                    } else {
                        res.end();
                    }
                });
            } else {
                res.status(403, "Forbidden");
                res.end();
            }
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });
};

ItemController.image_post = function(req, res, next) {
    var user_id = req.decoded.id;
    var item_id = req.params.id;

    Item.findOne({"id": item_id}, function (err, item) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (item) {
            if (item.user_id == user_id){

                var form = new formidable.IncomingForm();
                form.uploadDir = "./public/images/users_uploads/";
                form.keepExtensions = true;
                form.maxFieldsSize = 2 * 1024 * 1024;   //default 2 * 1024 * 1024
                form.multiples = false;
                var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', "image/gif"];

                var errors = [];

                form.on('fileBegin', function chek(name, file) {
                    if (name != "file"){
                        form.emit('error', new Error('File upload canceled by the server.'));
                    }
                    if (form.bytesExpected > form.maxFieldsSize) {
                        errors.push({"field": "file",
                            "message":"The file " + file.name + " is too big. Limit is "
                            + (form.maxFieldsSize / 1024 / 1024).toFixed(2) + " Mb."});
                    }

                    if (supportMimeTypes.indexOf(file.type) == -1) {
                        errors.push({"field": "file",
                            "message":"Unsupported mimetype " + file.type});
                    }
                    form.removeListener('fileBegin', chek);
                });

/*
                form.on('progress', function chekFileSize(bytesReceived, bytesExpected) {
                    if (bytesReceived > form.maxFieldsSize) {
                        errors.push({"field": "image",
                            "message":"The file " + form.openedFiles[0].name + " is too big. Limit is "
                            + (form.maxFieldsSize / 1024 / 1024).toFixed(2) + " Mb."});
                        console.log('### ERROR: FILE TOO LARGE');
                        form.removeListener('progress', chekFileSize);
                        form.emit('error', new Error('File upload canceled by the server.'));
                    }
                });
*/

                form.on('aborted', function() {
                    errors.push({"field": "file",
                        "message":"Aborted upload."});
                });

                form.on('end', function(name, file) {
                });

                form.parse(req, function(err, fields, files) {
                    if (err) {
                        console.log(err);
                    }
                    if (form.openedFiles == 0){
                        errors.push({"field": "file",
                            "message":"The file is required."});
                    }
                    if (errors.length > 0) {
                        if (form.openedFiles != 0) {
                            fs.unlink(form.openedFiles[0].path,
                                function (err) { console.log(err); });
                        }
                        res.status(422, "Unprocessable Entity");
                        res.json(errors);

                    } else {
                            User.findOne({"id": item.user_id}, function (err, user) {
                            if (err) {
                                console.log(err);
                                res.json(500, err);
                            } else if (user) {
                                var new_name = user.id + "_" + Date.now() + "_" + files.file.name;

                                fs.rename(files.file.path, form.uploadDir + new_name,
                                    function (err) {
                                        if (err) console.log(err);
                                    }
                                );
                                if (item.image != "")
                                    fs.unlink(item.image.replace("http://"+req.headers.host, "./public"),
                                        function (err) {
                                            if (err) console.log(err);
                                        }
                                    );

                                item.image = "http://" + req.headers.host + form.uploadDir.replace(/\.\/public/i, "") + new_name;
                                item.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.json(500, err);
                                    } else {
                                        res.json(item.getInfo(user.getInfo()));
                                    }
                                })
                            } else {
                                res.status(403, "Forbidden");
                                res.end();
                            }
                        })
                    }
                });
            } else {
                res.status(403, "Forbidden");
                res.end();
            }
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });

};

ItemController.image_del = function(req, res, next) {
    var currentuser_id = req.decoded.id;
    var item_id = req.params.id;

    Item.findOne({"id": item_id}, function (err, item) {
        if (err) {
            console.log(err);
            res.json(500, err);
        } else if (item) {
            if (item.user_id == currentuser_id){
                if (item.image != "")
                    fs.unlink(item.image.replace("http://"+req.headers.host, "./public"),
                        function (err) { console.log(err); });
                item.image = "";
                item.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json(500, err);
                    } else {
                        //res.status(200);
                        res.end();
                    }
                })
            } else {
                res.status(403, "Forbidden");
                res.end();
            }
        } else {
            res.status(404, "Not found");
            res.end();
        }
    });

};

module.exports = ItemController;