import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { saveAs } from 'file-saver/FileSaver';
import 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class DriveService {

  constructor(private http: Http) { }
  getFiles(id) {
    console.log(id);
    return this.http.get('http://localhost:8080/drive/getFiles/?id=' + id)
      .map(res => res.json());
  }
  remove(id, f_id) {
    console.log(id);
    return this.http.get('http://localhost:8080/drive/delete/?id=' + id + '&f_id=' + f_id)
      .subscribe(
      error => {
        console.log(error); //gives an object at this point
      }
      );
  }
  getFolderFiles(id, fid) {
    console.log(id);
    return this.http.get('http://localhost:8080/drive/Openfolder/?id=' + id + '&fid=' + fid)
      .map(res => res.json());
  }
  createFolder(id, name, parent) {
    console.log(name);
    this.http.get('http://localhost:8080/drive/createFolder/?id=' + id + '&name=' + name + '&parent=' + parent)
      .subscribe();
  }

  DriveDownload(file) {
    var user = JSON.parse(localStorage.getItem("user"));
    const headers = new Headers();
    headers.append('responseType', 'arraybuffer');
    this.http.get('http://localhost:8080/drive/download/?id=' + user.id + '&f_name=' + file.name + '&f_id=' + file.id, { headers: headers })
      .toPromise()
      .then(
      response => this.saveToFileSystem(response)
      );
  }
  ShareDriveDownload(file) {
    var user = JSON.parse(localStorage.getItem("user"));
    const headers = new Headers();
    headers.append('responseType', 'arraybuffer');
    this.http.get('http://localhost:8080/drive/shareDownload/?email=' + file.sharedBy + '&f_name=' + file.file.name + '&f_id=' + file.file.id, { headers: headers })
      .toPromise()
      .then(
      response => this.saveToFileSystem(response)
      );
  }
  private saveToFileSystem(response) {
    const contentDispositionHeader: string = response.headers.get('Content-disposition');
    const parts: string[] = contentDispositionHeader.split('; ');
    var filename = parts[1].split('=')[1];
    filename = filename.substring(1, filename.length - 1);
    const str: string = response._body;
    const blob = new Blob([response._body], { type: response.headers.get('content-type') });
    var u = URL.createObjectURL(blob);
    saveAs(blob, filename);
  }
}
