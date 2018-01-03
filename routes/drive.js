const express = require('express');
const router = express.Router();
const Token = require('../models/token');
var contentDisposition = require('content-disposition')
var fs = require('fs');
var multer = require('multer');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const User = require('../models/user');
const shareModel = require('../models/sharefile');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
  "Py7wPKdOIBvgUb0l8WcIs4fj",
  "http://localhost:4200/token"
);

// set auth as a global default
google.options({
  auth: oauth2Client
});

router.get('/getUrl', (req, res, next) => {
  console.log('sdgj');
  var scopes = [
    'https://www.googleapis.com/auth/drive'
  ];

  var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes,

    // Optional property that passes state parameters to redirect URI
    // state: 'foo'
  });
  console.log("this  " + url);
});

//add contact

router.get('/generator/', (req, res, next) => {
  console.log(req.query.code);
  console.log(req.query.id);

  //console.log(Token.email);


  oauth2Client.getToken(req.query.code, function (err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    console.log(token.access_token);
    console.log(token.refresh_token);
    let newToken = new Token({
      email: req.query.id,
      accessKey: token.access_token,
      refreshKey: token.refresh_token
    });
    newToken.save((err, token) => {
      if (err) {
        res.json({ msg: 'Failed to add' + err });
      }
      else {
        res.redirect('http://localhost:4200/dashboard');
      }
    });
  });


});
/**
* Lists the names and IDs of up to 10 files.
*
* @param {google.auth.OAuth2} auth An authorized OAuth2 client.
*/
router.get('/getFiles/', (req, res, next) => {
  console.log(req.query.id);
  //var tokens = getToken();
  var access = new String();
  var ref = new String();
  Token.findOne({ email: req.query.id }, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens) {
      console.log(tokens.accessKey);
      access = tokens.accessKey;
      ref = tokens.refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    //  console.log('hello world!');

    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:4200/token"
    );
    // console.log('hello baby'+access);
    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });
    var drive = google.drive({ version: 'v3', });
    // console.log("fdvhjs");
    drive.files.list({
      q: "'root' in parents",
      auth: oauth2Client,
      pageSize: 10,
      fields: "nextPageToken, files(id, name,size,modifiedTime,mimeType,parents)"
    }, function (err, response) {
      if (err) {
        //   console.log('The API returned an error: ' + err);
        return;
      }
      var files = response.files;
      if (files.length == 0) {
        console.log('No files found.');
      } else {
        //    console.log('Files:');
        return res.json(files);
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          //      console.log('%s (%s)', file.name, file.id);
        }
      }
    });
  }, 3000);
});
//#####################################################################33


function Gupload(name, id, fid) {
  var access = new String();
  var ref = new String();
  Token.find(id, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens[0]) {
      console.log(tokens[0].accessKey);
      access = tokens[0].accessKey;
      ref = tokens[0].refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:8080/api/generator"
    );
    console.log("making upload");

    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });

    var drive = google.drive({ version: 'v3', auth: oauth2Client });

    var fileMetadata = {
      'name': name,
      parents: [fid]
    };
    var media = {
      mimeType: 'multipart/related',
      body: fs.createReadStream('./uploads/' + name)
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.id);
      }

    });
  }, 3000);

}


//---------------------------------------------------------------------------------------------------
var storage = multer.diskStorage({ //multers disk storage settings

  destination: function (req, file, cb) {

    cb(null, './uploads/');

  },

  filename: function (req, file, cb) {

    var datetimestamp = Date.now();

    cb(null, req.query.name);

  }

});



var upload = multer({ //multer settings

  storage: storage

}).single('uploadFile');



/** API path that will upload the files */

router.post('/upload/', function (req, res) {


  upload(req, res, function (err) {

    console.log(req.file);
    console.log(err);
    Gupload(req.query.name, req.query.id, req.query.fid);
    if (err) {

      res.json({ error_code: 1, err_desc: err });

      return;

    }

    res.json({ error_code: 0, err_desc: null });

  });

});
//##############################################################################################################
//Download files
function GDownload(user_id, file_id, file_name) {
  var access = new String();
  var ref = new String();
  Token.find(user_id, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens[0]) {
      console.log(tokens[0].accessKey);
      access = tokens[0].accessKey;
      ref = tokens[0].refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:8080/api/generator"
    );
    console.log("Downloading");

    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });

    var drive = google.drive({ version: 'v3', auth: oauth2Client });
    var fileId = file_id;
    var dest = fs.createWriteStream('./downloads/' + file_name);
    drive.files.get({
      fileId: fileId,
      alt: 'media'
    })
      .on('end', function () {
        console.log('Done');
      })
      .on('error', function (err) {
        console.log('Error during download', err);
      })
      .pipe(dest);
  }, 3000);
}

router.get('/download/', function (req, res) {

  GDownload(req.query.id, req.query.f_id, req.query.f_name);
  setTimeout(function () {
    var filename = req.query.f_name;
    console.log(filename);
    var filePath = './downloads/' + filename;
    var fileToSend = fs.readFileSync(filePath);
    var stat = fs.statSync(filePath);
    var mime = require('mime');
    var mimetype = mime.lookup(filePath);
    res.setHeader('Content-type', mimetype);
    res.set('Access-Control-Expose-Headers', 'Content-Disposition');
    res.set('Content-Length', stat.size);
    res.setHeader('Content-Disposition', contentDisposition(filename));
    res.send(fileToSend);

  }, 10000);

});
//##############################################################################################################
//Download files
function GDelete(user_id, file_id) {
  var access = new String();
  var ref = new String();
  var id = user_id;
  console.log(id);
  console.log("Delete1");
  Token.find(id, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens[0]) {
      console.log(tokens[0].accessKey);
      console.log(tokens[0].refreshKey);
      access = tokens[0].accessKey;
      ref = tokens[0].refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    console.log("Delete2");
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlReq = new XMLHttpRequest();
    xmlReq.open('DELETE', 'https://www.googleapis.com/drive/v2/files/' + file_id + '?key=AIzaSyBxFkx-TYvGZSoLH0TOtWHmL2zdb_FBNXM',false);
    xmlReq.setRequestHeader('Authorization', 'Bearer ' + access);
    xmlReq.send();
    shareModel.remove({"file.id" : file_id} , function (err, tokens) {
      if (err) { return handleError(res, err); }
     
      else {
          console.log("shared file entry deleted from database");
      }
  });

    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });

  }, 3000);
}

router.get('/delete/', function (req, res) {
  console.log("called delete");
  GDelete(req.query.id, req.query.f_id);
});

//#####################################################################################################################################################################
//Search for files
router.get('/searchFiles/', (req, response, next) => {
  var access = new String();
  var ref = new String();
  Token.find(req.query.id, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens[0]) {
      console.log(tokens[0].accessKey);
      access = tokens[0].accessKey;
      ref = tokens[0].refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:8080/api/generator"
    );
    //console.log("making upload");

    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });

    var drive = google.drive({ version: 'v3', auth: oauth2Client });
    var pageToken = null;
    // Using the NPM module 'async'

    drive.files.list({
      q: 'name contains "' + req.query.key + '"',
      fields: 'nextPageToken, files(id, name,size,modifiedTime,mimeType,parents)',
      spaces: 'drive'
      //    pageToken: pageToken
    }, function (err, res) {
      if (err) {
        // Handle error
        console.error("errorrrrrrrrr.............");

        console.error(err);

      } else {
        res.files.forEach(function (file) {
          console.log('Found file: ', file.name, file.id);
        });

        pageToken = res.nextPageToken;
        response.json(res.files);
      }
    });
  }, 3000);
});

//#############################################################################################################################33
//getting token
router.get('/getToken/', (req, res, next) => {
  console.log(req.query.id);
  //var tokens = getToken();
  var access = new String();
  var ref = new String();
  Token.findOne({ email: req.query.id }, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens) {
      console.log(tokens.accessKey);
      access = tokens.accessKey;
      ref = tokens.refreshKey;
      res.json({ access: access });
      return;
    }
    else {
      return;
    }

  });
});
//#####################################################################################################################################################################
//Open Folder
router.get('/Openfolder/', (req, res, next) => {
  console.log(req.query.id);
  console.log(req.query.fid);
  //var tokens = getToken();
  var access = new String();
  var ref = new String();
  Token.findOne({ email: req.query.id }, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens) {
      console.log(tokens.accessKey);
      access = tokens.accessKey;
      ref = tokens.refreshKey;
    }
    else {
      return;
    }
  });

  setTimeout(function () {
    //  console.log('hello world!');

    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:4200/token"
    );
    // console.log('hello baby'+access);
    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });
    var pageToken = null;
    // Using the NPM module 'async'
    var drive = google.drive({ version: 'v3', auth: oauth2Client });

    drive.files.list({
      q: "'" + req.query.fid + "' in parents",
      fields: 'nextPageToken, files(id, name,size,modifiedTime,mimeType,parents)',
      spaces: 'drive',
      pageToken: pageToken
    }, function (err, response) {
      if (err) {
        // Handle error
        console.error(err);

      } else {
        response.files.forEach(function (file) {
          console.log('Found file: ', file.name, file.id, file.parents[0]);
        });
        pageToken = response.nextPageToken;
        return res.json(response.files);
      }
    });

  }, 3000);
});

//###################################################################################################3
//create a folder

router.get('/createFolder/', (req, response, next) => {
  console.log("Creating Folder" + req.query.name);
  var access = new String();
  var ref = new String();
  Token.find(req.query.id, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens[0]) {
      console.log(tokens[0].accessKey);
      access = tokens[0].accessKey;
      ref = tokens[0].refreshKey;
    }
    else {
      return;
    }
  });
  setTimeout(function () {
    var oauth2Client = new OAuth2(
      "549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com",
      "Py7wPKdOIBvgUb0l8WcIs4fj",
      "http://localhost:8080/api/generator"
    );
    console.log("making upload");

    oauth2Client.setCredentials({
      access_token: access,
      refresh_token: ref
    });

    var drive = google.drive({ version: 'v3', auth: oauth2Client });

    var fileMetadata = {
      'name': req.query.name,
      'mimeType': 'application/vnd.google-apps.folder',
      parents: [req.query.parent]
    };
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Folder Id: ', file.id);
      }
    });

  }, 3000);

});

router.get('/shareDownload/', (req, res) => {
  var id;
  User.findOne({ email: req.query.email }, function (err, tokens) {
    if (err) { return handleError(res, err); }
    if (tokens) {
      id = tokens._id;

    }
    else {
      return;
    }
    if (!tokens) return;
  });
  setTimeout(function () {
    GDownload(id, req.query.f_id, req.query.f_name);
    setTimeout(function () {
      var filename = req.query.f_name;
      console.log(filename);
      var filePath = './downloads/' + filename;
      var fileToSend = fs.readFileSync(filePath);
      var stat = fs.statSync(filePath);
      var mime = require('mime');
      var mimetype = mime.lookup(filePath);
      res.setHeader('Content-type', mimetype);
      res.set('Access-Control-Expose-Headers', 'Content-Disposition');
      res.set('Content-Length', stat.size);
      res.setHeader('Content-Disposition', contentDisposition(filename));
      res.send(fileToSend);

    }, 1000);
  }, 1000);
})

module.exports.router = router;
