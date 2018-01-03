import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DropboxService } from '../../services/dropbox.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-addcloud',
  templateUrl: './addcloud.component.html',
  styleUrls: ['./addcloud.component.css']
})
export class AddcloudComponent implements OnInit {
  public isCollapsed = false;
  
  constructor( private authService: AuthService,private dropboxService : DropboxService) { }

  ngOnInit() {

    // check which clouds are added
  }
AuthorizeDropbox(){

  console.log("in dropboxAuthorize");
  var user = JSON.parse(localStorage.getItem("user"));
  console.log("hello = "+this.dropboxService.AuthorizeDropbox(user.id));
  
}
addCloud(){
  console.log("calling comp");
  window.location.replace('https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=549192817551-42v97h40q0f48rcqd545eq2f6gknbvs4.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Ftoken');
   // this.testService.addCloud();
  
  
  console.log("Return");
  
}



}
