import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import {faEdit, faSearch, faTrash, faWindowClose, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: string;
  lastSearch: string = "";
  searchIcon = faSearch;
  close = faWindowClose;
  editIcon = faEdit;
  trashIcon = faTrash;
  noFound = faTimesCircle;
  page = 1;
  pageSize = 10;
  isVisible = false;
  isClicked = false;
 
  constructor(public dataService: DataService, public authService: AuthenticationService, private router: Router) {
    this.searchText = "";
    this.lastSearch = this.searchText;
  }

  ngOnInit() : void {
  }

  searchInput() {
    this.dataService.setResults(this.searchText);
    this.lastSearch = this.searchText;
    this.timeSpinner();
    this.isClicked = true;
  }

  deleteInput() {
    this.searchText = '';
  }

  deleteResearch(id: number) {
    this.dataService.deleteResearch(id).subscribe(() => {
      this.router.navigate(['search']);
    });
    this.searchInput();
  }

  timeSpinner(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 700);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log(event);
  }


}
