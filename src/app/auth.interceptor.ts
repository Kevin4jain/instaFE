import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: string | null = null;

        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token');}

    // ✅ Skip adding token for login, signup, OTP verification and resend OTP requests
    if (req.url.includes('/login') || req.url.includes('/signup') || 
        req.url.includes('/verifyotp') || req.url.includes('/resendotp')) {
      return next.handle(req);
    }

    // ✅ If token exists, clone request and attach Authorization header
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      // ✅ If no token, proceed without modifying the request
      return next.handle(req);
    }
  }
}
