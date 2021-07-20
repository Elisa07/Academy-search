import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: any;
  searchIcon = faSearch;
  close = faWindowClose;
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
        console.log(data);
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
