import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DcConfigComponent } from './dc-config.component';
import { DcConfigListComponent } from './dc-config-list/dc-config-list.component';
import { AddDcConfigComponent } from './add-dc-config/add-dc-config.component';

const routes: Routes = [
  {
    path: '', component: DcConfigComponent,
    children: [
      { path: '', redirectTo: 'list'},
      { path: 'list', component: DcConfigListComponent },
      { path: 'add', component: AddDcConfigComponent },
      { path: 'edit/:id', component: AddDcConfigComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DcConfigRoutingModule { }
