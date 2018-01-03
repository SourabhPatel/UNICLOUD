import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { RequestOptions, Http, Headers } from '@angular/http';
import { DriveService } from '../../services/drive.service';
import { DropboxService } from '../../services/dropbox.service';
@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.component.html',
  styleUrls: ['./shared-files.component.css']
})
export class SharedFilesComponent implements OnInit {

  sharedFiles: any;
  constructor(private shareService: ShareService, private driveService: DriveService, private dropboxService: DropboxService) {

  }
  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.shareService.getSharedByMeFiles(user.id).subscribe((response) => {
      this.sharedFiles = response;
      console.log(this.sharedFiles);
    });
  }
  removeShared(file) {
    this.shareService.removeShared(file);
    }
  


}
