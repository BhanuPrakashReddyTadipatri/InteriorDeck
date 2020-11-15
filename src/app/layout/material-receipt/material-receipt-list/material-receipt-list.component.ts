import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-material-receipt-list',
  templateUrl: './material-receipt-list.component.html',
  styleUrls: ['./material-receipt-list.component.scss']
})
export class MaterialReceiptListComponent implements OnInit {

  private materialReceiptSubject: Subject<boolean> = new Subject<boolean>();

  public materialReceiptTable = {
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
          label: 'Add Receipt',
          type: 'addnew',
          icon: 'fa fa-plus',
        },
        {
          action: 'refresh',
          label: 'Refresh',
          type: 'refresh',
          icon: 'fa fa-refresh',
        },
      ],
      columnOptions: {
        productCount: {
          customColumnClass: 'center-aligned min-width-date',
        },
        productQuantity: {
          customColumnClass: 'center-aligned min-width-date',
        },
        materialReceiptId: {
          customColumnClass: 'min-width-date',
        },
        repairReceiptId: {
          customColumnClass: 'min-width-date',
        },
        purchaseDate: {
          customColumnClass: 'min-width-date',
        },
        lastUpdatedBy: {
          customColumnClass: 'min-table-width-request-by',
        },
        lastUpdatedTime: {
          customColumnClass: 'min-table-width-request-by',
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
        height: 'calc(100vh - 330px)',
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
      list: ['materialReceiptId', 'repairReceiptId'],
    },
  };
  public showConfirmation = false;
  public confirmJson = {
    messageContent: '',
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  ticketIdToDelete: any;
  public mrStatus: any = 'active';
  public activeTab = 'materialReceipt';
  public statusList = [
    {
      key: 'pending',
      label: 'Pending'
    },
    {
      label: 'In Progress',
      key: 'inProgress'
    },
    {
      key: 'returned',
      label: 'Returned'
    },
    {
      key: 'disposed',
      label: 'Disposed'
    },
  ];
  public status = 'pending';

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe(params => {
      this.activeTab = params.type ? (params.type !== 'list' ? params.type : 'materialReceipt') : 'materialReceipt';
      if (this.activeTab === 'materialReceipt') {
        this.mrStatus = params.innerTab ? (params.innerTab !== 'list' ? params.innerTab : 'active') : 'active';
      } else {
        this.status = params.innerTab ? (params.innerTab !== 'list' ? params.innerTab : 'pending') : 'pending';
      }
    });
  }

  ngOnInit() {
    if (this.activeTab === 'materialReceipt') {
      this.fetchReceiptList();
    } else {
      this.fetchRepairReceiptList();
    }
  }

  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      const eventObj = JSON.parse(JSON.stringify(event));
      switch (eventObj.action.type) {
        case 'fetchData':
          if (this.activeTab === 'materialReceipt') {
            this.fetchReceiptList();
          } else {
            this.fetchRepairReceiptList();
          }
          break;
        case 'addnew':
          if (this.activeTab === 'materialReceipt') {
            this.addMaterialReceipt();
          } else {
            this.addRepairReceipt();
          }
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          if (this.activeTab === 'materialReceipt') {
            this.editMaterialReceipt(eventObj.data.materialReceiptId);
          } else {
            this.editRepairReceipt(eventObj.data.repairReceiptId);
          }
          break;
        case 'view':
          if (this.activeTab === 'materialReceipt') {
            this.viewMaterialReceipt(eventObj.data.materialReceiptId);
          } else {
            this.viewRepairReceipt(eventObj.data.repairReceiptId);
          }
          break;
        case 'delete':
          this.deleteReceipt(eventObj.data);
          break;
        case 'cellClick':
          if (this.activeTab === 'materialReceipt') {
            if (this.mrStatus === 'active') {
              this.editMaterialReceipt(eventObj.data.materialReceiptId);
            } else {
              this.viewMaterialReceipt(eventObj.data.materialReceiptId);
            }
          } else {
            if (this.status === 'pending' || this.status === 'inProgress') {
              this.editRepairReceipt(eventObj.data.repairReceiptId);
            } else {
              this.viewRepairReceipt(eventObj.data.repairReceiptId);
            }
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  editMaterialReceipt(receiptId: any) {
    this.router.navigate(['receipts/edit-material-receipt', 'materialReceipt', this.mrStatus, 'edit', receiptId]);
  }
  viewMaterialReceipt(receiptId: any) {
    this.router.navigate(['receipts/edit-material-receipt', 'materialReceipt', this.mrStatus, 'view', receiptId]);
  }
  addMaterialReceipt() {
    this.router.navigate(['receipts/add-material-receipt', 'materialReceipt', this.mrStatus]);
  }

  editRepairReceipt(receiptId: any) {
    this.router.navigate(['receipts/edit-repair-receipt', 'repairReceipt', this.status, 'edit', receiptId]);
  }
  viewRepairReceipt(receiptId: any) {
    this.router.navigate(['receipts/edit-repair-receipt', 'repairReceipt', this.status, 'view', receiptId]);
  }
  addRepairReceipt() {
    this.router.navigate(['receipts/add-repair-receipt', 'repairReceipt', this.status]);
  }

  reloadTable() {
    try {
      this.materialReceiptSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }

  fetchReceiptList() {
    try {
      this.materialReceiptTable.tableActions.actions = [];
      if (this.mrStatus === 'active') {
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
        this.materialReceiptTable.tableActions.actions.splice(0, 1, edit, remove);
        this.materialReceiptTable.clickableColumns.list = ['materialReceiptId'];
      }
      if (this.mrStatus === 'approved') {
        const view = {
          action: 'view',
          label: 'View',
          type: 'view',
          onlyIcon: true,
          icon: 'fa fa-eye',
        };
        this.materialReceiptTable.tableActions.actions.splice(0, 2, view);
        // this.materialReceiptTable.clickableColumns.list = [];
      }
      const inputJSON = {
        status: this.mrStatus,
      };
      this.materialReceiptTable.tableData.bodyContent = [];
      this.materialReceiptTable.tableData.headerContent = [];
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_MATERIAL_LIST, inputJSON).subscribe((response) => {
        if (response.status === true) {
          this.materialReceiptTable = {
            ...this.materialReceiptTable,
            tableData: response.data.tableData,
          };
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchRepairReceiptList() {
    try {
      this.materialReceiptTable.tableActions.actions = [];
      if (this.status === 'pending' || this.status === 'inProgress') {
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
        this.materialReceiptTable.tableActions.actions.splice(0, 1, edit, remove);
        this.materialReceiptTable.clickableColumns.list = ['repairReceiptId'];
      } else {
        const view = {
          action: 'view',
          label: 'View',
          type: 'view',
          onlyIcon: true,
          icon: 'fa fa-eye',
        };
        this.materialReceiptTable.tableActions.actions.splice(0, 2, view);
      }
      const inputJSON = {
        status: this.status,
      };
      this.materialReceiptTable.tableData.bodyContent = [];
      this.materialReceiptTable.tableData.headerContent = [];
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_REPAIR_LIST, inputJSON).subscribe((response) => {
        if (response.status === true) {
          this.materialReceiptTable = {
            ...this.materialReceiptTable,
            tableData: response.data.tableData,
          };
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteReceipt(product) {
    this.ticketIdToDelete = product;
    this.confirmJson.type = 'deleteReceipt';
    this.confirmJson.messageContent = this.activeTab === 'materialReceipt' ? `${product.materialReceiptId} ?` : `${product.repairReceiptId} ?`;
    this.confirmJson.title = 'Delete Receipt';
    this.confirmJson.message = `Are you sure you want to delete the Receipt -`;
    this.showConfirmation = true;
  }

  actionPerformed(event) {
    try {
      this.showConfirmation = false;
      // SAVE_VENDOR_DETAILS
      if (!event.action) {
        return;
      }
      if (this.activeTab === 'materialReceipt') {
        this.http.post(Config.SERVICE_IDENTIFIER.DELETE_MATERIAL_RECEIPT, this.ticketIdToDelete).subscribe((response) => {
          if (response.status === true) {
            this.toastr.success('', response.message || 'Material receipt deleted successfully');
            this.reloadTable();
          } else {
            this.toastr.error('', response.message || 'Failed to delete material receipt');
          }
        });
      } else {
        this.http.post(Config.SERVICE_IDENTIFIER.DELETE_REPAIR_RECEIPT, this.ticketIdToDelete).subscribe((response) => {
          if (response.status === true) {
            this.toastr.success('', response.message || 'Repair receipt deleted successfully');
            this.reloadTable();
          } else {
            this.toastr.error('', response.message || 'Failed to delete repair receipt');
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  changeTab(tab) {
    if (this.activeTab === 'materialReceipt') {
      if (this.mrStatus === tab) {
        return;
      }
      this.mrStatus = tab;
      this.fetchReceiptList();
    } else {
      if (this.status === tab) {
        return;
      }
      this.status = tab;
      this.fetchRepairReceiptList();
    }
  }
  changeMainTab(event) {
    try {
      if (!event || this.activeTab === event) { return; }
      this.activeTab = event;
      switch (this.activeTab) {
        case 'materialReceipt':
          this.mrStatus = 'active';
          this.fetchReceiptList();
          break;
        case 'repairReceipt':
          this.status = 'pending';
          this.fetchRepairReceiptList();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

}
