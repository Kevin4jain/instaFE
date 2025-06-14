import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        window.alert('You are already logged in');
        this.router.navigate(['/profile']); // ✅ Redirect to profile if logged in
        return false;
      }
    }
    return true; // Allow login/signup if no token
  }
}
