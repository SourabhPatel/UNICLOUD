import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DropboxService } from '../../services/dropbox.service';

@Component({
  selector: 'app-fanthom',
  templateUrl: './fanthom.component.html',
  styleUrls: ['./fanthom.component.css']
})
export class FanthomComponent implements OnInit {

  constructor( private dropboxService : DropboxService) { }

  ngOnInit() {
    var code = window.location.href.split('?');
    var token = code[1].split('=');
    console.log("code = "+token[1]);
    var user = JSON.parse(localStorage.getItem("user"));
  //  console.log(user.id);
    this.dropboxService.StoreDropboxToken(token[1],user.id);
    setTimeout(function(){
      location.assign("http://localhost:4200/dashboard");
  },2000);

}
}
