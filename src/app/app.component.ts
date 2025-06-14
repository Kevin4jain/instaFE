import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);
  userservice = inject(UserService);
  flag = false;

  ngOnInit() {
    this.flag = this.userservice.isLoggedIn();
  }

  logout() {
    this.userservice.logoutuser().subscribe((data) => {
      if (typeof window !== "undefined") {
        window.alert(data.message);
      }
    if(typeof window !== 'undefined' && window.localStorage) 
      localStorage.removeItem("token");
      this.userservice.setLoginState(false);
      this.flag = false;
      this.router.navigate(['/login']);
    }, (e) => {
      console.log(e);
    });
  }
}
