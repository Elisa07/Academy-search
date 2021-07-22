import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faSearch, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import { Router} from "@angular/router";
import { DataService } from '../services/data.service';

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
  isVisible = false;

  loginError: boolean = false;
  logginErrorMessage!: string;

  constructor(private authService: AuthenticationService, private router: Router, private dataService: DataService) { }

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
      },
        (error: string) => {
        this.loginError = true;
        this.logginErrorMessage = error;
        // console.log(error);
      });
    this.loginForm.reset();
    this.timeSpinner();
  }

  logout() {
    this.authService.logout();
    this.timeSpinner();
  }

  timeSpinner(): void {
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 700);
  }

  refreshPage() {
    this.dataService.resultsForPagination = [];
  }

}
