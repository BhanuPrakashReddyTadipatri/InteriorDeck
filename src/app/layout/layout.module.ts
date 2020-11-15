import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MomentModule } from 'ngx-moment';
import { NgxEchartsModule } from 'ngx-echarts';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { LayoutRoutingModule } from './layout-routing.module';
import { ScheduleSiteVisitComponent } from './schedule-site-visit/schedule-site-visit.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { AssignEngineersComponent } from './assign-engineers/assign-engineers.component';
import { FullCalendarModule } from 'ng-fullcalendar';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TicketWorkflowComponent } from './ticket-workflow/ticket-workflow.component';
import { EngineerTicketComponent } from './engineer-ticket/engineer-ticket.component';
import { ToastrModule } from 'ngx-toastr';
import { SearchFilterPipe } from './ticket-list/pipe/search-filter.pipe';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BarRatingModule } from 'ngx-bar-rating';
import { SidebarModule } from 'ng-sidebar';
import { SiteExpensesListComponent } from './site-expenses-list/site-expenses-list.component';
import { ManageSiteExpenseComponent } from './manage-site-expense/manage-site-expense.component';
import { ManagePoComponent } from './manage-po/manage-po.component';
import { MaterialsManagementComponent } from './materials-management/materials-management.component';
import { MaterialConfigurationComponent } from './material-configuration/material-configuration.component';
import { PoListComponent } from './po-list/po-list.component';
import { SitesManagementComponent } from './sites-management/sites-management.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    LayoutComponent,
    ScheduleSiteVisitComponent,
    HomeComponent,
    TicketListComponent,
    TicketDetailsComponent,
    UserManagementComponent,
    UserListComponent,
    AssignEngineersComponent,
    TicketWorkflowComponent,
    EngineerTicketComponent,
    SearchFilterPipe,
    FeedbackListComponent,
    SiteExpensesListComponent,
    ManageSiteExpenseComponent,
    ManagePoComponent,
    MaterialsManagementComponent,
    MaterialConfigurationComponent,
    PoListComponent,
    SitesManagementComponent,
    ProductsComponent
    ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DataTablesModule,
    MomentModule,
    ToastrModule,
    NgxEchartsModule,
    FilterPipeModule,
    BarRatingModule,
    SidebarModule.forRoot(),
    ScrollingModule
  ]
})
export class LayoutModule { }
