import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
declare var Dropbox : any;

@Injectable()
export class DropboxService {

  constructor(private http: Http) { }

  AuthorizeDropbox(user_id) {

    location.assign('http://localhost:8080/dropbox/token/' + user_id);
  }
  StoreDropboxToken(access_token, user_id) {
    console.log("in authorize");
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:8080/dropbox/storeToken', { user_id: user_id, access_token: access_token }, { headers: headers }).subscribe();
  }
  getFiles(user_id, path) {
    console.log("in get files");
    return this.http.get('http://localhost:8080/dropbox/getAllFiles?user_id=' + user_id + '&path=' + path).map(res => res.json());
  }

  removeFromDropbox(user, path) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.delete('http://localhost:8080/dropbox/deleteFile?id=' + user.id + '&path=' + path+"&email="+user.email).subscribe();
  }
  createDropboxFolder(user_id, path, folderName) {
    this.http.post('http://localhost:8080/dropbox/createFolder', { user_id: user_id, path: path, folderName: folderName }).subscribe();

  }
  getCurrentDropboxPath(path) {
    var newPath;
    var p = path;
    if (p == "Dropbox")
      newPath = "";
    else {
      newPath = p.substring(7, p.length);
    }
    return newPath;
  }
  dropboxDownload(file) {
    var path = file.file.path; 
    console.log("path = " + path);
    var token = getToken();
    console.log("token = "+token);
    if(token=="null") {
      console.log("invalid credentials ..");
      token = getTokenByEmail(file.sharedBy);
      console.log("token = "+token);
    }
    var dbx = new Dropbox({ accessToken: token });
    //var path = $('#get-file').val();
    dbx.filesDownload({ path: path }).then(function (res) {
      console.log(res); 
      var downloadUrl = URL.createObjectURL(res.fileBlob);
      console.log("url = " + downloadUrl);
      console.log( res.fileBlob);
      var filename = res.name;
      var type = res.fileBlob.type;
      var element = document.createElement('a');
      element.setAttribute('href', downloadUrl);
      element.setAttribute('data', type);
      element.setAttribute('class', 'button');
      element.setAttribute('download', filename);
     // document.getElementById('down').appendChild(element);
  
      element.style.display = 'none';
      document.body.appendChild(element);
  
      element.click();
  
      document.body.removeChild(element);  
  
    }).catch(function (error) {
      console.log(error);
    })
  }

}