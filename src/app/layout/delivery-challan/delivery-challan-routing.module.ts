import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryChallanComponent } from './delivery-challan.component';
import { DeliveryChallanListComponent } from './delivery-challan-list/delivery-challan-list.component';
import { AddDeliveryChallanComponent } from './add-delivery-challan/add-delivery-challan.component';

const routes: Routes = [
  {
    path: '', component: DeliveryChallanComponent,
    children : [
      { path: '', redirectTo: 'list' },
      { path: 'list', component: DeliveryChallanListComponent },
      { path: 'list/:type', component: DeliveryChallanListComponent },
      { path: 'add', component: AddDeliveryChallanComponent },
      { path: 'add/:type', component: AddDeliveryChallanComponent },
      { path: 'edit/:id', component: AddDeliveryChallanComponent },
      { path: 'edit/:id/:type', component: AddDeliveryChallanComponent },
      { path: 'viewChallan/:id/:type/:po', component: AddDeliveryChallanComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryChallanRoutingModule { }
