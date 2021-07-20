import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {faCheck, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm!: FormGroup;
  deleteIcon = faTimesCircle;
  check = faCheck;
  isVisible = false;
  constructor(private authService: AuthenticationService, private cookieService: CookieService, private dataService: DataService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addForm = new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormControl(null, Validators.required),
      'url': new FormControl(null, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
    });
  }

  onAddSearchItem(): void {
    var postData = {
      "titolo" : "",
      "descrizione" : "",
      "chiavi" : "",
      "url" : ""
    }
    postData.titolo = (<HTMLInputElement>document.getElementById("title")).value;
    postData.descrizione = (<HTMLInputElement>document.getElementById("description")).value;
    postData.chiavi = (<HTMLInputElement>document.getElementById("keys")).value;
    postData.url = (<HTMLInputElement>document.getElementById("url")).value;
    var token = this.cookieService.get("userInfo");
    this.dataService.addPost(postData);

    this.initForm();
    this.success();

  }

  success(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 5000);
  }

  logout() {
    this.authService.logout();
  }
  get controls(): AbstractControl[]{
    return (<FormArray>this.addForm.get('keys')).controls;
  }
}
