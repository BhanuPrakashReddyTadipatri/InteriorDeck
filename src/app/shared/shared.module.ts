import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SimpleTableWithPaginationModule } from './simple-table-with-pagination/simple-table-with-pagination.module';
import { FilterTablePipe } from './simple-table-with-pagination/filter-table.pipe';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
  declarations: [HeaderComponent, ConfirmationDialogComponent, SideBarComponent, FilterTablePipe, ActivityComponent],
  imports: [
    CommonModule,
    MomentModule,
    SimpleTableWithPaginationModule,
  ],
  exports: [
    NgbModule,
    HeaderComponent,
    ActivityComponent,
    FilterTablePipe,
    SideBarComponent,
    ConfirmationDialogComponent,
    SimpleTableWithPaginationModule,
  ]
})
export class SharedModule { }
