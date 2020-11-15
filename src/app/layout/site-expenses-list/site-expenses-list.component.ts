import { Component, OnInit } from '@angular/core';

import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-site-expenses-list',
  templateUrl: './site-expenses-list.component.html',
  styleUrls: ['./site-expenses-list.component.scss']
})
export class SiteExpensesListComponent implements OnInit {
  public tableOptions: any = {
    pageLength: 10,
    columnDefs: [
      { orderable: false, targets: -1 }
    ]
  };
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public showConfirmation = false;
  public filterTickets: any;
  public ticketList = [];
  public ticketStatus = {
    ticketStatus: 'open'
  };
  public searchKeys: any = ['siteName', 'category', 'requestedBy', 'ticketId', 'createTime', 'ticket_type'];
  public ticketCount = {};
  public userRole;
  public ticketIdToDelete = undefined;
  public tabList = [
    { value: 'open', label: 'Open', icon: 'far fa-calendar-alt' },
    { value: 'processing', label: 'Processing', icon: 'fas fa-industry' },
    { value: 'completed', label: 'Completed', icon: 'far fa-check-circle' }
  ];

  public currentfilterOption = 'submitted';

  public filterList = [
    { value: '', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'Internal processing', label: 'Internal processing' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'on site', label: 'On site' }
  ];
  public filterType;

  constructor(
    private _http: HttpLayerService,
    private _router: Router,
    private _session: SessionService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.userRole = this._session.api.local.get(Config.USER_ROLE);
    this.fetchTicketList(this.ticketStatus);
    this.fetchTicketCount();
  }
  checkEditAvailability() {
    if (this.userRole === 'siteEngineer') {
      if (this.ticketStatus.ticketStatus === 'open' || this.ticketStatus.ticketStatus === 'waitingReadiness' || this.ticketStatus.ticketStatus === 'visitScheduled') {
        return false;
      }
    }
    return false;
  }
  editSiteVisit(visitDetails) {
    this._router.navigate(['submit-new-site-expense']);
  }
  fetchTicketList(ticketStatus) {
    this._http.get(Config.SERVICE_IDENTIFIER.GET_EXPENSES_TICKET_LIST, ticketStatus).subscribe((response) => {
      if (response.status === true) {
        this.ticketList = response.data.tableData;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteTicket() {
    const postJson = {
      ticketId: this.ticketIdToDelete
    };
    this._http.post(Config.SERVICE_IDENTIFIER.DELETE_TICKET, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Ticket deleted successfully');
        this.fetchTicketList(this.ticketStatus);
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteTicketConfirmation(bodySubscript) {
    this.ticketIdToDelete = bodySubscript.ticketId;
    this.confirmJson.type = 'deleteTicket';
    this.confirmJson.title = 'Delete Ticket';
    this.confirmJson.message = 'Are you sure you want to delete the ticket?';
    this.showConfirmation = true;
  }
  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'deleteTicket') {
        this.deleteTicket();
      }
    }
    this.showConfirmation = false;
  }
  fetchTicketCount() {
    this._http.post(Config.SERVICE_IDENTIFIER.TICKET_COUNT, null).subscribe((response) => {
      if (response.status === true) {
        this.ticketCount = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  getCount(value) {
    const value1 = value;
    const count = this.ticketCount[value1];
    return count;
  }
  changeFilter() {
    this.fetchTicketList(this.ticketStatus);
  }

  navigateToTicket(body) {
    this._router.navigate(['submit-new-site-expense'])
  }
  changeTab(tab) {
    this.ticketStatus.ticketStatus = tab;
    this.fetchTicketList(this.ticketStatus);
  }
  navigateToPage() {
    this._router.navigate(['submit-new-site-expense']);
  }
}
