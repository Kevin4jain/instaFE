import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css',
})
export class UserloginComponent {
  constructor(private alertservice: AlertService) {}
  ngOnInit(): void {
    const message = this.alertservice.getMessage();
    if (message) {
      alert(message);
      this.alertservice.setMessage('');
    }
  }
  loginform: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  private userservice = inject(UserService);
  private router = inject(Router);

  login() {
    const val = this.loginform.value;
    this.userservice.loginuser(val).subscribe(
      (res) => {
        console.log('Login Response:', res); // 🔍 check if token exists here
        if (res && res.token) {
          // avoid saving undefined
          if (typeof window !== 'undefined' && window.localStorage)
            localStorage.setItem('token', res.token);
          this.userservice.setLoginState(true);
          window.alert('Log in successful!');
          location.href = '/profile';
        } else {
          window.alert('Login failed: No token received from server!');
        }
      },
      (e) => {
        window.alert(
          'Login failed: ' + (e.error ? e.error.error : 'Unknown error')
        );
      }
    );
  }
}
