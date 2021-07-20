import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {faCheck, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { CookieService } from 'ngx-cookie-service';
import {DataService, Result} from '../data.service';
import {Subject, Subscription} from "rxjs";

interface CheckBox {
  name: string, value: string, checked: boolean
}

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
  researches: Result[] = [];
  checkBox: CheckBox[] = []
  private checkBoxSub = new Subject<CheckBox[]>();
  editMode = false;

  constructor(private authService: AuthenticationService, private cookieService: CookieService, private dataService: DataService) { }

  ngOnInit(): void {
    this.initForm();
    this.onGetResearches();
  }

  private initForm() {
    this.checkBoxSub.subscribe((checkBoxesValues: CheckBox[]) => {
      this.checkBox = checkBoxesValues;
    });
    this.addForm = new FormGroup({
      /*'id': new FormControl(null),*/
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'keys': new FormControl(null, Validators.required),
      'url': new FormControl(null, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
    });
  }

  onAddSearchItem(): void {
    const postData = {
      "titolo": this.addForm.value.title,
      "descrizione": this.addForm.value.description,
      "chiavi": this.addForm.value.keys,
      "url": this.addForm.value.url
    }
    this.dataService.addPost(postData);
    this.initForm();
    this.success();

  }

  success(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 10000);
  }

  logout() {
    this.authService.logout();
  }


  onGetResearches() {
    this.dataService.getAllResearches().subscribe((researches) => {
      this.researches = researches;
      console.log(this.researches);
      for (let i = 0; i < this.researches.length; i++) {
        this.checkBox.push({name: String(this.researches[i].id), value: String(this.researches[i].id), checked: false});
      }
    })
  }

  onSelectAll() {
    for (const c of this.checkBox){
      c.checked = true;
    }

    this.checkBoxSub.next(this.checkBox);

  }

  onToggleResearch(index: number) {
    this.checkBox[index].checked = !this.checkBox[index].checked;
  }
}
