import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { RequestOptions, Http, Headers } from '@angular/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url:'http://localhost:8080/drive/upload'});
  
  message : String;
  constructor(private http : Http) { }

  ngOnInit() {
  }
  fileChange(event) {
    var user = JSON.parse(localStorage.getItem("user"));
    //console.log(user.id);
    console.log("inside change");
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        let headers = new Headers();
        console.log("inside change"+file.name);
        /** No need to include Content-Type in Angular 4 */
        headers.append('enctype', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.post(`http://localhost:8080/drive/upload/?id=`+user.id+'&name='+file.name, formData, options)
            .map(res => res.json())
            .subscribe(
              data => {console.log('success')},
              error => console.log(error)
          )
            
    }
}

    
}
