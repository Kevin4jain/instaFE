import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import User from '../../Types/User';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-userslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userslist.component.html',
  styleUrl: './userslist.component.css'
})
export class UserslistComponent implements OnInit {
  snackBar=inject(MatSnackBar)
  constructor(private user:UserService) { }
  Users:User[]=[];
  private router=inject(Router)
  ngOnInit() {
    this.user.getUser().subscribe(
      (data) => {  
        this.Users = data;  
      },
    (error) => {  
         
    if(typeof window !== "undefined")
      window.alert("Unauthorized Access: " + error.error.error);
          this.router.navigate(["/home"]);
        
      
    });
    
  }
  
}