const express = require('express');
const router = express.Router();
const passport = require('passport');
const shareModel = require('../models/sharefile');
const User = require('../models/user');

router.post('/shareFile', (req, res) => {

    var sharedTo, sharedBy;
    var user_id = req.body.user_id;
    var cloud_name = req.body.cloud;
    var sharedFile = req.body.file;
    var sharedTo = req.body.sharedTo;
    User.findOne({ _id: user_id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            sharedBy = tokens.email;
        }
        else {
            return;
        }
        if (!tokens) return;
    });
    if (cloud_name == "dropbox") {
        file = {
            id: sharedFile.id,
            name: sharedFile.name,
            path: sharedFile.path_display,
            cloud: cloud_name
            
        }
    }
    else {
        file = {
            id: sharedFile.id,
            name: sharedFile.name,
            path: "",
            cloud: cloud_name
            
        }
    }
    setTimeout(function () {
        let shareTouple = new shareModel({
            file: file,
            sharedBy: sharedBy,
            sharedTo: sharedTo,
        })
        shareModel.addTouple(shareTouple, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("success");

            }
        })
    }, 3000);

});
// get files shared by me
router.get('/sharedByMe', (req, response) => {
    var sharedBy;
    var files;
    User.findOne({ _id: req.query.id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            sharedBy = tokens.email;

        }
        else {
            return;
        }
        if (!tokens) return;
    });
    setTimeout(function () {
        console.log(sharedBy);
        shareModel.find({ sharedBy: sharedBy }, function (err, res) {
            if (err) { return handleError(response, err); }
            if (res) {
                response.json(res);
            }
            else {
                return;
            }
        })
    }, 1000);
})


//..####################################################################.....
// get files shared to me

router.get('/sharedToMe', (req, response) => {
    var files;
    User.findOne({ _id: req.query.id }, function (err, tokens) {
        if (err) { return handleError(res, err); }
        if (tokens) {
            sharedBy = tokens.email;

        }
        else {
            return;
        }
        if (!tokens) return;
    });
    setTimeout(function () {
        console.log(sharedBy);
        shareModel.find({ sharedTo: sharedBy }, function (err, res) {
            if (err) { return handleError(response, err); }
            if (res) {
                response.json(res);
            }
            else {
                return;
            }
        })
    }, 1000);

})
router.delete('/removeShared',(req,res)=>{
    var id = req.query.id;
    shareModel.remove({ _id : id } , function (err, res) {
        if (err) { return handleError(response, err); }
        
        else {
            console.log("shared file entry removed....!!");
            return;
        }
});

});

module.exports = router;
module.exports.router = router;