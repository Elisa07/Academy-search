import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: any;

  constructor(public dataService: DataService) {
    this.searchText = "";
  }

  ngOnInit() : void {}

  searchInput() {
    this.dataService.setResults(this.searchText).subscribe(
      data => {
        this.dataService.results = data;
      },
      error => { console.log("Errore" + error.message)},
    )
  }

  deleteInput() {
    this.searchText = '';
  }

}
