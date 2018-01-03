import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
declare var $:any;

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;

}
export const ROUTES: RouteInfo[] = [
  { path: 'dashboard', title: 'dashboard',  icon: 'ti-panel', class: '' },
  { path: 'addcloud', title: 'add drive or dropbox',  icon:'ti-plus', class: '' },
  { path: 'sharedfiles', title: 'Shared Files',  icon:'ti-view-list-alt', class: '' },
  { path: 'tome', title: 'To me',  icon:'ti-text', class: '' },
  { path: 'profile', title: 'Your Profile',  icon:'ti-user', class: '' },
  
];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public searchValue : string;
  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isNotMobileMenu(){
    if($(window).width() >1280){
        return false;
    }
    return true;
}
onLogoutClick() {
  this.authService.logout();

  this.router.navigate(['/login']);
  return false;
  }
  Search(){
    console.log("search... "+this.searchValue);
    localStorage.setItem("searchValue",this.searchValue);
    this.router.navigate(['/search']);
  }

}
