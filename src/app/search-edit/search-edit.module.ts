import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthGuard} from "../services/auth-guard.service";
import { FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SearchEditComponent} from "./search-edit.component";
import {SearchComponent} from "../search/search.component";

@NgModule({
  declarations: [
    SearchEditComponent,
  ],

  imports:[
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {path: '', component: SearchEditComponent, canActivate: [AuthGuard]}
    ])
  ],
})
export class SearchEditModule { }
