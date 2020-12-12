import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService';
import { LogLevel, LogService } from '../services/LogService';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  InProgress:Boolean;
  constructor(private authService: AuthService, private router: Router,private toaster: LogService) {}

  ngOnInit(): void {
    if (this.authService.IsAuthenticated) {
      this.router.navigate(["/home"]);
    }
  }

  onSubmit() {
    var userData = {
      UserName: this.userName,
      Password: this.password,
    };
    this.InProgress = true;
    this.authService.Login(
      userData,
      resp => {
        this.router.navigate(['/home']);
        this.toaster.pop(LogLevel.Info, "Welcome");
        this.InProgress = false;
      },
      error => {
      console.log("🚀 ~ file: login.component.ts ~ line 34 ~ LoginComponent ~ onSubmit ~ error", error)
        this.toaster.pop(LogLevel.Error, error.error.message);
        this.InProgress = false;
      }
    );
  }
}
