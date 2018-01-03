import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap' ; 
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AddcloudComponent } from './components/addcloud/addcloud.component';
import { DummyComponent } from './dummy/dummy.component';
import { DriveService } from './services/drive.service';
import { DropboxService } from './services/dropbox.service';
import { ShareService } from './services/share.service';
import {ContextMenuModule} from 'ngx-contextmenu';
import { FanthomComponent } from './components/fanthom/fanthom.component';
import { UploadComponent } from './components/upload/upload.component';
import { SearchComponent } from './components/search/search.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { SharedFilesToMeComponent } from './components/shared-files-to-me/shared-files-to-me.component'
const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'token', component: DummyComponent},
  {path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard] },
  {path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
  {path: 'addcloud', component: AddcloudComponent , canActivate: [AuthGuard]},
  {path: 'fanthom', component: FanthomComponent , canActivate: [AuthGuard]},
  {path: 'upload', component: UploadComponent , canActivate: [AuthGuard] },
  {path: 'search', component: SearchComponent , canActivate: [AuthGuard] },
  {path: 'sharedfiles', component: SharedFilesComponent , canActivate: [AuthGuard] },
  {path: 'tome', component: SharedFilesToMeComponent , canActivate: [AuthGuard] }
  
 ];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    SidebarComponent,
    AddcloudComponent,
    DummyComponent,
    FanthomComponent,
    UploadComponent,
    FileSelectDirective,
    SearchComponent,
    SharedFilesComponent,
    SharedFilesToMeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    ContextMenuModule
  ],
  providers: [ValidateService, AuthService , AuthGuard,DriveService,DropboxService,ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
