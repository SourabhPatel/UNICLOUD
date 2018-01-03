import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  token: string;
  constructor(private http: Http) { }
  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/register', user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/authenticate', user, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    console.log('in get profile ');
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const u1 = localStorage.getItem('user');
    this.user = u1;
    const j1 = JSON.parse(u1);
    const id = j1.id;
    console.log(j1.id);
    return this.http.get('http://localhost:8080/users/profile/' + id, { headers: headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('Storage', localStorage.getItem('id_token'));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
 
  StoreGToken(access_token, user_id) {
    console.log("in authorize");
    const headers = new Headers();
    this.http.get('http://localhost:8080/drive/generator/?code='+access_token+'&id='+user_id).subscribe();
  }
}
