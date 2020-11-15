import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialCarryRoutingModule } from './material-carry-routing.module';
import { MaterialCarryListComponent } from './material-carry-list/material-carry-list.component';
import { MaterialCarryDetailsComponent } from './material-carry-details/material-carry-details.component';

@NgModule({
  declarations: [
    MaterialCarryDetailsComponent,
    MaterialCarryListComponent
  ],
  imports: [
    CommonModule,
    MaterialCarryRoutingModule
  ]
})
export class MaterialCarryModule { }
