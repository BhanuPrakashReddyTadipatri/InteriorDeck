import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();
  public tabBtns = [
    {
      label: 'Submitted',
      type: 'submitted',
      hide: true,
    },
    {
      label: 'Waiting Readiness',
      type: 'waitingReadiness',
      hide: true,
    },
    {
      label: 'Visit Scheduled',
      type: 'visitScheduled',
      hide: true,
    },
    {
      label: 'On site',
      type: 'onSite',
      hide: true,
    },
    {
      label: 'Completed',
      type: 'completed',
      hide: true,
    },
  ];

  @ViewChild('linkPoPopup') linkPoPopup;

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
    ticketStatus: 'submitted'
  };
  public searchKeys: any = ['siteName', 'category', 'requestedBy', 'ticketId', 'createTime', 'ticket_type'];
  public ticketCount = {};
  public userRole;
  public ticketIdToDelete = undefined;
  public exportName = {
    submitted: 'Submitted',
    waitingReadiness: 'Waiting Readiness',
    visitScheduled: 'Visit Scheduled',
    onSite: 'On site',
    completed: 'Completed'
  };


  public filterList = [
    { value: '', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'Internal processing', label: 'Internal processing' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'on site', label: 'On site' }
  ];
  public purchaseOrders;
  public selectedPO: any;
  public linkTicket: any;


  public ticketListTable = {
    tableActions: {
      actions: [],
      enableActions: true,
      externalActions: [
        {
          action: 'refresh',
          label: 'Refresh',
          type: 'refresh',
          icon: 'fa fa-refresh',
        },
        {
          action: 'download',
          label: 'Download',
          type: 'download',
          icon: 'fa fa-download',
        },
      ],
      columnSearch: {
        enable: true,
        searchExceptions: [],
      },
      columnSort: {
        enable: true,
        sortExceptions: [],
      },
      showSerialNumber: true,
      stylings: {
        height: 'calc(100vh - 265px)',
      },
      columnOptions: {
        ticketId: {
          customColumnClass: 'min-table-width',
        },
        requestedBy: {
          customColumnClass: 'min-table-width-request-by',
        },
        ticket_type: {
          customColumnClass: 'min-table-width',
        },
        createTime: {
          customColumnClass: 'min-table-width-request-by',
        },
        siteName: {
          customColumnClass: 'min-table-site-name',
        },
      },
      columnFilter: {
        show: true,
        minimumColumns: 2,
        defaultColumnsToDisplay: [],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['ticketId', 'poNumber']
    }
  };

  public permission = {
    manager: ['submitted', 'waitingReadiness', 'visitScheduled', 'onSite', 'completed'],
    siteEngineer: ['visitScheduled', 'onSite', 'completed'],
  };



  constructor(
    private _http: HttpLayerService,
    private _router: Router,
    private _session: SessionService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.userRole = this._session.api.local.get(Config.USER_ROLE);
    if (this.permission && this.permission[this.userRole]) {
      this.permission[this.userRole].forEach((parentEle) => {
        const index = this.tabBtns.findIndex(childEle => childEle.type === parentEle);
        if (index > -1) {
          this.tabBtns[index].hide = false;
        }
      });
    }
    if (this.userRole === 'siteEngineer') {
      this.ticketStatus.ticketStatus = 'visitScheduled';
    }

    if (this.userRole === 'manager' && this.ticketStatus.ticketStatus === 'submitted') {
      const edit = {
        action: 'edit',
        label: 'Edit',
        type: 'edit',
        onlyIcon: true,
        icon: 'fa fa-pencil-alt',
      };
      const remove = {
        action: 'delete',
        label: 'Delete',
        type: 'delete',
        onlyIcon: true,
        icon: 'fa fa-trash-alt',
      };
      this.ticketListTable.tableActions.actions.splice(0, 2, edit, remove);
    }

    this.fetchTicketList(this.ticketStatus);
    this.fetchTicketCount();
    this.fetchPurchaseOrdersList();
  }
  fetchPurchaseOrdersList() {
    this.purchaseOrders = undefined;
    this._http.post(Config.SERVICE_IDENTIFIER.fetchPurchaseOrders, {}).subscribe((response) => {
      if (response.status === true) {
        this.purchaseOrders = response.data.tableData;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  linkPurchaseOrder() {
    const inputJSON = {
      poNumber: this.selectedPO.poNumber,
      purchaseOrderId: this.selectedPO.purchaseOrderId,
      ticketId: this.linkTicket.ticketId
    };
    this._http.post(Config.SERVICE_IDENTIFIER.linkPurchaseOrder, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'P.O Linked successfully');
        this.fetchTicketList(this.ticketStatus);
      } else {
        this.toastr.error('', response.message || 'Couldnt link P.O');
      }
    });
  }
  checkEditAvailability() {
    if (this.userRole === 'manager') {
      if (this.ticketStatus.ticketStatus === 'submitted' ||
        this.ticketStatus.ticketStatus === 'waitingReadiness' || this.ticketStatus.ticketStatus === 'visitScheduled') {
        return true;
      }
    }
    return false;
  }
  isManagerLogin() {
    return (this.userRole === 'manager');
  }
  editSiteVisit(visitDetails) {
    this._router.navigate(['schedule-site-visit/', visitDetails.ticketId]);
  }
  fetchTicketList(ticketStatus) {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_LIST, ticketStatus).subscribe((response) => {
      if (response.status === true) {
        this.ticketList = response.data.tableData;
        this.ticketListTable = {
          ...this.ticketListTable,
          tableData: response.data.tableData,
        };
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
    if ((this.ticketStatus.ticketStatus === 'submitted' ||
      this.ticketStatus.ticketStatus === 'waitingReadiness' ||
      this.ticketStatus.ticketStatus === 'visitScheduled') && this.userRole === 'manager') {
      this._router.navigate(['ticket-list/ticket-workflow', body.ticketId]);
    } else if (this.userRole === 'manager') {
      this._router.navigate(['ticket-list/ticket-details', body.ticketId]);
    } else if (this.userRole === 'siteEngineer' &&
      (this.ticketStatus.ticketStatus === 'visitScheduled' || this.ticketStatus.ticketStatus === 'onSite')) {
      this._router.navigate(['ticket-list/engineer-ticket', body.ticketId]);
    } else {
      this._router.navigate(['ticket-list/ticket-details', body.ticketId]);
    }
  }
  changeTab(tab) {
    this.ticketStatus.ticketStatus = tab;
    if (this.userRole === 'manager') {
      if (this.ticketStatus.ticketStatus === 'submitted' ||
        this.ticketStatus.ticketStatus === 'waitingReadiness' || this.ticketStatus.ticketStatus === 'visitScheduled') {
        const edit = {
          action: 'edit',
          label: 'Edit',
          type: 'edit',
          onlyIcon: true,
          icon: 'fa fa-pencil-alt',
        };
        const remove = {
          action: 'delete',
          label: 'Delete',
          type: 'delete',
          onlyIcon: true,
          icon: 'fa fa-trash-alt',
        };
        this.ticketListTable.tableActions.actions.splice(0, 2, edit, remove);
      } else {
        this.ticketListTable.tableActions.actions.splice(0, 2);
      }
    }
    this.fetchTicketList(this.ticketStatus);
  }

  getDateTimeForExport() {
    const d = new Date();
    const dformat = [
      d.getDate(),
      d.getMonth() + 1,
      d.getFullYear()].join('-') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }

  exportToExcel() {
    const tabName = this.exportName[this.ticketStatus.ticketStatus] || this.ticketStatus.ticketStatus;
    this._http.downloadExcel(this.ticketListTable.tableData, tabName + ' Tickets(' + this.getDateTimeForExport() + ')');
  }
  generatePO(row) {
    const encoded = window.btoa(JSON.stringify(row));
    const route = 'manage-po/' + row.ticketId + '/' + encoded;
    this._router.navigate([route]);
  }
  goToPODetails(row) {
    this._router.navigate(['manage-purchase-order/' + row.purchaseOrderId]);
  }
  openLinkPopup(row) {
    this.linkTicket = row;
    this.modalService.open(this.linkPoPopup).result.then((result) => {
    }, (reason) => {
    });
  }




  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchTicketList(this.ticketStatus);
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.editSiteVisit(event.data);
          break;
        case 'delete':
          this.deleteTicketConfirmation(event.data);
          break;
        case 'cellClick':
          if (event.cellKey === 'ticketId') {
            this.navigateToTicket(event.data);
          } else if (event.cellKey === 'poNumber') {
            if (event.data.purchaseOrderId === null) {
              this.openLinkPopup(event.data);
            } else {
              this.goToPODetails(event.data);
            }
          }
          break;
        case 'download':
          this.exportToExcel();
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  reloadTable() {
    try {
      this.tableReloadSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }

}

