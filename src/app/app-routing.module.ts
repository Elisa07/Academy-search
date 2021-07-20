import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},
  { path: 'search/:id', loadChildren: () => import('./search-edit/search-edit.module').then(m => m.SearchEditModule)},
  { path: 'admin', loadChildren: () => import('./add/add.module').then(m => m.AddModule)},
  { path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
