import { Component, OnInit } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { DriveService } from '../../services/drive.service';
import { DropboxService } from '../../services/dropbox.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  files : any;
  files1 : any;
  files2 : any;
  constructor(private http: Http, private router: Router, private driveService: DriveService, private dropboxService: DropboxService) { }

  ngOnInit() {
  this.SearchFile();
  }
SearchFile(){
  var searchValue = localStorage.getItem("searchValue");
  var user = JSON.parse(localStorage.getItem("user"));  
  console.log("value = "+searchValue);
  this.http.get('http://localhost:8080/dropbox/search?user_id='+user.id+'&searchValue='+searchValue).subscribe((files)=>{
    this.files =  JSON.parse(files['_body']);
    console.log(this.files.matches);
    this.files1 = this.files.matches;

}

  );
  this.http.get('http://localhost:8080/drive/searchFiles?id='+user.id+'&key='+searchValue).subscribe((files)=>{
    this.files2 =  JSON.parse(files['_body']);
    console.log(this.files2);
}

  );

  }
  isFolder(file) {
    if (file['metadata'][".tag"] == "folder")
      return true;
    return false;
  }
  isDFolder(file){
    if(file.mimeType.substring(file.mimeType.lastIndexOf('.')+1,file.mimeType.length)=="folder")
      return true;
    return false;  
  }
  removeFromDropbox(path) {
  //  console.log(path);
    var user = JSON.parse(localStorage.getItem("user"));
    this.dropboxService.removeFromDropbox(user.id, path);
       setTimeout(this.SearchFile(), 30000);
    console.log("file deleted successfully");

  }
  DriveDownload(file) {
    this.driveService.DriveDownload(file);

  }
  removeFromDrive(id){
    var user = JSON.parse(localStorage.getItem("user"));
    this.driveService.remove(user.id,id);
  }

}
