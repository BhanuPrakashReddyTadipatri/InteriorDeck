import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-materials-management',
  templateUrl: './materials-management.component.html',
  styleUrls: ['./materials-management.component.scss']
})
export class MaterialsManagementComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();

  @ViewChild('manageMaterialPopup') manageMaterialPopup;
  @ViewChild('productInventoryDetailsPopup') productInventoryDetailsPopup;
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
  public materialList = [];
  public matTableData: any = [];
  public matRow = {
    materialCode: '',
    materialName: '',
    quantity: '',
    new: false
  };
  public showConfirmation = false;
  public filterTickets: any;
  public materialsList = [];
  public selectedMaterial: any = {
    new: false
  };
  public ticketStatus = {
    ticketStatus: 'Approved'
  };
  public searchKeys: any = ['materialName', 'deviceId', 'status', 'lastUpdatedBy', 'lastUpdatedTime'];
  public userRole;
  public ticketIdToDelete = undefined;
  public tabList = [
    { value: 'Approved', label: 'Approved', icon: 'fas fa-inbox' },
    { value: 'Unapproved', label: 'Waiting Approval', icon: 'far fa-clock' }];

  public exportName = {
    Approved: 'Approved',
    Unapproved: 'Waiting Approval'
  };
  public deviceTypesList: any = [
    { label: 'GLens', value: 'GLens' },
    { label: 'GLens Labs', value: 'GLens Labs' }
  ];


  public materialsTable = {
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
      columnOptions: {
        minPrice: {
          customColumnClass: 'center-aligned',
        },
        maxPrice: {
          customColumnClass: 'center-aligned',
        },
        quantity: {
          customColumnClass: 'center-aligned min-table-width',
        },
        materialCode: {
          customColumnClass: 'min-table-width',
        },
        deviceType: {
          customColumnClass: 'min-table-width',
        },
        lastUpdatedBy: {
          customColumnClass: 'min-table-width',
        },
        lastUpdatedTime: {
          customColumnClass: 'min-table-width-200',
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
      list: ['materialName']
    }
  };

  public prodDetails = {
    tableData: {
      headerContent: [],
      bodyContent: [],
    },
    materialName: '',
    initialStock: '',
    currentStock: ''
  };

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private session: SessionService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.userRole = this.session.api.local.get(Config.USER_ROLE);

    if ((this.userRole === 'manager') || (this.userRole === 'accounts')) {
      const edit = {
        action: 'edit',
        label: 'Edit',
        type: 'edit',
        onlyIcon: true,
        icon: 'fa fa-pencil-alt',
      };
      this.materialsTable.tableActions.actions.splice(1, 0, edit);
    }
    const history = {
      action: 'history',
      label: 'Product History',
      type: 'history',
      onlyIcon: true,
      icon: 'fa fa-history',
    };
    this.materialsTable.tableActions.actions.push(history);

    // if ((this.userRole === 'manager') && (this.ticketStatus.ticketStatus === 'Unapproved')) {
    //   const view = {
    //     action: 'approve',
    //     label: 'Approve',
    //     type: 'approve',
    //     onlyIcon: true,
    //     icon: 'fa fa-check-circle',
    //   };
    //   this.materialsTable.tableActions.actions.splice(1, 0, view);
    // }

    this.fetchAllMaterials(this.ticketStatus);
    // this.fetchMaterialsList();
  }
  checkEditAvailability() {
    if ((this.userRole === 'manager') || (this.userRole === 'accounts')) {
      if (this.ticketStatus.ticketStatus === 'Approved' || this.ticketStatus.ticketStatus === 'Unapproved') {
        return true;
      }
    }
    return false;
  }
  isManagerLogin() {
    return (this.userRole === 'manager');
  }
  editMaterial(material) {
    this.selectedMaterial.quantity = null;
    this.selectedMaterial = JSON.parse(JSON.stringify(material));
    this.openPopup();
  }
  fetchAllMaterials(ticketStatus) {
    this.materialsList = undefined;
    this.http.post(Config.SERVICE_IDENTIFIER.listAllMaterials, ticketStatus).subscribe((response) => {
      if (response.status === true) {
        this.materialsList = response.data.tableData;
        this.materialsTable = {
          ...this.materialsTable,
          tableData: response.data.tableData,
        };
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteMaterial() {
    const postJson = this.ticketIdToDelete;
    this.http.post(Config.SERVICE_IDENTIFIER.deleteMaterial, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Material deleted successfully');
        this.fetchAllMaterials(this.ticketStatus);
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteMaterialConfirmation(bodySubscript) {

    this.ticketIdToDelete = bodySubscript;
    this.confirmJson.type = 'deleteMaterial';
    this.confirmJson.title = 'Delete Material';
    this.confirmJson.message = 'Are you sure you want to delete the material?';
    this.showConfirmation = true;
  }
  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'deleteMaterial') {
        this.deleteMaterial();
      } else if (this.confirmJson.type === 'approveMaterial') {
        this.approveMaterial();
      }
    }
    this.showConfirmation = false;
  }
  changeFilter() {
    this.fetchAllMaterials(this.ticketStatus);
  }

  navigateToTicket(body) {
    if ((this.ticketStatus.ticketStatus === 'Approved' ||
      this.ticketStatus.ticketStatus === 'Unapproved' ||
      this.ticketStatus.ticketStatus === 'visitScheduled') && this.userRole === 'manager') {
      this.router.navigate(['ticket-list/ticket-workflow', body.ticketId]);
    } else if (this.userRole === 'manager') {
      this.router.navigate(['ticket-list/ticket-details', body.ticketId]);
    } else if (this.userRole === 'siteEngineer' &&
      (this.ticketStatus.ticketStatus === 'visitScheduled' || this.ticketStatus.ticketStatus === 'onSite')) {
      this.router.navigate(['ticket-list/engineer-ticket', body.ticketId]);
    } else {
      this.router.navigate(['ticket-list/ticket-details', body.ticketId]);
    }
  }
  changeTab(tab) {
    this.ticketStatus.ticketStatus = tab;
    this.fetchAllMaterials(this.ticketStatus);
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
    this.http.downloadExcel(this.materialsList, tabName + ' Tickets(' + this.getDateTimeForExport() + ')');
  }
  approveMaterialConfirmation(bodySubscript) {
    this.selectedMaterial = bodySubscript;
    this.confirmJson.type = 'approveMaterial';
    this.confirmJson.title = 'Approve Material';
    this.confirmJson.message = 'Are you sure you want to approve the material?';
    this.showConfirmation = true;
  }

  approveMaterial() {
    const postJson = this.selectedMaterial;
    this.http.post(Config.SERVICE_IDENTIFIER.approveMaterial, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Material approved successfully');
        this.fetchAllMaterials(this.ticketStatus);
      } else {
        this.toastr.error('Error', response.message);
      }
    });
  }

  addNewMaterialPopup() {
    this.editMaterial({ new: true });
  }

  openPopup() {
    this.modalService.open(this.manageMaterialPopup, {
      size: 'lg',
    }).result.then((result) => {
    }, (reason) => {
    });
  }

  getInventoryDetails(data) {
    try {
      const inputJSON = JSON.parse(JSON.stringify(data));
      this.http.post(Config.SERVICE_IDENTIFIER.loadProductDetails, inputJSON).subscribe((response) => {
        if (response.status && response.data) {
          this.prodDetails.tableData = response.data.tableData;
          if (response.data.meta) {
            this.prodDetails.materialName = response.data.meta.materialName;
            this.prodDetails.initialStock = response.data.meta.initialStock;
            this.prodDetails.currentStock = response.data.meta.currentStock;
          }
          this.openPopupInventoryDetails();
        } else {
          this.toastr.error('', response.message || 'Failed to get product inventory details');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openPopupInventoryDetails() {
    this.modalService.open(this.productInventoryDetailsPopup, {
      size: 'lg',
      windowClass: 'product-modal',
    }).result.then((result) => {
    }, (reason) => {
    });
  }

  saveMaterial() {
    // const inputJSON = {
    //   type: (!this.selectedMaterial.new ? 'update' : 'add'),
    //   bodyContent: this.selectedMaterial // this.matTableData
    // };
    const inputJSON = JSON.parse(JSON.stringify(this.selectedMaterial));
    this.http.post(Config.SERVICE_IDENTIFIER.saveProductQuantity, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', response.message || 'Product Quantity Updated Successfully');
        this.fetchAllMaterials(this.ticketStatus);
      } else {
        this.toastr.error('', response.message || 'Failed to updare product quantity');
      }
    });
  }

  fetchMaterialsList() {
    const inputJSON = { ticket_type: 'GLens' }; // 'All'
    this.http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.materialList = response.data;
      }
    });
  }
  addMaterialRow() {
    this.matRow = {
      materialCode: '',
      materialName: '',
      quantity: '1',
      new: true
    };
    this.matTableData.unshift(this.matRow);
  }
  selectMaterial(row, idx) {
    const materialCode = this.materialList.filter(x => {
      if (x.name === row.materialName) {
        row.isDeviceId = (x.isDeviceId) ? true : false;
        this.matTableData[idx].isDeviceId = (x.isDeviceId) ? true : false;
        return true;
      }
    })[0].id;
    if (this.matTableData.some(material => ((material.materialName === materialCode) && (material.materialName !== 'others')))) {
      this.toastr.error('', 'Material already selected..!');
      row.materialCode = null;
      row.materialName = null;
    } else {
      row.materialCode = materialCode;
    }

  }
  deleteMaterialRow(index) {
    this.matTableData.splice(index, 1);
    this.matRow = {
      materialCode: '',
      materialName: '',
      quantity: '',
      new: false
    };
  }
  saveMaterialRow(row) {
    row.new = false;
  }
  editMaterialRow(row) {
    row.new = true;
  }
  get matInAdd() {
    return this.matTableData.some(x => x.new === true);
  }



  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event.action.type) {
        case 'fetchData':
          this.fetchAllMaterials(this.ticketStatus);
          break;
        case 'addnew':
          this.addNewMaterialPopup();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.editMaterial(event.data);
          break;
        case 'delete':
          this.deleteMaterialConfirmation(event.data);
          break;
        case 'cellClick':
          this.editMaterial(event.data);
          // this.getInventoryDetails(event.data);
          break;
        case 'history':
          this.getInventoryDetails(event.data);
          break;
        case 'download':
          this.exportToExcel();
          break;
        case 'approve':
          this.approveMaterialConfirmation(event.data);
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
