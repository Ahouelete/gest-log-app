import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, credential } from 'src/app/services/authService';
import { GlobalService } from 'src/app/services/globalService'
import { LeftMenuComponent } from '../left-menu/left-menu.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Controller
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private fbuilder: FormBuilder,
    private globalService: GlobalService,
    private _router: Router) { }
  loginForm: FormGroup | any
  hide = true;

  ngOnInit(): void {
    if (this.getCurrentUser()) window.location.href='/dashboard'
    this.createFormLogin()
  }

  createFormLogin() {
    this.loginForm = this.fbuilder.group({
      userNameorEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signIn() {
    const credential: credential = this.loginForm.value
    this.authService.signIn(credential).subscribe({
      next: (data: any) => {
        if (data.token) {
          this.globalService.saveToken(data.token)
          window.location.href='/dashboard'
        }
      },
      error: (error: HttpErrorResponse) => {

      },
      complete: () => {
        console.log("Execution complete");
      }
    });

  }

  getCurrentUser(){
    const user = this.globalService.getCurrentUser()
    return user
  }
}
