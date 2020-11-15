import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScheduleSiteVisitComponent } from './schedule-site-visit/schedule-site-visit.component';
import { LayoutComponent } from './layout.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { AuthGuard } from '../shared/auth.guard';
import { UserManagementComponent } from './user-management/user-management.component';
import { AssignEngineersComponent } from './assign-engineers/assign-engineers.component';
import { UserListComponent } from './user-list/user-list.component';
import { TicketWorkflowComponent } from './ticket-workflow/ticket-workflow.component';
import { EngineerTicketComponent } from './engineer-ticket/engineer-ticket.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { SiteExpensesListComponent } from './site-expenses-list/site-expenses-list.component';
import { ManageSiteExpenseComponent } from './manage-site-expense/manage-site-expense.component';
import { ManagePoComponent } from './manage-po/manage-po.component';
import { MaterialsManagementComponent } from './materials-management/materials-management.component';
import { MaterialConfigurationComponent } from './material-configuration/material-configuration.component';
import { PoListComponent } from './po-list/po-list.component';
import { SitesManagementComponent } from './sites-management/sites-management.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales', 'offshoreSupportEngineer', 'siteEngineer', 'accounts', 'innovationLabUser'] }
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales', 'offshoreSupportEngineer', 'siteEngineer', 'accounts', 'innovationLabUser'] }
      },
      {
        path: 'schedule-site-visit',
        component: ScheduleSiteVisitComponent,
        canActivate: [AuthGuard],
        data: { role: ['sales', 'manager', 'accounts'] }

      },
      {
        path: 'schedule-site-visit/:ticketId',
        component: ScheduleSiteVisitComponent,
        canActivate: [AuthGuard],
        data: { role: ['sales', 'manager', 'accounts'] }

      },
      {
        path: 'schedule-site-visit/:ticketId/:purchaseOrderId',
        component: ScheduleSiteVisitComponent,
        canActivate: [AuthGuard],
        data: { role: ['sales', 'manager', 'accounts'] }

      },
      {
        path: 'purchase-orders-list',
        component: PoListComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }

      },
      {
        path: 'manage-purchase-order/:id',
        component: ManagePoComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }
      },
      {
        path: 'manage-purchase-order/:id/:route',
        component: ManagePoComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }
      },
      {
        path: 'manage-purchase-order',
        component: ManagePoComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }

      },
      {
        path: 'ticket-list',
        component: TicketListComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'siteEngineer'] }
      },
      {
        path: 'ticket-list/ticket-details/:ticketId',
        component: TicketDetailsComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'siteEngineer'] }
      },
      {
        path: 'ticket-list/ticket-workflow/:ticketId',
        component: TicketWorkflowComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'siteEngineer'] }
      },
      {
        path: 'ticket-list/engineer-ticket/:ticketId',
        component: EngineerTicketComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'siteEngineer'] }
      },
      {
        path: 'materials-management',
        component: MaterialsManagementComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts', 'innovationLabUser'] }
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts', 'innovationLabUser'] }
      },
      {
        path: 'material-configuration',
        component: MaterialConfigurationComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }
      },
      {
        path: 'sites-management',
        component: SitesManagementComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'user-list',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'user-list/user-management/:userId/:type',
        component: UserManagementComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales', 'offshoreSupportEngineer', 'siteEngineer', 'accounts', 'innovationLabUser'] }
      },
      {
        path: 'feedback-list',
        component: FeedbackListComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'site-expenses-list',
        component: SiteExpensesListComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales'] }
      },
      {
        path: 'submit-new-site-expense',
        component: ManageSiteExpenseComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales'] }
      },
      {
        path: 'update-site-expense/:expenseId/:ticketId',
        component: ManageSiteExpenseComponent,
        canActivate: [AuthGuard],
        data: { role: ['manager', 'sales'] }
      },
      {
        path: 'delivery-Challan',
        loadChildren: './delivery-challan/delivery-challan.module#DeliveryChallanModule',
        canActivate: [AuthGuard],
        data: { role: ['manager', 'accounts'] }
      },
      {
        path: 'dc-config',
        loadChildren: './dc-config/dc-config.module#DcConfigModule',
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'vm-config',
        loadChildren: './vm-config/vm-config.module#VmConfigModule',
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'receipts',
        loadChildren: './material-receipt/material-receipt.module#MaterialReceiptModule',
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      },
      {
        path: 'materials-carry',
        loadChildren: './material-carry/material-carry.module#MaterialCarryModule',
        canActivate: [AuthGuard],
        data: { role: ['manager'] }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
