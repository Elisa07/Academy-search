import { Component, OnInit, ViewChild } from '@angular/core';
<<<<<<< HEAD
import { DataService } from '../services/data.service';
import {faEdit, faSearch, faTrash, faWindowClose, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import { HostListener } from '@angular/core';
=======
import {DataService, Result} from '../services/data.service';
import {faEdit, faSearch, faTrash, faWindowClose} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
>>>>>>> 958f9fba5257059311455295b803f8f32b269432

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: string;
  lastSearch: string = "";
  searchIcon = faSearch;
  closeIcon = faWindowClose;
  editIcon = faEdit;
  trashIcon = faTrash;
  noFound = faTimesCircle;
  page = 1;
  pageSize = 10;
  isVisible = false;
<<<<<<< HEAD
  isClicked = false;
 
=======

  // Nuova fetch
  researchResult: Result[] = [];
  totalCount: number = 0;

  selectOption: {id: number, value: number, selected: boolean}[] = [
    { id: 1, value: 1, selected: false},
    { id: 5, value: 5, selected: false },
    { id: 10, value: 10, selected: true },
    { id: 20, value: 20, selected: false},
  ];
  selected: number = 10;

>>>>>>> 958f9fba5257059311455295b803f8f32b269432
  constructor(public dataService: DataService, public authService: AuthenticationService, private router: Router) {
    this.searchText = "";
    this.lastSearch = this.searchText;
  }

  ngOnInit() : void {  }

<<<<<<< HEAD
  searchInput() {
    this.dataService.setResults(this.searchText);
    this.lastSearch = this.searchText;
=======
  searchInput(pageNumber = 1) {
    this.dataService.fetchResult(this.searchText, this.pageSize, pageNumber).subscribe((respData) => {
      this.totalCount = respData.headers.get('x-total-count') ? parseInt(<string>respData.headers.get('x-total-count')) : 0;
      console.log(Math.ceil(this.totalCount / this.pageSize));
      this.researchResult = (<Result[]>respData.body);
      this.page = pageNumber;
      this.dataService.results = this.researchResult;
      console.log(this.researchResult);
    });
>>>>>>> 958f9fba5257059311455295b803f8f32b269432
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

<<<<<<< HEAD
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log(event);
  }

=======
  onChangePageSize() {
    this.pageSize = this.selected;
    this.searchInput(1);
    console.log(this.selected);
  }
>>>>>>> 958f9fba5257059311455295b803f8f32b269432

}
