import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    standalone:true,
    imports:[CommonModule]
})
export class FeedComponent implements OnInit {
    posts: any[] = [];


    constructor(private http: HttpClient) {}        
    fullscreenImage: string | null = null;

openImage(imageUrl: string) {
  this.fullscreenImage = imageUrl;
}

closeImage() {
  this.fullscreenImage = null;
}

    ngOnInit() {
        this.http.get("http://localhost:2300/feed", { withCredentials: true })
            .subscribe(response => {
                this.posts = response as any[];
            }, error => {
                console.error("Failed to fetch posts", error);
            });
    }
}
