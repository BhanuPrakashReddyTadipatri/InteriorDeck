import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();

  public deleteUserId;
  public purchaseOrders;
  public showConfirmation = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public selectedPO: any;
  public poStatus: any = 'Active';
  public tabList = [
    { value: 'Active', label: 'Active', icon: 'fas fa-inbox' },
    { value: 'Completed', label: 'Completed', icon: 'far fa-check-circle' }
  ];

  public poListTable = {
    tableActions: {
      actions: [
        {
          action: 'edit',
          label: 'Edit',
          type: 'edit',
          onlyIcon: true,
          icon: 'fa fa-pencil-alt',
        },
        {
          action: 'cancel',
          label: 'Cancel',
          type: 'cancel',
          onlyIcon: true,
          icon: 'fa fa-ban',
        },
        {
          action: 'delete',
          label: 'Delete',
          type: 'delete',
          onlyIcon: true,
          icon: 'fa fa-trash-alt',
        },
      ],
      enableActions: true,
      externalActions: [
        {
          action: 'addnew',
          label: 'Add P.O',
          type: 'addnew',
          icon: 'fa fa-plus',
        },
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
      columnOptions: {
        poStatus: {
          customColumnClass: 'center-aligned',
          spanStyles: true,
          valueAsClass: true
        },
        poNumber: {
          innerHtml: true,
          tdStyles: true
        },
      },
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
      class: 'text-decoration-underline',
      list: ['poNumber']
    }
  };

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.fetchPurchaseOrdersList(this.poStatus);
  }

  fetchPurchaseOrdersList(status) {
    this.http.post(Config.SERVICE_IDENTIFIER.fetchPurchaseOrders, { poStatus: status }).subscribe((response) => {
      if (response.status === true) {
        this.updateTableBodyContent(response.data);
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteUserService() {
    const postJson = {
      purchaseOrderId: this.selectedPO.purchaseOrderId
    };
    this.http.post(Config.SERVICE_IDENTIFIER.deletePurchaseOrder, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'P.O deleted successfully');
        this.fetchPurchaseOrdersList(this.poStatus);
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'delete_po') {
        this.deleteUserService();
      } else if (this.confirmJson.type === 'cancelPurchaseOrder') {
        this.cancelPurchaseOrder(this.selectedPO);
      }
    }
    this.showConfirmation = false;
  }

  addPO() {
    this.router.navigate(['manage-purchase-order']);
  }
  deletePurchaseOrder(bodySubscript) {
    this.selectedPO = bodySubscript;
    this.confirmJson.type = 'delete_po';
    this.confirmJson.title = 'Delete Purchase Order';
    this.confirmJson.message = 'Are you sure you want to delete this Purchase Order?';
    this.showConfirmation = true;
  }
  cancelPOConfirmation(bodySubscript) {
    this.selectedPO = bodySubscript;
    this.confirmJson.type = 'cancelPurchaseOrder';
    this.confirmJson.title = 'Cancel Purchase Order';
    this.confirmJson.message = 'Are you sure you want to cancel the Purchase Order?';
    this.showConfirmation = true;
  }
  editPurchaseOrder(bodySubscript) {
    this.router.navigate(['manage-purchase-order', bodySubscript.purchaseOrderId]);
  }
  cancelPurchaseOrder(bodySubscript) {
    const postJson = {
      purchaseOrderId: bodySubscript.purchaseOrderId
    };
    this.http.post(Config.SERVICE_IDENTIFIER.cancelPurchaseOrder, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'P.O Cancelled successfully');
        this.fetchPurchaseOrdersList(this.poStatus);
      } else {
        this.toastr.error('', 'Error while cancelling the purchase order. Please try again later.');
      }
    });
  }
  changeTab(tab) {
    this.poStatus = tab;
    if (this.poStatus === 'Active') {
      const edit = {
        action: 'edit',
        label: 'Edit',
        type: 'edit',
        onlyIcon: true,
        icon: 'fa fa-pencil-alt',
      };
      const cancel = {
        action: 'cancel',
        label: 'Cancel',
        type: 'cancel',
        onlyIcon: true,
        icon: 'fa fa-ban',
      };
      const remove = {
        action: 'delete',
        label: 'Delete',
        type: 'delete',
        onlyIcon: true,
        icon: 'fa fa-trash-alt',
      };
      this.poListTable.tableActions.actions.splice(0, 2, edit, cancel, remove);
    }
    if (this.poStatus === 'Completed') {
      const view = {
        action: 'view',
        label: 'View',
        type: 'view',
        onlyIcon: true,
        icon: 'fa fa-eye',
      };
      this.poListTable.tableActions.actions.splice(0, 3, view);
    }
    this.fetchPurchaseOrdersList(this.poStatus);
  }
  exportToExcel() {
    const pdfData = JSON.parse(JSON.stringify(this.purchaseOrders));
    if (pdfData.bodyContent.length > 0) {
      pdfData.bodyContent.forEach(element => {
        element.clientName = element.clientName.siteName;
      });
    }
    const tabName = this.poStatus;
    this.http.downloadExcel(pdfData, tabName + ' Tickets(' + this.getDateTimeForExport() + ')');
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

  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchPurchaseOrdersList(this.poStatus);
          break;
        case 'addnew':
          this.addPO();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.editPurchaseOrder(event.data);
          break;
        case 'delete':
          this.deletePurchaseOrder(event.data);
          break;
        case 'cellClick':
          this.editPurchaseOrder(event.data);
          break;
        case 'download':
          this.exportToExcel();
          break;
        case 'cancel':
          this.cancelPOConfirmation(event.data);
          break;
        case 'view':
          this.editPurchaseOrder(event.data);
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

  updateTableBodyContent(data) {
    try {
      if (data.tableData && data.tableData.bodyContent) {
        data.tableData.bodyContent.forEach(ele => {
          if (ele && ele.clientName) {
            ele.siteName = ele.clientName.siteName;
          } else {
            ele.siteName = '';
          }
        });
        data.tableData.headerContent.forEach(ele => {
          if (ele && ele.key === 'clientName') {
            ele.key = 'siteName';
          }
        });
      }
      const tableData = Object.assign({}, data.tableData);
      this.purchaseOrders = tableData;
      this.poListTable = {
        ...this.poListTable,
        tableData,
      };
    } catch (error) {
      console.error(error);
    }
  }

}
