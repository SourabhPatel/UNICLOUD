import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../user';
@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {
  
  constructor(private activatedRoute: ActivatedRoute,private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    console.log('in dummy');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let code = params['code'];
      console.log(code);
      var user = JSON.parse(localStorage.getItem("user"));
      console.log(user.id);
    this.authService.StoreGToken(code,user.id);
    });
  }

}
