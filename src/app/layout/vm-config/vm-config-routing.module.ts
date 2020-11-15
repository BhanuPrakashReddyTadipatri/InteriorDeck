import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VmConfigComponent } from './vm-config.component';
import { VmConfigListComponent } from './vm-config-list/vm-config-list.component';
import { AddVmConfigComponent } from './add-vm-config/add-vm-config.component';

const routes: Routes = [
  {
    path: '', component: VmConfigComponent,
    children: [
      { path: '', redirectTo: 'list'},
      { path: 'list', component: VmConfigListComponent },
      { path: 'add', component: AddVmConfigComponent },
      { path: 'edit/:id', component: AddVmConfigComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VmConfigRoutingModule { }
