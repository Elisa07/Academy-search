import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLogged) {
      this.router.navigate(['search']);
      return false;
    }
    else {
      return true;
    }
  }

}
