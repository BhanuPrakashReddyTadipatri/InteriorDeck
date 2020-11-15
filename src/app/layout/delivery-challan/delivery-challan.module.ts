import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryChallanRoutingModule } from './delivery-challan-routing.module';
import { DeliveryChallanComponent } from './delivery-challan.component';
import { DeliveryChallanListComponent } from './delivery-challan-list/delivery-challan-list.component';
import { AddDeliveryChallanComponent } from './add-delivery-challan/add-delivery-challan.component';
import { DataTablesModule } from 'angular-datatables';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MomentModule } from 'ngx-moment';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [DeliveryChallanComponent, DeliveryChallanListComponent, AddDeliveryChallanComponent],
  imports: [
    CommonModule,
    DeliveryChallanRoutingModule,
    DataTablesModule,
    FilterPipeModule,
    MomentModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    NgSelectModule
  ]
})
export class DeliveryChallanModule { }
