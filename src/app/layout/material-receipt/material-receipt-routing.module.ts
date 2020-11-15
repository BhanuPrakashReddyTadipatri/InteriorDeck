import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialReceiptComponent } from './material-receipt.component';
import { MaterialReceiptListComponent } from './material-receipt-list/material-receipt-list.component';
import { AddMaterialReceiptComponent } from './add-material-receipt/add-material-receipt.component';
import { AddRepairReceiptComponent } from './add-repair-receipt/add-repair-receipt.component';


const routes: Routes = [
  {
    path: '', component: MaterialReceiptComponent,
    children: [
      { path: '', redirectTo: 'list'},
      { path: 'list', component: MaterialReceiptListComponent },
      { path: 'list/:type', component: MaterialReceiptListComponent },
      { path: 'list/:type/:innerTab', component: MaterialReceiptListComponent },
      { path: 'add-material-receipt/:tab/:innerTab', component: AddMaterialReceiptComponent },
      { path: 'edit-material-receipt/:tab/:innerTab/:type/:id', component: AddMaterialReceiptComponent},
      { path: 'add-repair-receipt/:tab/:innerTab', component: AddRepairReceiptComponent },
      { path: 'edit-repair-receipt/:tab/:innerTab/:type/:id', component: AddRepairReceiptComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialReceiptRoutingModule { }
