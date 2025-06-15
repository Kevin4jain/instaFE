import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../../services/user.service';
import completeUser from '../../Types/completeUser';
import n1 from '../../Types/n1';
import User from '../../Types/User';

@Component({ 
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent implements OnInit {
  totalfls = 0;
  totalflg = 0;
  followers: n1[] = [];
  following: string[] = [];
  myupl: any[] = [];
  followreqs: User[] = [];
  uprofile: completeUser = {} as completeUser;

  // Services
  http = inject(HttpClient);
  private userservice = inject(UserService);
  private router = inject(Router);

  // Toggles
  showFollowers = false;
  showFollowing = false;
  showUploads = false;
  showRequests = false;
  zoomImgUrl: string | null = null;

  ngOnInit(): void {
    this.getprofile();
    this.userservice.getallreqs().subscribe((d) => {
      this.followreqs = d;
    });
  }

  toggleSection(section: string) {
    this.showFollowers = section === 'followers' ? !this.showFollowers : false;
    this.showFollowing = section === 'following' ? !this.showFollowing : false;
    this.showUploads = section === 'uploads' ? !this.showUploads : false;
    this.showRequests = section === 'requests' ? !this.showRequests : false;

    if (section === 'uploads' && this.showUploads) {
      this.loadMyUploads();
    }
  }

  loadMyUploads() {
    if(this.myupl.length === 0){
      this.http.get("https://instabe-8qlv.onrender.com/myuploads", { withCredentials: true })
          .subscribe(
            response => this.myupl = response as any[],
            error => console.error("Failed to fetch posts", error)
          );
    }
  }

  zoomImage(imgUrl: string) {
    this.zoomImgUrl = imgUrl;
  }

  closeZoom() {
    this.zoomImgUrl = null;
  }

  getprofile() {
    this.userservice.userprofile().subscribe(
      val => {
        this.uprofile = val;
        this.getfollowers();
        this.getfollowing();
      },
      e => window.alert(e.error.error)
    );
  }

details(email:string){
  this.router.navigate([`/details/${email}`])
}
  removefollower(email: string) {
    if (window.confirm("Remove this follower?")) {
      this.userservice.removefoll(email).subscribe((data) => {
        if (data.Success) {
          window.alert(data.Success);
          this.followers = this.followers.filter((f) => f.email !== email);
          this.totalfls--;
        }
      });
    }
  }
  //delete post

  deletepost(id: string) {
    this.http.get(`https://instabe-8qlv.onrender.com/deletepost/${id}`, { withCredentials: true })
      .subscribe(
        response => window.alert((response as any).Success),
        error => console.error("Failed to delete post", error)
      );
  }

  getfollowing() {
    const requests = this.uprofile.following.map((a) => this.userservice.getuserbyid(a));
    forkJoin(requests).subscribe((responses) => {
      this.following = responses.map((d) => d.name);
      this.totalflg = this.following.length;
    });
  }

  getfollowers() {
    const requests = this.uprofile.followers.map((a) => this.userservice.getuserbyid(a));
    forkJoin(requests).subscribe((responses) => {
      this.followers = responses.map((d) => ({ name: d.name, email: d.email }));
      this.totalfls = this.followers.length;
    });
  }

  changestatus(status: string, email: string) {
    this.userservice.updatestatus(status, email).subscribe(() => {
      this.followreqs = this.followreqs.filter((x) => x.email !== email);
      window.alert("Status changed to " + status);
    });
  }
}
