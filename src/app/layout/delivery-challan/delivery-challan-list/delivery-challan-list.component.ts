import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-delivery-challan-list',
  templateUrl: './delivery-challan-list.component.html',
  styleUrls: ['./delivery-challan-list.component.scss']
})
export class DeliveryChallanListComponent implements OnInit {

  @ViewChild('exportPopup') exportPopup;

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();
  private tableDCDetailsReloadSubject: Subject<boolean> = new Subject<boolean>();
  private tableDispatchReloadSubject: Subject<boolean> = new Subject<boolean>();

  public deleteChallanId;
  // public DCList;
  public showConfirmation = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public dcStatus = 'Active';
  public tabList = [
    { value: 'Active', label: 'Active', icon: 'fas fa-inbox' },
    { value: 'Approved', label: 'Approved', icon: 'far fa-check-circle' }
  ];


  public deliveryChallanTable = {
    tableActions: {
      actions: [],
      enableActions: true,
      externalActions: [
        {
          action: 'addnew',
          label: 'Add Delivery Challan',
          type: 'addnew',
          icon: 'fa fa-plus',
        },
        {
          action: 'refresh',
          label: 'Refresh',
          type: 'refresh',
          icon: 'fa fa-refresh',
        }
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
        height: 'calc(100vh - 330px)',
      },
      columnFilter: {
        show: true,
        minimumColumns: 2,
        defaultColumnsToDisplay: [
          {
            key: 'challanNo',
            label: 'Challan No',
          },
          {
            key: 'poNumber',
            label: 'PO No',
          },
          {
            key: 'poDate',
            label: 'PO Date',
          },
          {
            key: 'siteName',
            label: 'Site Name',
          },
          {
            key: 'companyPanNo',
            label: 'Pan No',
          },
          {
            key: 'companyGstNo',
            label: 'GST No',
          },
        ],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['challanNo']
    },
  };
  public deliveryChallanDetailsTable = {
    tableActions: {
      actions: [],
      enableActions: true,
      externalActions: [
        {
          action: 'refreshDeliveryChallan',
          label: 'Refresh',
          type: 'refreshDeliveryChallan',
          icon: 'fa fa-refresh',
        },
        {
          action: 'export',
          label: 'Export',
          type: 'export',
          icon: 'fa fa-download',
        }
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
        challanNo: {
          customColumnClass: 'min-table-width',
        },
        poNumber: {
          customColumnClass: 'min-table-width',
        },
        deliveryDate: {
          customColumnClass: 'min-width-date',
        },
        poDate: {
          customColumnClass: 'min-width-date',
        },
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['challanNo']
    }
  };
  public dispatchDetailsChallanTable = {
    tableActions: {
      actions: [
      ],
      enableActions: true,
      externalActions: [
        {
          action: 'refreshDispatchChallan',
          label: 'Refresh',
          type: 'refreshDispatchChallan',
          icon: 'fa fa-refresh',
        },
        {
          action: 'export',
          label: 'Export',
          type: 'export',
          icon: 'fa fa-download',
        }
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
        challanNo: {
          customColumnClass: 'min-table-width',
        },
        poNumber: {
          customColumnClass: 'min-table-width',
        },
        carrier: {
          customColumnClass: 'min-table-width',
        },
        docketNumber: {
          customColumnClass: 'min-table-width',
        },
        dispatchDate: {
          customColumnClass: 'min-width-date',
        },
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['challanNo']
    }
  };

  public activeTab = 'deliveryChallan';
  public showEmptyData = false;
  public fieldList = [
    {
      key: 'deliveryDate',
      label: 'Delivery Date'
    },
    {
      key: 'dispatchDate',
      label: 'Dispatch Date'
    },
  ];
  public exportDetails = {
    field: 'deliveryDate',
    startDate: '',
    endDate: ''
  };

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private session: SessionService,
  ) {
    this.route.params.subscribe(params => {
      this.activeTab = params.type ? (params.type !== 'list' ? params.type : 'deliveryChallan') : 'deliveryChallan';
    });
  }

  ngOnInit() {
    if (this.dcStatus === 'Active') {
      this.deliveryChallanTable.tableActions.actions.push(
        {
          action: 'edit',
          label: 'Edit',
          type: 'edit',
          onlyIcon: true,
          icon: 'fa fa-pencil-alt',
        },
        {
          action: 'delete',
          label: 'Delete',
          type: 'delete',
          onlyIcon: true,
          icon: 'fa fa-trash-alt',
        },
      );
    }
    switch (this.activeTab) {
      case 'deliveryChallan':
        this.fetchDCList(this.dcStatus);
        break;
      case 'deliveryChallanDetails':
        this.loadDCDetails();
        break;
      case 'dispatchDetails':
        this.loadDispatchDetails();
        break;
      default:
        this.fetchDCList(this.dcStatus);
        break;
    }
  }

  fetchDCList(status) {
    try {
      const payLoad = { dcStatus: status };
      this.showEmptyData = false;
      this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_LIST, payLoad).subscribe((response) => {
        if (response.status === true && response.data) {
          this.showEmptyData = false;
          this.deliveryChallanTable = {
            ...this.deliveryChallanTable,
            tableData: response.data.tableData,
          };
        } else {
          this.showEmptyData = true;
          this.toastr.error('', response.message);
        }
      }, err => {
        this.showEmptyData = true;
        console.log(err);
      });
    } catch (error) {
      this.showEmptyData = true;
      console.log(error);
    }
  }
  loadDCDetails() {
    try {
      const payLoad = {
        type: 'deliveryChallanDetails'
      };
      this.showEmptyData = false;
      this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_DETAILS_LIST, payLoad).subscribe((response) => {
        if (response.status === true && response.data) {
          this.showEmptyData = false;
          this.deliveryChallanDetailsTable = {
            ...this.deliveryChallanDetailsTable,
            tableData: response.data.tableData,
          };
        } else {
          this.showEmptyData = true;
          this.toastr.error('', response.message);
        }
      }, err => {
        this.showEmptyData = true;
        console.log(err);
      });
    } catch (error) {
      this.showEmptyData = true;
      console.log(error);
    }
  }
  loadDispatchDetails() {
    try {
      const payLoad = {
        type: 'dispatchDetails'
      };
      this.showEmptyData = false;
      this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_DETAILS_LIST, payLoad).subscribe((response) => {
        if (response.status === true && response.data) {
          this.showEmptyData = false;
          this.dispatchDetailsChallanTable = {
            ...this.dispatchDetailsChallanTable,
            tableData: response.data.tableData,
          };
        } else {
          this.showEmptyData = true;
          this.toastr.error('', response.message);
        }
      }, err => {
        this.showEmptyData = true;
        console.log(err);
      });
    } catch (error) {
      this.showEmptyData = true;
      console.log(error);
    }
  }
  deleteChallanService() {
    try {
      const postJson = {
        deliveryChallanId: this.deleteChallanId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.DELETE_DC, postJson).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', 'Challan Deleted Successfully');
          this.fetchDCList(this.dcStatus);
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  actionPerformed(event) {
    try {
      if (event.action) {
        if (this.confirmJson.type === 'delete_challan') {
          this.deleteChallanService();
        }
      }
      this.showConfirmation = false;
    } catch (error) {
      console.log(error);
    }
  }

  addDeliveryChallan() {
    this.router.navigate(['delivery-Challan/add', this.activeTab]);
  }
  deleteDC(challanId) {
    this.deleteChallanId = challanId;
    this.confirmJson.type = 'delete_challan';
    this.confirmJson.title = 'Delete Challan';
    this.confirmJson.message = 'Are you sure you want to delete this Challan?';
    this.showConfirmation = true;
  }
  editDC(challanId) {
    this.router.navigate(['delivery-Challan/edit', challanId, this.activeTab]);
  }

  changeTab(tab) {
    this.dcStatus = tab;
    this.fetchDCList(this.dcStatus);
    if (this.dcStatus === 'Active') {
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
      this.deliveryChallanTable.tableActions.actions.splice(0, 2, edit, remove);
    }
    if (this.dcStatus === 'Approved') {
      const view = {
        action: 'view',
        label: 'View',
        type: 'view',
        onlyIcon: true,
        icon: 'fa fa-eye',
      };
      this.deliveryChallanTable.tableActions.actions.splice(0, 2, view);
    }
  }

  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          if (this.activeTab === 'deliveryChallan') {
            this.fetchDCList(this.dcStatus);
          } else if (this.activeTab === 'deliveryChallanDetails') {
            this.loadDCDetails();
          } else  {
            this.loadDispatchDetails();
          }
          break;
        case 'addnew':
          this.addDeliveryChallan();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'export':
          this.openPopupExport();
          break;
        case 'refreshDeliveryChallan':
          this.reloadDCDetails();
          break;
        case 'refreshDispatchChallan':
          this.reloadDispatchDetails();
          break;
        case 'edit':
          this.editDC(event.data.deliveryChallanId);
          break;
        case 'delete':
          this.deleteDC(event.data.deliveryChallanId);
          break;
        case 'cellClick':
          this.editDC(event.data.deliveryChallanId);
          break;
        case 'view':
          this.editDC(event.data.deliveryChallanId);
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
  reloadDCDetails() {
    try {
      this.tableDCDetailsReloadSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }
  reloadDispatchDetails() {
    try {
      this.tableDispatchReloadSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }

  changeMainTab(event) {
    try {
      if (!event || this.activeTab === event) { return; }
      this.activeTab = event;
      switch (this.activeTab) {
        case 'deliveryChallan':
          this.fetchDCList(this.dcStatus);
          break;
        case 'deliveryChallanDetails':
          this.loadDCDetails();
          break;
        case 'dispatchDetails':
          this.loadDispatchDetails();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  openPopupExport() {
    try {
      this.modalService.open(this.exportPopup, {
        size: 'lg',
        windowClass: 'product-modal',
      }).result.then((result) => {
      }, (reason) => {
      });
    } catch (error) {
      console.log(error);
    }
  }

  exportDataPost() {
    try {
      const payLoad = this.exportDetails;
      this.http.post(Config.SERVICE_IDENTIFIER.DC_EXPORT_POST, payLoad).subscribe((response) => {
        if (response.status === true && response.data) {
          this.exportData(response.data);
        } else {
          this.toastr.error('', response.message);
        }
      }, err => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }

  exportData(fileName) {
    try {
      if (!fileName) { return; }
      const url = Config.SERVICE_IDENTIFIER.DC_EXPORT + '/' + fileName;
      window.open(url, '_blank');
    } catch (error) {
      console.log(error);
    }
  }

  endDateValidation() {
    try {
      if (this.exportDetails.endDate && this.exportDetails.startDate > this.exportDetails.endDate) {
        this.exportDetails.endDate = '';
      }
    } catch (error) {
      console.log(error);
    }
  }

}
