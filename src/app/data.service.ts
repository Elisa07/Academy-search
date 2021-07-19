import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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

  constructor(private http: HttpClient) {}

  setResults(chiave: string) {
    return this.http.get("/ricerca?q=" + chiave);
  }

  addPost(postData: { titolo: string; descrizione: string; chiavi: any; url: string; }, token:any) {  
    this.http.post(
      "/ricerca/",
      postData,
      // {
      //   'Authorization': `Bearer ${token}`
      // }
    ).subscribe(responseData => {
      console.log(responseData)
    });
  }
}
