import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    // console.log(this.username);
  const user = {
    name: this.name,
    email: this.email,
    username: this.username,
    password: this.password };

    // Required fields
    if (!this.validateService.validateRegister(user)) {
      console.log('Fill all fields');
      return false;
    } else {
      console.log('sahi h sab');
    }

    // validate email

    // register user
    this.authService.registerUser(user).subscribe(data => {
    if (data.success) {
      console.log('Register success. Now login');
      this.router.navigate(['/login']);
    } else {
      console.log('Register failed hai');
      this.router.navigate(['/register']);
    }
    });
  }
}
