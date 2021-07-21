import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {faCheck, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { CookieService } from 'ngx-cookie-service';
import {DataService, Result} from '../data.service';

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
  editMode = false;
  allSelected = false;

  constructor(private authService: AuthenticationService, private cookieService: CookieService, private dataService: DataService) { }

  ngOnInit(): void {
    this.initForm();
    this.onGetResearches();
  }

  private initForm() {
    this.addForm = new FormGroup({
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
    this.dataService.addPost(postData).subscribe(() => {
      this.onGetResearches();
    });
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
      this.checkBox = [];
      for (let i = 0; i < this.researches.length; i++) {
        this.checkBox.push({name: String(this.researches[i].id), value: String(this.researches[i].id), checked: false});
      }
    })
  }

  onToggleSelection() {
    if (!this.allSelected) {
      for (const c of this.checkBox) {
        c.checked = true;
      }
    }
    else {
      for (const c of this.checkBox) {
        c.checked = false;
      }
    }
    this.allSelected = !this.allSelected;
  }

  onDelete() {
    let deleteIds: number[] = [];
    for (let i = 0; i < this.checkBox.length; i++) {
      if (this.checkBox[i].checked) {
        deleteIds.push(this.researches[i].id);
      }
    }
    this.dataService.removeResearches(deleteIds)
      .subscribe(() => {
        this.onGetResearches(); // Aggiorno l'interfaccia
      });
  }

  closeEditMode() {
    this.editMode = false;
    this.resetCheckBox() // Tolgo tutti gli eventuali check selezionati
  }

  private resetCheckBox() {
    for (let i = 0; i < this.checkBox.length; i++) {
      this.checkBox[i].checked = false;
    }
  }
}
