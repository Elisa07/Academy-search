import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _results: any;

  get results(): any{
    return this._results;
  }
  set results(value: any) {
    this._results = value;
  }

  constructor(private http: HttpClient) {}

  setResults(chiave: string) {
    return this.http.get("/ricerca?q=" + chiave);
  }
}
