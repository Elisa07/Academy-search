import {Injectable} from "@angular/core";
import {Router, RoutesRecognized} from "@angular/router";
import {filter, pairwise} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  previousRoute: string = '/search';

  constructor(private router:Router) {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previousRoute = events[0].urlAfterRedirects;
      });

  }

  getPreviousRoute(): string {
    return this.previousRoute;
  }
}
