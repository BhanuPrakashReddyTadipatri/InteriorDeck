import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialCarryListComponent } from './material-carry-list/material-carry-list.component';
import { MaterialCarryDetailsComponent } from './material-carry-details/material-carry-details.component';

const routes: Routes = [
  {
    path: 'list',
    component: MaterialCarryListComponent,
  },
  {
    path: 'details/:userID',
    component: MaterialCarryDetailsComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialCarryRoutingModule { }
