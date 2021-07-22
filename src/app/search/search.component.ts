import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService, Result} from '../services/data.service';
import {faEdit, faSearch, faTrash, faWindowClose} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {parse} from "@fortawesome/fontawesome-svg-core";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
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

  resetSubs!: Subscription;

  selectOption: {id: number, value: number}[] = [
    { id: 1, value: 1 },
    { id: 5, value: 5 },
    { id: 10, value: 10 },
    { id: 20, value: 20 },
  ];
  selected: number = 10;

  constructor(public dataService: DataService, public authService: AuthenticationService, private router: Router) {
    this.searchText = "";
  }

  ngOnInit() : void {
    this.resetSubs = this.dataService.resetResearch.subscribe(() => {
      this.searchText = '';
      this.researchResult = [];
      this.noResult = true;
      this.isClicked = false;
    })
    if (sessionStorage.getItem('userPreferences')){
      this.selected = parseInt(<string>sessionStorage.getItem('userPreferences'));
      this.pageSize = this.selected;
    }

    if (sessionStorage.getItem('searchKey')) {
      this.searchText = <string>sessionStorage.getItem('searchKey');
      this.searchInput();
    }
  }

  ngOnDestroy() {
    this.resetSubs.unsubscribe();
  }

  searchInput(pageNumber = 1) {
    this.isClicked = true;
    sessionStorage.setItem('searchKey', this.searchText);
    this.dataService.fetchResult(this.searchText, this.pageSize, pageNumber).subscribe((respData) => {
      this.totalCount = respData.headers.get('x-total-count') ? parseInt(<string>respData.headers.get('x-total-count')) : 0;
      this.researchResult = (<Result[]>respData.body);
      this.page = pageNumber;
      this.dataService.results = this.researchResult;

      if(this.totalCount > 0) {
        this.noResult = false;
      }
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
    this.searchInput(1);
    sessionStorage.setItem('userPreferences', this.selected.toString());
  }

}
