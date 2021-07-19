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

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('user', Validators.required),
      'password': new FormControl('password', Validators.required)
    });
    this.isLogged = this.authService.isLogged;
    this.authService.userChanges.subscribe(() => {
      this.isLogged = this.authService.isLogged;
    });
  }

  login() {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
  }

  logout() {
    this.authService.logout();
  }

}
