import { Routes } from '@angular/router';
import { UserslistComponent } from './components/userslist/userslist.component';
import { UsersignupComponent } from './components/usersignup/usersignup.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { UploadComponent } from './components/upload/upload.component';
import { FeedComponent } from './components/feed/feed.component';
import { AuthGuard } from '../auth.guard';
import { LoginGuard } from '../login.guard';

export const routes: Routes = [
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "details/:email", component: DetailsComponent , canActivate: [AuthGuard] },
    { path: "list", component: UserslistComponent , canActivate: [AuthGuard] },
    { path: "signup", component: UsersignupComponent ,canActivate:[LoginGuard]},
    { path: "login", component: UserloginComponent ,canActivate:[LoginGuard]}, 
    { path: "profile", component: UserprofileComponent, canActivate: [AuthGuard] }, 
    { path: "upload", component: UploadComponent, canActivate: [AuthGuard] },
    { path: "myfeed", component: FeedComponent, canActivate: [AuthGuard] }, 
    { path: "**", component: ErrorComponent },
];

