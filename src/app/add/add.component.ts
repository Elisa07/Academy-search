import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {faCheck, faCheckSquare, faEdit, faTimesCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faSquare} from "@fortawesome/free-regular-svg-icons";
import {CookieService} from 'ngx-cookie-service';
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";

import {DataService, Result} from '../services/data.service';

interface CheckBox {
  name: string, value: string, checked: boolean
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [NgbNavConfig]
})
export class AddComponent implements OnInit {

  addForm!: FormGroup;
  trashIcon = faTrash;
  check = faCheck;
  editIcon = faEdit;
  checkSquareIcon = faCheckSquare;
  unCheckSquareIcon = faSquare;
  isVisible = false;
  researches: Result[] = [];
  checkBox: CheckBox[] = []
  editMode = false;
  allSelected = false;

  selectedNumber = 0;

  lastAccess!: string;

  constructor(private authService: AuthenticationService,
              private cookieService: CookieService,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
    this.onGetResearches();
    if (this.authService.userInfo?.refreshTokenExpireIn) {
      const lastAccessDate = new Date(this.authService.userInfo.refreshTokenExpireIn - 32400000);
      this.lastAccess = lastAccessDate.toLocaleString();
    }
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
    this.dataService.addPost(postData).subscribe((resData: { titolo: string, descrizione: string, chiavi: string, url: string, id: number }) => {
      this.onGetResearches();
      this.initForm();
      this.success();
    });

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


  onGetResearches() {
    this.dataService.getAllResearches().subscribe((researches) => {
      this.researches = researches;
      this.checkBox = [];
      for (let i = 0; i < this.researches.length; i++) {
        this.checkBox.push({name: String(this.researches[i].id), value: String(this.researches[i].id), checked: false});
      }
      this.selectedNumber = 0;
    })
  }

  onToggleSelection() {
    if (!this.allSelected) {
      for (const c of this.checkBox) {
        c.checked = true;
        this.selectedNumber = this.researches.length;
      }
    }
    else {
      for (const c of this.checkBox) {
        c.checked = false;
        this.selectedNumber = 0;
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

  onDeleteSearch(id: number) {
    this.dataService.deleteResearch(id).subscribe(() => {
      this.router.navigate(['admin']);
      this.onGetResearches();
    });
  }

  onToggleOne(i: number) {
    if (this.checkBox[i].checked) {
      this.selectedNumber++;
      if (this.selectedNumber === this.researches.length)
        this.allSelected = true;
    }
    else {
      this.selectedNumber--;
      this.allSelected = false;
    }
  }
}
