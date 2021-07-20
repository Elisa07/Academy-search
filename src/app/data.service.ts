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
  public _results: Result[] = [];
  public _resultsLength: any;
  public resultsForPagination: any;
  public token: any;

  get results(): Result[]{
    return this._results;

  }
  set results(value: Result[]) {
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
    return this.http.get<Result[]>("/ricerca?q=" + chiave).subscribe(
      data => {
        this.results = data;
        console.log(data);
        this.setResultsLength(Object.keys(data).length);
        this.setResultsForPage(1);
      },
      error => { console.log("Errore" + error.message)},
    );
  }

  addPost(postData: { titolo: string, descrizione: string, chiavi: string, url: string }) {
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
  getSearch(id: number): Result | undefined {
    for (let s of this._results) {
      console.log(s.id === id);
      console.log(id);
      if (s.id === id){
        console.log(s.id);
        return s;
      }
    }
    return undefined;
  }
  deleteResearch(id: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    console.log(this.authService.userInfo?.access_token);
    this.http.delete('ricerca/' + id , {headers: headers}).subscribe(() => {
      console.log(id);
      this.router.navigate(['search']);
    });
  }

  setResearch(id: number, research: {titolo: string, descrizione: string, chiavi: string, url: string}) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    this.http.patch('ricerca/' + id, research, {headers: headers}).subscribe((respData) => {
      console.log('Patch eseguita');
      console.log(respData);
    })
  }
}
