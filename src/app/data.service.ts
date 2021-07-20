import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthenticationService} from "./services/authentication.service";


export interface Result {
  id?: number,
  titolo: string,
  descrizione: string,
  chiavi: string,
  url: string
}
@Injectable({
  providedIn: 'root'
})

export class DataService {
  public _results: any;
  public _resultsLength: any;
  public resultsForPagination: any;
  public token: any;

  get results(): any{
    return this._results;
  }
  set results(value: any) {
    this._results = value;
  }

  get resultsLength(): any{
    return this._resultsLength;
  }
  setResultsLength(value: any) {
    this._resultsLength = value;
  }

  setResultsForPage(page:any) {
    this.resultsForPagination = this._results.slice(page*10 - 10, page*10)
  }

  constructor(private http: HttpClient, private router:Router, private authService: AuthenticationService) {}

  setResults(chiave: string) {
    return this.http.get("/ricerca?q=" + chiave);
  }

  addPost(postData: { titolo: string; descrizione: string; chiavi: any; url: string; }) { 
    const headers = new HttpHeaders ({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    }) 
    return this.http.post(
      "/ricerca",
      postData,
      { headers: headers}
    ).subscribe(responseData => {
      console.log(responseData)
    });
  }


  // Elisa modifiche
  deleteResearch(id: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    console.log(this.authService.userInfo?.access_token);
    this.http.delete('ricerca/' + id, {headers: headers}).subscribe(() => {
      console.log(id);
      this.router.navigate(['search']);
    });
  }

  editResearch() {

  }
}
