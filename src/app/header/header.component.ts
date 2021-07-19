import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faSearch, faUserCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogged = false;
  loginForm!: FormGroup;
  userIcon = faUserCircle;
  searchIcon = faSearch;

  loginError: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
    this.isLogged = this.authService.isLogged;
    this.authService.userChanges.subscribe(() => {
      this.isLogged = this.authService.isLogged;
    });
  }

  login() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((resData) => {
        this.isLogged = true;
        this.loginError = false;
        console.log('login ok');
      },
        (error: string) => {
        this.loginError = true;
        console.log(error);
      });
    this.loginForm.reset();
  }

  logout() {
    this.authService.logout();
  }
}
