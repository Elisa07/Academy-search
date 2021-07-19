import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {faTimes, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addForm!: FormGroup;
  deleteIcon = faTimesCircle;
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.addForm = new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormArray([]),
      'url': new FormControl(null, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
    });
  }

  addKeyInput(): void {
    console.log('Add key');
    (<FormArray>this.addForm.get('keys')).push(
      new FormGroup({
        'key': new FormControl(null, Validators.required)
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
    // var zio_bebbe = this.cookieService.get("userInfo");
    
    //token = prendere da zio_bebbe


    // Chiamare il server tramite il service
    // this.dataService.addPost(postData, token);

    this.initForm();
  }

  logout() {
    this.authService.logout();
  }
  get controls(): AbstractControl[]{
    return (<FormArray>this.addForm.get('keys')).controls;
  }
}
