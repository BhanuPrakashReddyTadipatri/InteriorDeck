import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialReceiptListComponent } from './material-receipt-list/material-receipt-list.component';
import { AddMaterialReceiptComponent } from './add-material-receipt/add-material-receipt.component';
import { MaterialReceiptComponent } from './material-receipt.component';
import { MaterialReceiptRoutingModule } from './material-receipt-routing.module';
import { FormsModule } from '@angular/forms';
import { SimpleTableWithPaginationModule } from 'src/app/shared/simple-table-with-pagination/simple-table-with-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AddRepairReceiptComponent } from './add-repair-receipt/add-repair-receipt.component';



@NgModule({
  declarations: [MaterialReceiptListComponent, AddMaterialReceiptComponent, MaterialReceiptComponent, AddRepairReceiptComponent],
  imports: [
    CommonModule,
    MaterialReceiptRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class MaterialReceiptModule { }
