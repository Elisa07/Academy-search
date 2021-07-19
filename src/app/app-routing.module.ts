import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SearchComponent} from "./search/search.component";
import {AddComponent} from "./add/add.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},
  { path: 'admin', loadChildren: () => import('./add/add.module').then(m => m.AddModule)},
  { path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
