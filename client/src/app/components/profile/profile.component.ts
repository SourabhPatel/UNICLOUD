import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { User } from '../../user';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  constructor(
  private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(user => 
      this.user = user);
  console.log(this.user.email);
  }

}
