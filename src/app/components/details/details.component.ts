import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import User from '../../Types/User';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  posts: any[] = [];
  user: any = { name: '', email: '', age: 0, gender: '', description: '', _id: '' };
  postsFetched = false;
  showPosts = false;
  showModal = false;
  selectedImage = '';

  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  private userservice = inject(UserService);
  email: string = '';

  ngOnInit() {
    this.email = this.route.snapshot.params['email'];
    this.userservice.getuserbyemail(this.email).subscribe((data) => {
      this.user = data;
    });
  }

getposts(id: string) {
  if (!this.showPosts) { // If posts are hidden, fetch and show them
    this.http.get(`https://instabe-8qlv.onrender.com/uploads/${id}`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.err) {
            alert(response.err);
            return;
          }
          this.posts = response as any[];
          this.postsFetched = true;
          this.showPosts = true; // Show posts
        },
        error: error => {
          console.error("Failed to fetch posts", error);
          this.postsFetched = true;
        }
      });
  } else { // Already shown — hide posts
    this.showPosts = false;
  }
}



  openImage(url: string) {
    this.selectedImage = url;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
