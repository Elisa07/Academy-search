import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";

export interface Result {
  id: number,
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
        this.setResultsLength(Object.keys(data).length);
        this.setResultsForPage(1);
      },
      error => { console.log("Errore" + error.message)},
    );
  }

  addPost(postData: { titolo: string, descrizione: string, chiavi: string, url: string }): Observable<any> {
    const headers = new HttpHeaders ({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    })
    return this.http.post<{ titolo: string, descrizione: string, chiavi: string, url: string, id: number }>(
      "/ricerca",
      postData,
      { headers: headers}
    );
  }

  getSearch(id: number): Result | undefined {
    for (let s of this._results) {
      if (s.id === id){
        return s;
      }
    }
    return undefined;
  }
  deleteResearch(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    return this.http.delete<void>('ricerca/' + id , {headers: headers});
  }

  setResearch(id: number, research: {titolo: string, descrizione: string, chiavi: string, url: string}): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    return this.http.patch<any>('ricerca/' + id, research, {headers: headers});
  }

  getAllResearches(): Observable<Result[]> {
    return this.http.get<Result[]>('ricerca');
  }

  removeResearches(ids: number[]): Observable<void> {
    let idUrl = '';

    for (let i = 0; i < ids.length; i++){
      idUrl += 'id=' + ids[i];
      if (i !== ids.length - 1) {
        idUrl += '&';
      }
    }

    return this.http.delete<void>('http://localhost:3000/eliminaRisultati?' + idUrl);
  }
}
