import { Component, OnInit, ViewChild } from '@angular/core';
import {DataService, Result} from '../services/data.service';
import {faEdit, faSearch, faTrash, faWindowClose} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: string;
  searchIcon = faSearch;
  closeIcon = faWindowClose;
  editIcon = faEdit;
  trashIcon = faTrash;
  page = 1;
  pageSize = 10;
  isVisible = false;
  noResult = true;
  isClicked = false;

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

  constructor(public dataService: DataService, public authService: AuthenticationService, private router: Router) {
    this.searchText = "";
  }

  ngOnInit() : void {  }

  searchInput(pageNumber = 1) {
    this.isClicked = true;

    this.dataService.fetchResult(this.searchText, this.pageSize, pageNumber).subscribe((respData) => {
      this.totalCount = respData.headers.get('x-total-count') ? parseInt(<string>respData.headers.get('x-total-count')) : 0;
      this.researchResult = (<Result[]>respData.body);
      this.page = pageNumber;
      this.dataService.results = this.researchResult;
      console.log(this.totalCount);
      
      if(this.totalCount > 0) {
        this.noResult = false;
      }
      console.log(this.noResult);
      
      console.log(this.researchResult);
    });
    this.timeSpinner();
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

  onChangePageSize() {
    this.pageSize = this.selected;
    this.searchInput();
  }

}

