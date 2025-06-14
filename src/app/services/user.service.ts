import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import completeUser from '../Types/completeUser';
import User from '../Types/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'http://localhost:2300';
  // private API_URL = 'https://innovatemr-internship-tasks.onrender.com';

  
  constructor(private http: HttpClient, @Inject(CookieService) private cookie: CookieService) { }
  
  
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return headers;
  }
  
getToken(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token');  // Read the real JWT token
  }
  return null;
}



setLoginState(isLoggedIn: boolean) {
    if(typeof window !== 'undefined' && window.localStorage) 
  localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
}

  
  
  isLoggedIn(): boolean {
    try {
        let token: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token');}
    return token ? true : false;
      
    } catch (error) {
      return false;
    }
  }

  loginuser(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, user,{headers:this.getHeaders(),withCredentials:true});
  }

  logoutuser(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/logout`,{headers:this.getHeaders(),withCredentials:true}).pipe(
      catchError((error) => {
        console.error("Logout error:", error);
        return throwError(error);
      })
    );
  } 

  unfoll(email: string) {
    return this.http.get<any>(`${this.API_URL}/req/unfollow/${email}`,{headers:this.getHeaders(),withCredentials:true});
  }

  userprofile() {
    // console.log('==========', this.header_options);
    
    return this.http.get<completeUser>(`${environment.API_URL}/profile`, {headers:this.getHeaders(),withCredentials:true});
  }

  removefoll(email: string) {
    return this.http.get<any>(`${this.API_URL}/req/removefollower/${email}`, {headers:this.getHeaders(),withCredentials:true});
  }

  getUser() {
    return this.http.get<User[]>(`${this.API_URL}/user`, {headers:this.getHeaders(),withCredentials:true});
  }

  getuserbyemail(email: string) { 
    return this.http.get<User>(`${this.API_URL}/userr/${email}`, {headers:this.getHeaders(),withCredentials:true});
  } 

  getuserbyid(_id: string) {
    return this.http.get<User>(`${this.API_URL}/userbyid/${_id}`,{headers:this.getHeaders(),withCredentials:true});
  }

  getAll() {
    return this.http.get<User[]>(`${this.API_URL}/userdata`, {headers:this.getHeaders(),withCredentials:true});
  }

  registeruser(user: any) {
    return this.http.post(`${this.API_URL}/signup`, user, {headers:this.getHeaders(),withCredentials:true});
  }

  register(user: any) {
    return this.http.post(`${this.API_URL}/verifyotp`, user , {headers:this.getHeaders(),withCredentials:true});
  }

  resendotp(user: any) {
    return this.http.post(`${this.API_URL}/resendotp`, user , {headers:this.getHeaders(),withCredentials:true});
  }

  sendreq(email: string) {
    return this.http.get<any>(`${this.API_URL}/req/${email}`, {headers:this.getHeaders(),withCredentials:true});
  }

  getallreqs() {
    return this.http.get<User[]>('http://localhost:2300/getallreq', {headers:this.getHeaders(),withCredentials:true});
  }
  updatestatus(status: string, email: string) {
    return this.http.get<any>(`${this.API_URL}/response/${status}/${email}`,{headers:this.getHeaders(),withCredentials:true});
  }
}
