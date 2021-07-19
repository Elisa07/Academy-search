import {NgModule} from "@angular/core";
import {SearchComponent} from "./search.component";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    SearchComponent
  ],

  imports:[
    NgbModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', component: SearchComponent, pathMatch: 'full'}
    ]),
  ],

  exports: [
    RouterModule
  ]

})
export class SearchModule {

}
