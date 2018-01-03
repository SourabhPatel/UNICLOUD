import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { DriveService } from '../../services/drive.service';
import { DropboxService } from '../../services/dropbox.service';
@Component({
  selector: 'app-shared-files-to-me',
  templateUrl: './shared-files-to-me.component.html',
  styleUrls: ['./shared-files-to-me.component.css']
})
export class SharedFilesToMeComponent implements OnInit {

  sharedFiles: any;
  constructor(private shareService: ShareService, private driveService: DriveService, private dropboxService: DropboxService) {

  }
  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.shareService.getSharedToMeFiles(user.id).subscribe((response) => {
      this.sharedFiles = response;
      console.log(this.sharedFiles);
    });

  }
  downloadShared(file) {
    if (file.file.cloud == "dropbox") {
      this.dropboxService.dropboxDownload(file);
    }
    else {

      this.driveService.ShareDriveDownload(file);
    }
  }
}

