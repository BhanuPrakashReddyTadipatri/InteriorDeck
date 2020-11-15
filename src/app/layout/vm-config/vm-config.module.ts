import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VmConfigRoutingModule } from "./vm-config-routing.module";
import { VmConfigListComponent } from "./vm-config-list/vm-config-list.component";
import { VmConfigComponent } from "./vm-config.component";
import { AddVmConfigComponent } from "./add-vm-config/add-vm-config.component";
import { DataTablesModule } from "angular-datatables";
import { FilterPipeModule } from "ngx-filter-pipe";
import { MomentModule } from "ngx-moment";
import { SharedModule } from "src/app/shared/shared.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    VmConfigListComponent,
    VmConfigComponent,
    AddVmConfigComponent,
  ],
  imports: [
    CommonModule,
    VmConfigRoutingModule,
    DataTablesModule,
    MomentModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class VmConfigModule {}
