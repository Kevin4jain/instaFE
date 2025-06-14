import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from './app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private router: Router, private alertService: AlertService) {}

canActivate(): boolean {
  // Check if window is defined (to ensure this runs only on the browser)
  if (typeof window === 'undefined') {
    // SSR environment, skip guard or return based on server requirements
    return false;
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const token = localStorage.getItem('token');

  if (!token || isLoggedIn === 'false' || isLoggedIn === null) {
    this.alertService.setMessage('Please login first.');
    this.router.navigate(['/login']);
    return false;
  }

  if (token && this.isTokenExpired(token)) {
    this.alertService.setMessage('Session expired. Please login again.');
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }

  return true;
}

private isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    // If token is malformed or can't be decoded, treat as expired
    return true;
  }
}

}
