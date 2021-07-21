import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchText: string;
  searchIcon = faSearch;
  close = faWindowClose;;
  page = 1;
  pageSize = 10;
  isVisible = false;

  constructor(public dataService: DataService, public authService: AuthenticationService) {
    this.searchText = "";
  }

  ngOnInit() : void {
  }

  searchInput() {
    this.dataService.setResults(this.searchText);
    this.timeSpinner();
  }

  deleteInput() {
    this.searchText = '';
  }

  deleteResearch(id: number) {
    this.dataService.deleteResearch(id);
    this.searchInput();
  }

  timeSpinner(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 700);
}

}
