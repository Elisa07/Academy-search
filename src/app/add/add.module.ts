import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AddComponent} from "./add.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthGuard} from "../services/auth-guard.service";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    AddComponent,
  ],

  imports:[
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {path: '', component: AddComponent, pathMatch: 'full', canActivate: [AuthGuard]}
    ])
  ],
})
export class AddModule { }
