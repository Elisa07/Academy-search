import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from "./header/header.component";
import { NotFoundComponent } from './not-found/not-found.component';
import {SearchModule} from "./search/search.module";
import {AddModule} from "./add/add.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {SearchEditModule} from "./search-edit/search-edit.module";
import { SharedModule } from './shared/shared.module';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SearchModule,
    AddModule,
    SearchEditModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
