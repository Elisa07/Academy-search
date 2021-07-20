import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: string;
  searchIcon = faSearch;
  close = faWindowClose;
  page = 1;
  pageSize = 10;

  constructor(public dataService: DataService) {
    this.searchText = "";
  }

  ngOnInit() : void {}

  searchInput() {
    this.dataService.setResults(this.searchText);
  }

  deleteInput() {
    this.searchText = '';
  }

  deleteResearch(id: number) {
    this.dataService.deleteResearch(id);
    this.searchInput();
  }

}
