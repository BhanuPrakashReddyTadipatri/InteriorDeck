import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTableWithPaginationComponent } from './simple-table-with-pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SimpleTableWithPaginationComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
  ],
  exports: [SimpleTableWithPaginationComponent],
})
export class SimpleTableWithPaginationModule { }
