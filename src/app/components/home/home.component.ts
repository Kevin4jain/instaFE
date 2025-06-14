import { Component, inject, OnInit } from '@angular/core';
import User from '../../Types/User';
import { UserService } from '../../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import completeUser from '../../Types/completeUser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sbn = "";
  me: completeUser = {} as completeUser;
  following: string[] = [];
  router = inject(Router);
  DATA: User[] = [];
  userservice = inject(UserService);
  filteredUsers: User[] = [];
  filterType: 'all' | 'following' | 'others' = 'all'; // new filter variable

  ngOnInit(): void {
    this.myfun();
    this.getProf();
  }

  applyFilter() {
    this.filteredUsers = this.DATA.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.sbn.toLowerCase());

      if (this.filterType === 'following') {
        return matchesSearch && this.following.includes(user.email);
      } else if (this.filterType === 'others') {
        return matchesSearch && !this.following.includes(user.email);
      } else {
        return matchesSearch;
      }
    });
  }

  changeFilter(type: 'all' | 'following' | 'others') {
    this.filterType = type;
    this.applyFilter();
  }

  details(email: string) {
    this.router.navigate([`/details/${email}`]);
  }

  getProf() {
    this.userservice.userprofile().subscribe(d => {
      this.me = d;
      for (let f of this.me.following) {
        this.userservice.getuserbyid(f).subscribe(u => {
          this.following.push(u.email);
        });
      }
    });
  }

  followreq(email: string) {
    this.userservice.sendreq(email).subscribe(data => {
      alert(data.Failure || data.Success);
    });
  }

  unfollowreq(email: string) {
    if (confirm("Are you sure you want to unfollow this user?")) {
      this.userservice.unfoll(email).subscribe(data => {
        alert(data.Success);
        if (data.Success) {
          this.following = this.following.filter(e => e !== email);
          this.applyFilter(); // Reapply filter after unfollowing
        }
      });
    }
  }

  myfun(): void {
    this.userservice.getAll().subscribe({
      next: data => {
        this.DATA = data;
        this.applyFilter();
      },
      error: err => {
        console.error('Error fetching user data:', err);
      }
    });
  }
}
