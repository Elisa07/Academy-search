import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AddComponent} from "./add.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthGuard} from "../services/auth-guard.service";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AddComponent,
  ],

    imports: [
        ReactiveFormsModule,
        CommonModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {path: '', component: AddComponent, pathMatch: 'full', canActivate: [AuthGuard]}
        ]),
        FormsModule,
      NgbNavModule
    ],
})
export class AddModule { }
