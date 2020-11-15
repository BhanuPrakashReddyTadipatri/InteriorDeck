import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DcConfigRoutingModule } from './dc-config-routing.module';
import { DcConfigComponent } from './dc-config.component';
import { DcConfigListComponent } from './dc-config-list/dc-config-list.component';
import { AddDcConfigComponent } from './add-dc-config/add-dc-config.component';
import { DataTablesModule } from 'angular-datatables';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MomentModule } from 'ngx-moment';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [DcConfigComponent, DcConfigListComponent, AddDcConfigComponent],
  imports: [
    CommonModule,
    DcConfigRoutingModule,
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
export class DcConfigModule { }
