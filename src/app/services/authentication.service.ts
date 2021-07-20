import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {catchError, tap} from "rxjs/operators";

interface LoginInfo {
  access_token: string,
  tokenExpireIn: number,
  refreshToken: string,
  refreshTokenExpireIn: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLogged = false;
  userInfo: LoginInfo | null = null;

  userChanges: Subject<void> = new Subject<void>();
  private _tokenTimer: any;
  private _tokenRefreshTimer: any;


  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) {
    if (cookieService.get('userInfo') && !!cookieService.get('userInfo')) {
      const getUserInfo: LoginInfo = JSON.parse(<string>cookieService.get('userInfo'));
      if (Date.now() - getUserInfo.refreshTokenExpireIn > 0) { // Token presente ma scaduto
        this.userInfo = null;
        this.isLogged = false;
        cookieService.delete('userInfo');
      }
      else { // Token presente e ancora valido
        this.userInfo = getUserInfo;
        this.isLogged = true;
        this.refreshToken(this.userInfo.refreshToken); // Chiedo un nuovo token
      }
    }
    else {
      this.userInfo = null;
    }
  }

  login(username: string, password: string): Observable<LoginInfo> {
    //Se non è loggato
    return this.http.post<LoginInfo>('/auth/login', {'user': username, 'password': password})
      .pipe(tap((respData) => {
        this.userInfo = respData;
        this.isLogged = true;
        this.cookieService.set('userInfo',  JSON.stringify(this.userInfo));
        this.userChanges.next();

        this.setTokenTimer(this.userInfo.tokenExpireIn - Date.now());
        this.setRefreshTokenTimer(this.userInfo.refreshTokenExpireIn - Date.now());
        return respData;
      }), catchError(error => {
        return throwError(error.error.message);
      }));
  }

  logout(): void {
    this.isLogged = false;
    this.userInfo = null;
    clearTimeout(this._tokenTimer);
    clearTimeout(this._tokenRefreshTimer);
    this.cookieService.delete('userInfo');
    this.userChanges.next();
    this.router.navigate(['search']);
  }

  private refreshToken(refreshToken: string) {
    const headers = new HttpHeaders({
      'Authentication': 'Bearer ' + refreshToken
    });
    this.http.post<{access_token: string, tokenExpireIn: number}>('/auth/refreshToken', {refreshToken: refreshToken}, {headers: headers})
      .subscribe((newToken) => {
        if (this.userInfo) {
          this.userInfo.access_token = newToken.access_token;
          this.userInfo.tokenExpireIn = newToken.tokenExpireIn;
          this.setTokenTimer(this.userInfo.tokenExpireIn - Date.now());
        }
        this.cookieService.set('userInfo', JSON.stringify(this.userInfo))
      },
        error => {
        throwError(error.error.message);
        });
  }

  private setTokenTimer(interval: number): void { //Timer non interval
    this._tokenTimer = setTimeout(() => { // Aggiornamento del token dopo 5 minuti
      this.isLogged = false;
      if (this.userInfo?.refreshToken) {
        this.refreshToken(this.userInfo.refreshToken);
      }
    }, interval);
  }

  private setRefreshTokenTimer(time: number): void {
    this._tokenRefreshTimer = setTimeout(() => { //Se rimane loggato per più di 9 ore si esegue il log out
      this.logout();
    }, time);
  }
}
