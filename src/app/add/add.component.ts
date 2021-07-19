import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import { DataService } from '../data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm!: FormGroup;
  postData: any; 
  constructor(private dataService: DataService, private cookieService: CookieService) { 
    this.postData = {};
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addForm = new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormArray([]),
      'url': new FormControl(null, Validators.required)
    });
  }

  addKeyInput(): void {
    console.log('Add key');
    (<FormArray>this.addForm.get('keys')).push(
      new FormGroup({
        'key': new FormControl(null)
      })
    );
  }

  removeKey(i: number): void {
    (<FormArray>this.addForm.get('keys')).removeAt(i);
  }

  onAddSearchItem(): void {
    var postData = {
      "titolo" : "",
      "descrizione" : "",
      "chiavi" : [],
      "url" : ""
    }
    postData.titolo = (<HTMLInputElement>document.getElementById("title")).value;
    postData.descrizione = (<HTMLInputElement>document.getElementById("description")).value;
    postData.url = (<HTMLInputElement>document.getElementById("url")).value;
    var zio_bebbe = this.cookieService.get("userInfo");
    
    //token = prendere da zio_bebbe


    // Chiamare il server tramite il service
    // this.dataService.addPost(postData, token);

    this.initForm();
  }

  get controls(): AbstractControl[]{
    return (<FormArray>this.addForm.get('keys')).controls;
  }
}
