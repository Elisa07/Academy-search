import {Injectable, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpResponse} from '@angular/common/http';
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
  public resultsForPagination: any = [];
  public token: any;
  private endpoint = 'http://localhost:3000/';

  resetResearch = new EventEmitter<boolean>();

  get results(): Result[]{
    return this._results;
  }
  set results(value: Result[]) {
    this._results = value;
  }

  constructor(private http: HttpClient, private router:Router, private authService: AuthenticationService) {
    sessionStorage.removeItem('searchKey');
  }

  fetchResult(key: string, pageSize:number, pageNumber: number): Observable<HttpResponse<Result[]>> {
    return this.http.get<Result[]>(this.endpoint + 'ricerca?q=' + key + '&_page=' + pageNumber + '&_limit=' + pageSize, {observe: 'response'});
  }


  addPost(postData: { titolo: string, descrizione: string, chiavi: string, url: string }): Observable<any> {
    const headers = new HttpHeaders ({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    })
    return this.http.post<{ titolo: string, descrizione: string, chiavi: string, url: string, id: number }>(
      this.endpoint + "/ricerca",
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
    return this.http.delete<void>(this.endpoint + 'ricerca/' + id , {headers: headers});
  }

  setResearch(id: number, research: {titolo: string, descrizione: string, chiavi: string, url: string}): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.userInfo?.access_token
    });
    return this.http.patch<any>(this.endpoint + 'ricerca/' + id, research, {headers: headers});
  }

  getAllResearches(): Observable<Result[]> {
    return this.http.get<Result[]>(this.endpoint + 'ricerca');
  }

  removeResearches(ids: number[]): Observable<void> {
    let idUrl = '';

    for (let i = 0; i < ids.length; i++){
      idUrl += 'id=' + ids[i];
      if (i !== ids.length - 1) {
        idUrl += '&';
      }
    }

    return this.http.delete<void>(this.endpoint + 'eliminaRisultati?' + idUrl);
  }
}
