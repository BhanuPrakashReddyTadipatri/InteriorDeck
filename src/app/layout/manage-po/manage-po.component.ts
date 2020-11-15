import { Component, OnInit } from '@angular/core';

import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { CommuteProviderService } from 'src/app/services/commute-provider.service';
import { ToastrService } from 'ngx-toastr';
import { ActivityComponent } from '../../shared/activity/activity.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manage-po',
  templateUrl: './manage-po.component.html',
  styleUrls: ['./manage-po.component.scss']
})
export class ManagePoComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();
  public purchaseOrderId: any;
  public isRouted: any;
  public ticketList: any;
  public ticketIdToDelete = undefined;
  public tabList = [
    { value: 'poDetails', label: 'P.O Details', icon: 'fas fa-industry' }
  ];
  public getMapping: any = {
    submitted: 'Submitted',
    onSite: 'On Site',
    completed: 'Completed',
    waitingReadiness: 'Waiting Readiness',
    visitScheduled: 'Visit Scheduled'
  };
  public showConfirmation = false;
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
  public activeTab: any = 'poDetails';
  public userRole: any;
  public poForm: any = {
    materialsList: [
      {
        materialCode: '',
        materialName: null,
        quantity: '',
        status: 'To Be Ordered',
        new: true
      }
    ],
    spareMaterials: [
      {
        materialCode: '',
        materialName: null,
        quantity: '',
        status: 'To Be Ordered',
        new: true
      }
    ]
  };
  public courieredStatusList: any = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  public invoiceItems: any = [
    { label: 'Sent', value: 'Sent' },
    { label: 'Not Sent', value: 'Not Sent' }
  ];
  public guatanteeItems: any = [
    { label: 'EMD', value: 'EMD' },
    { label: 'Bank', value: 'Bank' },
    { label: 'No', value: 'No' }
  ];
  public materialsItems: any = [];
  public filterTickets: any;
  public searchKeys: any = ['siteName', 'category', 'requestedBy', 'ticketId', 'createTime', 'ticket_type'];
  public siteList: any = [];
  public carrierItems: any = [
    { label: 'DTDC', value: 'DTDC' },
    { label: 'Professional', value: 'Professional' },
    { label: 'India Post', value: 'India Post' },
    { label: 'Others', value: 'Others' }
  ];
  public matRow = {
    materialCode: '',
    materialName: null,
    quantity: '',
    status: 'To Be Ordered',
    new: false,
    courieredStatus: 'No'
  };
  public materialStatusList: any = [
    { label: 'To Be Ordered', value: 'To Be Ordered' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Dispatched', value: 'Dispatched' },
    { label: 'Delivered', value: 'Delivered' }
  ];
  public spareMaterialStatusList: any = [
    { label: 'Returned', value: 'Returned' },
    { label: 'Not Yet Returned', value: 'Not Yet Returned' }
  ];
  public poStatusList: any = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  public disableField: any = false;
  public POTypes: any = [
    { label: 'Inward Delivery Challan', value: 'inwardDC' },
    { label: 'Outward Delivery Challan', value: 'outwardDC' },
  ];
  public selectedPoType: any;
  public outwardDCTypes: any = [
    { label: 'New Customer PO', value: 'newCustomerPo', info: 'This will be new Customer PO' },
    { label: 'Spares for Engineers', value: 'sparesForEnggineers', info: 'his will have a Dummy PO per Engineer' },
    { label: 'Repair Return', value: 'repairReturn', info: 'This will be a Inward Challan No which is of " Spare Return from Site"' },
    { label: 'Demo Material', value: 'demoMaterial', info: 'This will have a Dummy Demo PO' },
    { label: 'Reconciliation', value: 'reconciliation', info: 'his will have a Dummy Stock Reconciliation PO' }
  ];
  public inwardDCTypes: any = [
    {
      label: 'Material Received for Repair',
      value: 'materialReceivedforRepair',
      info: 'This will create a new PO entry of type Repair Material. currently this functionality is not there'
    },
    {
      label: 'New Purchases',
      value: 'newPurchases',
      info: 'This will have PO which we will issue to our Vendors. currently this functionality is not there'
    },
    {
      label: 'Spare Return from Site',
      value: 'spareReturnfromSite',
      info: 'This will be booked against the engineer PO.'
    },
    {
      label: 'Reconciliation',
      value: 'reconciliation',
      info: 'This is for adding any excess material in Stock any point of time. (This will be against Stock Reconciliation PO)'
    }
  ];
  public inwardPoInfo: any;
  public outwardPoInfo: any;
  public challanDetails: any;
  public deliveryChallanTable = {
    tableActions: {
      actions: [
        {
          action: 'view',
          label: 'View',
          type: 'view',
          onlyIcon: true,
          icon: 'fa fa-eye',
        }
      ],
      enableActions: true,
      externalActions: [
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
        defaultColumnsToDisplay: [],
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

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private session: SessionService,
    public commute: CommuteProviderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.purchaseOrderId = params.id;
      this.isRouted = params.route;
    });
  }

  ngOnInit() {
    this.userRole = this.session.api.local.get(Config.USER_ROLE);
    this.fetchMaterialsList();
    this.fetchSiteList();
    if (this.purchaseOrderId) {
      this.fetchPoDetails();
      this.showTicketsList();
    }
    if (this.isRouted) {
      this.activeTab = 'ticketList';
      this.fetchPoTickets(this.purchaseOrderId);
    }
  }

  fetchPoDetails() {
    this.http.post(Config.SERVICE_IDENTIFIER.fetchPurchaseOrderDetails, { purchaseOrderId: this.purchaseOrderId }).subscribe((response) => {
      if (response.status === true) {
        this.poForm = response.data;
        this.selectedPoType = response.data['selectedPoType'];
        this.disableField = (this.poForm.poStatus !== 'Active');
      }
    });
  }

  fetchPoTickets(id) {
    const inputJSON = {
      purchaseOrderId: id
    };
    this.http.post(Config.SERVICE_IDENTIFIER.fetchPoTickets, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.ticketList = response.data.tableData;
      }
    });
  }

  fetchChallans(id) {
    const inputJSON = {
      purchaseOrderId: id
    };
    this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.deliveryChallanTable = {
          ...this.deliveryChallanTable,
          tableData: response.data.tableData,
        };
      }
    });
  }
  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchChallans(this.purchaseOrderId);
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'cellClick':
          this.editChallan(event.data);
          break;
        case 'view':
          this.editChallan(event.data);
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

  fetchMaterialsList() {
    const inputJSON = { ticket_type: 'All' };
    this.http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.materialsItems = response.data;
      }
    });
  }

  fetchSiteList() {
    const inputJSON = { ticket_type: 'All' };
    this.http.post(Config.SERVICE_IDENTIFIER.listSitesInTableFormat, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.siteList = response.data.tableData ? response.data.tableData.bodyContent : [];
      }
    });
  }

  validateDate(event, type) {
    const dateRegex = /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    const dateRegex2 = /^(0[1-9]|1\d|2\d|3[01])\-(0[1-9]|1[0-2])\-(19|20)\d{2}$/;
    if (event.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) {
      return true;
    } else if (event.match(dateRegex2)) {
      return true;
    } else if (event.match(dateRegex)) {
      return true;
    } else {
      if (type === 'P.O Date') {
        this.poForm.poDate = '';
      } else if (type === 'P.O Received date') {
        this.poForm.poReceivedDate = '';
      }
      this.toastr.warning('Please Enter A Valid' + ' ' + type);
      return false;
    }
  }

  getDisabledStatus() {
    if (this.selectedPoType === 'inwardDC' && this.poForm.inwardDCType === 'spareReturnfromSite' ||
      (this.selectedPoType === 'inwardDC' && this.poForm.inwardDCType === 'materialReceivedforRepair') ||
      (this.selectedPoType === 'outwardDC' && this.poForm.outwardDCType === 'sparesForEnggineers') ||
      (this.selectedPoType === 'outwardDC' && this.poForm.outwardDCType === 'newCustomerPo')) {
      if (!this.poForm.clientName || !this.poForm.contactPerson ||
        !this.poForm.contactNumber || !this.poForm.email ||
        !this.selectedPoType || !this.poForm.poNumber ||
        !this.poForm.poDate) {
        return true;
      }
    } else {
      if (!this.poForm.clientName || !this.poForm.contactPerson ||
        !this.poForm.contactNumber || !this.poForm.email ||
        !this.poForm.poNumber || !this.poForm.poDate || !this.poForm.poReceivedDate ||
        !this.poForm.guarantee || !this.poForm.invoiceStatus ||
        !this.poForm.materialsList || !this.selectedPoType) {
        return true;
      }
    }
    return false;
  }

  get hideMandatory() {
    return ((this.selectedPoType === 'inwardDC' && this.poForm.inwardDCType === 'spareReturnfromSite') ||
      (this.selectedPoType === 'inwardDC' && this.poForm.inwardDCType === 'materialReceivedforRepair') ||
      this.selectedPoType === 'outwardDC' && this.poForm.outwardDCType === 'sparesForEnggineers') ||
      (this.selectedPoType === 'outwardDC' && this.poForm.outwardDCType === 'newCustomerPo');
  }

  get hideTableColumns() {
    return (this.selectedPoType === 'inwardDC' && (this.poForm.inwardDCType === 'materialReceivedforRepair' ||
      this.poForm.inwardDCType === 'spareReturnfromSite' || this.poForm.inwardDCType === 'newPurchases'));
  }

  goBack() {
    this.router.navigate(['purchase-orders-list']);
  }

  saveDetails() {
    let count = 0;
    if (this.poForm.materialsList) {
      this.poForm.materialsList.forEach(material => {
        if (!material.materialName || !material.status) {
          count++;
        }
      });
    } else {
      return;
    }
    if (count) {
      this.toastr.warning('Please enter material details');
      return;
    }
    const poForm = JSON.parse(JSON.stringify(this.poForm));
    poForm['selectedPoType'] = this.selectedPoType;
    const inputJSON = { purchaseOrderId: this.purchaseOrderId, bodyContent: poForm, type: (this.purchaseOrderId ? 'update' : 'add') };
    this.http.post(Config.SERVICE_IDENTIFIER.savePurchaseOrder, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success(response.message || 'Details saved successfully');
        this.purchaseOrderId = response.data.purchaseOrderId;
        this.showTicketsList();
        this.fetchPoDetails();
      } else {
        this.toastr.error(response.message || 'Failed to save P.O details. Please try again later.');
      }
    });
  }

  addMaterialRow() {
    this.matRow = {
      materialCode: '',
      materialName: null,
      quantity: '',
      status: 'To Be Ordered',
      new: true,
      courieredStatus: 'No'
    };
    this.poForm.materialsList.unshift(this.matRow);
  }
  selectMaterial(row, idx) {
    const materialCode = this.materialsItems.filter(x => {
      if (x.name === row.materialName) {
        row.isDeviceId = (x.isDeviceId) ? true : false;
        row.stock = x.quantity;
        this.poForm.materialsList[idx].isDeviceId = (x.isDeviceId) ? true : false;
        return true;
      }
    })[0].id;
    if (this.poForm.materialsList.some(material => ((material.materialCode === materialCode) && (material.materialName !== 'others')))) {
      this.toastr.error('', 'Material already selected..!');
      row.materialCode = null;
      row.materialName = null;
    } else {
      row.materialCode = materialCode;
    }

  }
  deleteMaterialRow(index) {
    this.poForm.materialsList.splice(index, 1);
    this.matRow = {
      materialCode: '',
      materialName: null,
      quantity: '',
      status: 'To Be Ordered',
      new: false,
      courieredStatus: 'No'
    };
  }
  saveMaterialRow(row) {
    row.new = false;
  }
  editMaterialRow(row) {
    row.new = true;
  }
  get matInAdd() {
    return this.poForm.materialsList.some(x => x.new === true);
  }

  get disableMaterialSave() {
    if (this.poForm.materialsList.length !== 0 &&
      (this.matRow.materialName === null ||
        ((this.matRow.quantity !== null) || (this.matRow.quantity !== undefined)) ? (this.matRow.quantity.trim().length === 0) : false)) {
      return true;
    } else {
      return false;
    }
  }
  get disableMaterialAdd() {
    if (this.poForm.materialsList.length !== 0 && this.poForm.materialsList.some(material =>
      material.materialCode == null || material.materialName === null
    )) {
      return true;
    }
  }



  addMaterialRow1() {
    this.matRow = {
      materialCode: '',
      materialName: null,
      quantity: '',
      status: 'To Be Ordered',
      new: true,
      courieredStatus: 'No'
    };
    this.poForm.spareMaterials.unshift(this.matRow);
  }
  selectMaterial1(row, idx) {
    const materialCode = this.materialsItems.filter(x => {
      if (x.name === row.materialName) {
        row.isDeviceId = (x.isDeviceId) ? true : false;
        this.poForm.spareMaterials[idx].isDeviceId = (x.isDeviceId) ? true : false;
        return true;
      }
    })[0].id;
    if (this.poForm.spareMaterials.some(material => ((material.materialCode === materialCode) && (material.materialName !== 'others')))) {
      this.toastr.error('', 'Material already selected..!');
      row.materialCode = null;
      row.materialName = null;
    } else {
      row.materialCode = materialCode;
    }

  }
  deleteMaterialRow1(index) {
    this.poForm.spareMaterials.splice(index, 1);
    this.matRow = {
      materialCode: '',
      materialName: null,
      quantity: '',
      status: 'To Be Ordered',
      new: false,
      courieredStatus: 'No'
    };
  }
  saveMaterialRow1(row) {
    row.new = false;
  }
  editMaterialRow1(row) {
    row.new = true;
  }
  get matInAdd1() {
    return this.poForm.spareMaterials.some(x => x.new === true);
  }

  get disableMaterialSave1() {
    if (this.poForm.spareMaterials.length !== 0 &&
      (this.matRow.materialName === null ||
        ((this.matRow.quantity !== null) || (this.matRow.quantity !== undefined)) ? (this.matRow.quantity.trim().length === 0) : false)) {
      return true;
    } else {
      return false;
    }
  }
  get disableMaterialAdd1() {
    if (this.poForm.spareMaterials.length !== 0 && this.poForm.spareMaterials.some(material =>
      material.materialCode == null || material.materialName === null
    )) {
      return true;
    }
  }
  changeTab(tab) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      if (!this.ticketList && (this.activeTab === 'ticketList')) {
        this.fetchPoTickets(this.purchaseOrderId);
      } else if (!this.challanDetails && (this.activeTab === 'challanDetails')) {
        this.fetchChallans(this.purchaseOrderId);
      }
    }
  }
  exportToExcel() {
    const tabName = this.purchaseOrderId + '_tickets';
    this.http.downloadExcel(this.ticketList, tabName + ' Tickets(' + this.http.getDateTimeForExport() + ')');
  }
  checkEditAvailability(bodySubscript) {
    if (this.userRole === 'manager') {
      if (bodySubscript.ticketStatus === 'submitted' ||
        bodySubscript.ticketStatus === 'waitingReadiness' || bodySubscript.ticketStatus === 'visitScheduled') {
        return true;
      }
    }
    return false;
  }
  deleteTicket() {
    const postJson = {
      ticketId: this.ticketIdToDelete
    };
    this.http.post(Config.SERVICE_IDENTIFIER.DELETE_TICKET, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Ticket deleted successfully');
        this.fetchPoTickets(this.purchaseOrderId);
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
  showTicketsList() {
    if (this.tabList.length === 1) {
      this.tabList.push({ value: 'ticketList', label: 'Tickets', icon: 'fas fa-inbox' });
    }
  }
  createTicket() {
    this.router.navigate(['schedule-site-visit/' + 'new' + '/' + this.purchaseOrderId]);
  }
  editSiteVisit(visitDetails) {
    this.router.navigate(['schedule-site-visit/' + visitDetails.ticketId + '/' + this.purchaseOrderId]);
  }
  navigateToTicket(body) {
    if (!this.isPOCancelled()) {
      if ((body.ticketStatus === 'submitted' ||
        body.ticketStatus === 'waitingReadiness' ||
        body.ticketStatus === 'visitScheduled') && this.userRole === 'manager') {
        this.router.navigate(['ticket-list/ticket-workflow', body.ticketId]);
      } else if (this.userRole === 'manager') {
        this.router.navigate(['ticket-list/ticket-details', body.ticketId]);
      } else if (this.userRole === 'siteEngineer' &&
        (body.ticketStatus === 'visitScheduled' || body.ticketStatus === 'onSite')) {
        this.router.navigate(['ticket-list/engineer-ticket', body.ticketId]);
      } else {
        this.router.navigate(['ticket-list/ticket-details', body.ticketId]);
      }
    }
  }
  isPOCancelled() {
    if (this.poForm) {
      return (this.poForm.poStatus === 'Cancelled');
    }
    return false;
  }

  editChallan(body) {
    if (!body || !body.deliveryChallanId) { return; }
    this.router.navigate(['delivery-Challan/viewChallan', body.deliveryChallanId, 'PO', this.purchaseOrderId]);
  }

  changeInwardDCType(event) {
    try {
      this.inwardDCTypes.forEach(element => {
        if (element.value === event) {
          this.inwardPoInfo = element.info;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  changeOutwardDCType(event) {
    try {
      this.outwardDCTypes.forEach(element => {
        if (element.value === event) {
          this.outwardPoInfo = element.info;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
