import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: any;
  searchIcon = faSearch;
  page = 1;
  pageSize = 10;

  constructor(public dataService: DataService) {
    this.searchText = "";
  }

  ngOnInit() : void {}

  searchInput() {
    this.dataService.setResults(this.searchText).subscribe(
      data => {
        this.dataService.results = data;
        this.dataService.setResultsLength(Object.keys(data).length);
        this.dataService.setResultsForPage(1);
      },
      error => { console.log("Errore" + error.message)},
    )
  }

  deleteInput() {
    this.searchText = '';
  }

}
