import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

interface LoginInfo {
  accessToken: string,
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
  private _tokenInterval: any;
  private _tokenRefreshTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {
    if (localStorage.getItem('userInfo') && !!localStorage.getItem('userInfo')) { // Se nella storage c'è un utente
      const getUserInfo: LoginInfo = JSON.parse(<string>localStorage.getItem('userInfo'));
      if (Date.now() - getUserInfo.refreshTokenExpireIn > 0) { // Token presente ma scaduto
        this.userInfo = null;
        this.isLogged = false;
        localStorage.removeItem('userInfo');
        // console.log('User non valido');
      }
      else { // Token presente e ancora valido
        // console.log('User valido')
        this.userInfo = getUserInfo;
        this.isLogged = true;
        this.refreshToken(this.userInfo.refreshToken); // Chiedo un nuovo token
        // console.log('costruttore');
        this._tokenInterval = this.setTokenInterval(300000);

      }
    }
    else {
      // console.log('Nessun utente presente in local storage');
      this.userInfo = null;
    }
  }

  login(username: string, password: string): void {
    if (!this.isLogged && !this.userInfo) { //Se non è loggato
      this.http.post<LoginInfo>('/auth/login', {'user': username, 'password': password})
        .subscribe( (respData: LoginInfo) => {
            this.userInfo = respData;
            this.isLogged = true;

            localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            this.userChanges.next();
            // console.log('login');
            this._tokenInterval = this.setTokenInterval(this.userInfo.tokenExpireIn - Date.now());
            this._tokenRefreshTimer = this.setRefreshTokenTimer(this.userInfo.refreshTokenExpireIn - Date.now());
          },
          (error) => {
            console.log(error.message);
          }
        )
    }
  }

  logout(): void {
    this.isLogged = false;
    this.userInfo = null;
    clearInterval(this._tokenInterval);
    this._tokenRefreshTimer = null;
    localStorage.removeItem('userInfo');
    this.userChanges.next();
    this.router.navigate(['search']);
  }

  private refreshToken(refreshToken: string) {
    const headers = new HttpHeaders({
      'Authentication': 'Bearer ' + refreshToken
    });
    this.http.post<string>('/auth/refreshToken', {refreshToken: refreshToken}, {headers: headers})
      .subscribe((newToken) => {
        if (this.userInfo) {
          this.userInfo.accessToken = newToken;
        }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
      });
  }

  private setTokenInterval(interval: number): number {
    console.log('Interval set to: ' + interval + ' in realtà 60000' );
    return setInterval(() => { // Aggiornamento del token dopo 5 minuti
      this.isLogged = false;
      // console.log('Timer expirfhsdkd');
      if (this.userInfo?.refreshToken)
        this.refreshToken(this.userInfo?.refreshToken);
    }, /*interval*/ 60000);
  }

  private setRefreshTokenTimer(time: number): number {
    return setTimeout(() => { //Se rimane loggato per più di 9 ore si esegue il log out
      this.logout();
    }, time);
  }

  private getTokenInfo() {
    const headers = new HttpHeaders({
      'Authentication': 'Bearer ' + this.userInfo?.refreshToken,
      'Content-Type': 'json'
    });
    this.http.post('/auth/verifyToken', {}, {headers: headers}).subscribe((resData) => {
      console.log(resData);
    });
  }
}
