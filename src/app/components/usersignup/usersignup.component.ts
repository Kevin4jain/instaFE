import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import User from '../../Types/User';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { error } from 'node:console';

@Component({
  selector: 'app-usersignup',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule,MatRadioModule],
  templateUrl: './usersignup.component.html',
  styleUrl: './usersignup.component.css'
})
export class UsersignupComponent {
  flag=false;
  private router=inject(Router)
  private userservice=inject(UserService)
  users:User[]=[]
  form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    age: new FormControl("",[Validators.required, Validators.min(18)]),
    gender: new FormControl( "", [Validators.required]),
    password: new FormControl( "", [Validators.required, Validators.minLength(6)]),
    description:new FormControl("",[Validators.required,Validators.minLength(20)]),
    otp:new FormControl("")
  });

  register1() {
    this.userservice.register(this.form.value).subscribe(
        (val: any) => {
            console.log(val);
            if (val.status === "Failed") {
                alert(val.message || "Error");
                return;
            }
            alert("Sign up successful!");
            this.router.navigate(['/login']);
        },
        (err: any) => {
            console.error("Signup failed:", err);
            alert("Signup failed: " + (err.error ? err.error.message : "Unknown error"));
        }
    );
}


  register() {
    if(this.form.invalid){
      
    if(typeof window !== "undefined")
      window.alert("Please fill all the details correctly!")
      return 
    }
    this.userservice.registeruser(this.form.value).subscribe((res: any) => {
    if(typeof window !== "undefined")window.alert("Please enter the otp sent to your email address")
      this.flag=true
     
      },
      (err: any) => {
        // console.error("Signup failed:", err);
    if(typeof window !== "undefined")
      window.alert("Signup failed: " + (err.error?err.error.error : "Unknown error"));
      }
    );
  }
  resendotp(){
    this.userservice.resendotp(this.form.value).subscribe((res: any) => {
      if(typeof window !== "undefined") window.alert("Please enter the otp sent to your email address")
        this.flag=true
       
        },
        (err: any) => {
          // console.error("Signup failed:", err);
      if(typeof window !== "undefined")
        window.alert("Signup failed: " + (err.error?err.error.error : "Unknown error"));
        }
  )}
}
 