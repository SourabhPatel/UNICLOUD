const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
var formurl = require('form-urlencoded');
var Dropbox = require('dropbox');
var http = require('http');
var mongo = require('mongodb');
var assert = require('assert');
var request = require('request');
const config = require('../config/database');
//var sleep = require('sleep');
var multer = require('multer');
var fs = require("fs");
var path = require("path");
const Model_Token = require('../models/model_token');
const User = require('../models/user');
const shareModel = require('../models/sharefile');

var url = 'mongodb://localhost:27017/meanauth';
//...............................//....................................//.........................
router.get('/token/:user_id', function (req, res) {
    user_id = req.params.user_id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.redirect("https://www.dropbox.com/oauth2/authorize?client_id=aau6dodglhi4ziz&redirect_uri=http://localhost:8080/dropbox/callback/&response_type=code");

});

router.get('/callback/', function (req, res) {
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    var options = {
        url: "https://api.dropboxapi.com/oauth2/token",
        method: "POST",
        headers: headers,
        form: {
            'code': req.query.code,
            'grant_type': "authorization_code",
            'client_id': "aau6dodglhi4ziz",
            'client_secret': "sm18n65itq8yyfy",
            'redirect_uri': "http://localhost:8080/dropbox/callback/"
        }
    }
    request(options, (error, response, body) => {
        if (error)
            console.log('error =' + error);
        else {
            var data = JSON.parse(response.body);
            res.redirect("http://localhost:4200/fanthom?code=" + data.access_token);

            //  storeToken(data.access_token);
            //    request('http://localhost:8080/dropbox/storeToken/',data.access_token )
        }
    });

});

//...............................//....................................//.........................

//Store Dropbox Token
router.post('/storeToken', (req, res) => {
    let token = new Model_Token({
        user_id: req.body.user_id,
        cloud_name: "dropbox",
        access_token: req.body.access_token
    });
    Model_Token.addToken(token, (err, res) => {
        if (err) {
            console.log("error");
        }
        else {
            console.log("success");

        }
    })


});


//...............................//....................................//.........................
router.get('/getToken/:user_id', function (req, res) {

    var access_token = new String();
    var user_id = req.params.user_id;
    var ref = new String();
    Model_Token.findOne({ user_id: user_id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            access_token = tokens.access_token;
            res.json({ access_token: access_token });
        }
        else console.log("token not found");
        res.json({ access_token: "null" });
    });

})

router.get('/getTokenByEmail/:email', function (req, res) {

    var access_token = new String();
    var user_id;
    var email = req.params.email;
    User.findOne({ email: email }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            user_id = tokens._id;

        }
        else {
            return;
        }
        if (!tokens) return;
    });
    setTimeout(function () {
        var ref = new String();
        Model_Token.findOne({ user_id: user_id }, function (err, tokens) {
            if (err) { return handleError(res, err); }
            if (tokens) {
                access_token = tokens.access_token;
                res.json({ access_token: access_token });
            }
            else {
                console.log("token not found");
                res.json({ access_token: "null" });
            }
        });
    }, 1000);
})


//...............................//....................................//.........................


//List  files in dropbox account

router.get('/getAllFiles', function (req, res) {
    var dropbox;
    var user_id = req.query.user_id;
    var path = req.query.path;
    console.log("path = " + path);
    console.log("id = " + user_id);
    var access_token = new String();
    var ref = new String();
    Model_Token.findOne({ user_id: user_id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            access_token = tokens.access_token;
        }
        else {
            return;
        }
        if (!tokens) return;
    });

    setTimeout(function () {
        dropbox = new Dropbox({ accessToken: access_token });


        dropbox.filesListFolder({ path: path.toString() })
            .then(function (response) {
                if (response.length == 0)
                    res.send({ message: "no files found" });
                else {
                    //   console.log(response);
                    res.json(response);
                }
            })
            .catch(function (error) {
                console.log("error occured in getting files from dropbox");
            });
    }, 1000);

});
var storage = multer.diskStorage({ //multers disk storage settings

    destination: function (req, file, cb) {

        cb(null, './uploads/');

    },

    filename: function (req, file, cb) {

        var datetimestamp = Date.now();

        cb(null, req.query.name);

    }

});


function UploadToDropbox(name, id, uploadPath) {
    var token = new String();
    var ref = new String();
    Model_Token.findOne({ user_id: id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            token = tokens.access_token;
        }
        else {
            return;
        }
    });
    setTimeout(function () {
        fs.readFile(path.join("./uploads/", name), function (err, contents) {
            if (err) {
                console.log('Error: ', err);
            }
            //     console.log("contenteef : \n");
            // console.log(contents);
            var dbx = new Dropbox({ accessToken: token });
            dbx.filesUpload({ path: uploadPath + '/' + name, contents: contents })
                .then(function (response) {
                    //                    console.log(response);
                    console.log("File uploaded Successfully...!!!");
                })
                .catch(function (error) {
                    console.error("err = " + error);
                });
        });

    });
}
var upload = multer({ //multer settings

    storage: storage

}).single('uploadFile');



/** API path that will upload the files */

router.post('/upload/', function (req, res) {
    upload(req, res, function (err) {
        UploadToDropbox(req.query.name, req.query.id, req.query.path);
        if (err) {

            res.json({ error_code: 1, err_desc: err });

            return;

        }

        res.json({ error_code: 0, err_desc: null });

    });

});

//................delete file from dropbox......................../////////


router.delete('/deleteFile', (req, res, next) => {
    console.log(JSON.stringify(req.query.user));
    var id = req.query.id;
    var path = req.query.path;
    var token;
    var email = req.query.email;
    console.log(id + "  " + path + "   " + email);
    var fname = path.substring(path.lastIndexOf('/') + 1, path.length);
    console.log("name = " + fname);
    Model_Token.findOne({ user_id: id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            token = tokens.access_token;
        }
        else {
            return;
        }
    });
    setTimeout(function () {
        var dbx = new Dropbox({ accessToken: token.toString() });
        dbx.filesDelete({ path: path })
            .then(function (response) {
                shareModel.remove({ "sharedBy": email, "file.cloud": "dropbox", "file.name": fname }, function (err, tokens) {
                    if (err) { return handleError(res, err); }

                    else {
                        console.log("shared file entry deleted from database");
                    }
                });
                setTimeout(function () {
                    console.log("File deleted successfully from dropbox..!!!!");
                }, 1000)
            })
            .catch(function (err) {
                console.log("error while deleting file from dropbox");
            })
    }, 1000);
});


//...............................//....................................//.........................


//Search for files

router.get('/search', (req, res) => {
    var user_id = req.query.user_id;
    var searchValue = req.query.searchValue;
    console.log(searchValue);
    var token = new String();
    Model_Token.findOne({ user_id: user_id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            token = tokens.access_token;
        }
        else {
            return;
        }
    });
    setTimeout(function () {
        var dbx = new Dropbox({ accessToken: token.toString() });
        dbx.filesSearch({ path: '', query: searchValue }).then((response) => {
            //    console.log("search");
            //    console.log(response);
            res.json(response);
        })
            .catch((error) => {
                console, log("error");
            })
    }, 1000);

})
router.get('/file', (req, res) => {
    console.log("hello in file");
    var name = "Demo.java";
    res.setHeader('Content-disposition', 'attachment; filename=' + name);
    res.setHeader('Content-type', "image/jpeg");
    res.download('./uploads/cloud.jpg');
    // fs.readFile(path.join("./uploads/", name), 'utf8', function (err, contents) {
    //     if (err) {
    //         console.log('Error: ', err);
    //     }
    //     var b = new Blob(contents);
    //     res.json({file : contents,name : name});
    // })
});

//........#######################################################################...............

//create folder ............

router.post('/createFolder', (req, res) => {
    var user_id = req.body.user_id;
    var newPath = req.body.path;
    var folderName = req.body.folderName;
    var token = new String();
    Model_Token.findOne({ user_id: user_id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            token = tokens.access_token;
        }
        else {
            return;
        }
    });
    setTimeout(function () {
        var dbx = new Dropbox({ accessToken: token.toString() });
        dbx.filesCreateFolder({ path: newPath + "/" + folderName }).then((response) => {
            console.log("folder created successfully");
        })
            .catch((error) => {
                console.log("folder not created error occured");
            })

    }, 1000);
});




module.exports = router;
module.exports.router = router;