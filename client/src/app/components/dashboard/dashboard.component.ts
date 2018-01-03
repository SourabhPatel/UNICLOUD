import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DriveService } from '../../services/drive.service';
import { DropboxService } from '../../services/dropbox.service';
import { ShareService } from '../../services/share.service';
import { RequestOptions, Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { saveAs } from 'file-saver/FileSaver';
declare var upload: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sFile: any;
  files: Files[];
  dropboxFiles: dropboxFile[];
  folderFiles: any;
  path: string;
  message: String;
  folderName: string;
  hide: boolean;
  driveIndex: number;
  drivePath: driveStack[];
  DPath: string;
  DfolderName: string;
  Dhide: boolean;
  SDhide: boolean;
  SDDhide: boolean;

  DriveEmail: string;
  DropboxEmail: string;
  constructor(private shareFileService: ShareService, private http: Http, private authService: AuthService, private router: Router, private driveService: DriveService, private dropboxService: DropboxService) {
    this.path = "Dropbox";
    this.hide = false;
    this.Dhide = false;
    this.SDhide = false;
    this.SDDhide = false;

  }

  ngOnInit() {
    console.log(window.location.href);
    var user = JSON.parse(localStorage.getItem("user"));
    this.getFilesDrive(user);
    this.getFilesDropbox(user, "");


  }
  getFilesDrive(user) {
    this.driveService.getFiles(user.id).subscribe((files) => {
      //
      this.files = files;
      this.driveIndex = 0;
      this.drivePath = new Array(100);
      // let drivePath = [];
      this.drivePath[this.driveIndex] = new driveStack("Drive", this.files[0].parents[0]);
      // this.drivePath[this.driveIndex].name="Home";
      // this.drivePath[this.driveIndex].id=this.files[0].parents[0];
      //console.log(this.drivePath[this.driveIndex].id);
      this.DPath = "Drive";
    });
  }
  getFilesDropbox(user, path) {
    this.dropboxService.getFiles(user.id, path).subscribe((dropboxFiles) => {
      console.log("get files....");
      this.dropboxFiles = dropboxFiles.entries;
      this.path = this.path + "";
      console.log(this.dropboxFiles);
    });


  }
  showMessage(p) {
    console.log(p);
  }
  downloadfromDropbox(path) {
    localStorage.setItem("path", path);
    console.log("downloading " + path);
  }
  shareDropbox(id) {
    console.log("sharing " + id);

  }
  removeFromDropbox(path) {
    var user = JSON.parse(localStorage.getItem("user"));
    this.dropboxService.removeFromDropbox(user, path);
    var t = this.path;
    var newPath = t.substr(7, t.length);

    console.log("pathh = " + newPath);
    setTimeout(this.getFilesDropbox(user, newPath), 30000);
    console.log("file deleted successfully");

  }
  removeFromDrive(id) {
    var user = JSON.parse(localStorage.getItem("user"));
    this.driveService.remove(user.id, id);
  }

  DriveDownload(file) {
    this.driveService.DriveDownload(file);

  }
  isFolder(file) {
    if (file[".tag"] == "folder")
      return true;
    return false;
  }
  openFolder(file) {
    if (this.isFolder(file)) {
      var user = JSON.parse(localStorage.getItem("user"));
      //    console.log("pat = " + file.path_display);
      this.dropboxService.getFiles(user.id, file.path_display).subscribe((files) => {
        this.dropboxFiles = files.entries;
        this.path = "Dropbox" + file.path_display;
      });
      console.log(this.dropboxFiles);
    }
    return;
  }
  openDriveFolder(file) {
    if (this.isDFolder(file)) {
      var user = JSON.parse(localStorage.getItem("user"));
      //    console.log("pat = " + file.path_display);
      this.driveService.getFolderFiles(user.id, file.id).subscribe((files) => {
        //
        this.files = files;
        this.driveIndex++;
        this.drivePath[this.driveIndex] = new driveStack(this.drivePath[this.driveIndex - 1].name + '/' + file.name, file.id);
        this.DPath = this.drivePath[this.driveIndex].name;

        //console.log(this.files);
      });
    }
    return;
  }
  goBack() {
    var user = JSON.parse(localStorage.getItem("user"));
    var t = this.path;
    var f = t.lastIndexOf('/');
    var newPath;
    if (f == 7) {
      newPath = '';
    }
    else
      newPath = t.substring(7, f);
    console.log("newPath = " + newPath);
    this.dropboxService.getFiles(user.id, newPath).subscribe((files) => {
      this.dropboxFiles = files.entries;
      this.path = "Dropbox" + newPath;
    });

  }
  driveBack() {
    if (this.driveIndex > 0) {
      this.driveIndex--;
      var user = JSON.parse(localStorage.getItem("user"));
      //    console.log("pat = " + file.path_display);
      this.driveService.getFolderFiles(user.id, this.drivePath[this.driveIndex].id).subscribe((files) => {
        //
        this.files = files;
        this.DPath = this.drivePath[this.driveIndex].name;
      });
    }
  }
  uploadToDropbox(event) {
    var newPath = this.getCurrentDropboxPath();
    console.log(newPath);
    console.log("upload to dropbox " + event);
    var user = JSON.parse(localStorage.getItem("user"));
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      let headers = new Headers();
      headers.append('enctype', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post(`http://localhost:8080/dropbox/upload/?id=` + user.id + '&name=' + file.name + '&path=' + newPath, formData, options)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log('success');
          setTimeout(() => {
            this.message = "";
            this.getFilesDropbox(user, newPath);


          }, 7400);


        },
        error => console.log(error)
        )

    }
  }
  createDropboxFolder() {
    this.hide = false;
    var newPath;
    var p = this.path;
    if (p == "Dropbox")
      newPath = "";
    else {
      newPath = p.substring(7, p.length);
    }
    console.log(newPath);
    console.log("name = " + this.folderName);
    var user = JSON.parse(localStorage.getItem("user"));
    this.dropboxService.createDropboxFolder(user.id, newPath, this.folderName);
    setTimeout(this.getFilesDropbox(user, newPath), 20000);

  }
  createDriveFolder() {
    console.log("folder create");
    this.Dhide = false;
    var user = JSON.parse(localStorage.getItem("user"));
    this.driveService.createFolder(user.id, this.DfolderName, this.drivePath[this.driveIndex].id);
  }

  refreshDropbox() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.getFilesDropbox(user, this.getCurrentDropboxPath());
  }
  getCurrentDropboxPath() {
    return this.dropboxService.getCurrentDropboxPath(this.path);
  }

  fileChange(event) {
    var user = JSON.parse(localStorage.getItem("user"));
    //console.log(user.id);
    console.log("inside change");
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      let headers = new Headers();
      console.log("inside change" + file.name);
      /** No need to include Content-Type in Angular 4 */
      headers.append('enctype', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post(`http://localhost:8080/drive/upload/?id=` + user.id + '&name=' + file.name + '&fid=' + this.drivePath[this.driveIndex].id, formData, options)
        .map(res => res.json())
        .subscribe(
        data => { console.log('success') },
        error => console.log(error)
        )

    }
  }
  isDFolder(file) {
    if (file.mimeType.substring(file.mimeType.lastIndexOf('.') + 1, file.mimeType.length) == "folder")
      return true;
    return false;
  }
  refreshDrive() {
    var user = JSON.parse(localStorage.getItem("user"));
    //console.log(this.files[0].parents[0]);
    // this.getFilesDrive(user);
    this.driveService.getFolderFiles(user.id, this.drivePath[this.driveIndex].id).subscribe((files) => {
      //
      this.files = files;
      //console.log(this.files);
    });
  }
  shareDriveFile() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.SDhide = false;
    console.log(this.sFile);
    console.log(this.DriveEmail);
    this.shareFileService.shareFile(user.id, "drive", this.sFile, this.DriveEmail);
    this.DriveEmail = "";
    //  this.shareFileService.shareFile();
  }
  shareDropboxFile() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.SDDhide = false;
    console.log(this.sFile);
    console.log(this.DropboxEmail);
    this.shareFileService.shareFile(user.id, "dropbox", this.sFile, this.DropboxEmail);
    this.DropboxEmail = "";

  }
  dummy1(file) {
    this.sFile = file;
    this.SDhide = true;
  }
  dummy2(file) {
    this.sFile = file;
    this.SDDhide = true;
  }

}
// Authorize(){
//   console.log("hello = "+this.authService.AuthorizeDropbox());

// }


interface Files {
  id: string
  name: string,
  mimeType: string,
  modifiedTime: string,
  size: string,
  parents: string[]
}
interface dropboxFile {
  id: string,
  type: string,
  size: number
}
class driveStack {
  name: string;
  id: string;
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}