import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from './../../../services/http-service-layer.service';
import { Config } from '../../../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-delivery-challan',
  templateUrl: './add-delivery-challan.component.html',
  styleUrls: ['./add-delivery-challan.component.scss']
})
export class AddDeliveryChallanComponent implements OnInit {
  poForm: any = {
    editable: true,
  };
  disableField: boolean;
  ConsigneeAddress: any;

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private session: SessionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.challanId = params.id;
      this.activeTab = params.type;
      this.poNo = params.po;
    });
  }
  public activeTab;
  public challanId;
  public poNo;
  public purchaseOrders;
  public selectedPO;
  public deliveryChallanDetails: any = {
    challanNo: '', challanLabel: '', date: '', poDate: '', siteName: '', companyName: '',
    decleration: 'We Declare this DC shows the Actual Qty of Goods described and that all particulars are true & Correct',
    totalValue: '', GSTN: '', dcStatus: 'Active', consigneeName: '', consigneeAddress: '',
  };
  public materialsItems: any = [];
  public materialStatusList: any = [
    { label: 'To Be Ordered', value: 'To Be Ordered' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Dispatched', value: 'Dispatched' },
    { label: 'Delivered', value: 'Delivered' }
  ];
  public courieredStatusList: any = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  public matRow = {
    materialCode: '',
    materialName: null,
    quantity: '',
    status: 'To Be Ordered',
    new: false,
    courieredStatus: 'No'
  };
  public DCStatusList: any = [
    { label: 'Active', value: 'Active' },
    { label: 'Approved', value: 'Approved' }
  ];
  public disableinputField: any = false;
  public companyList: any = [];
  public companyDetails: any = {};
  public showDeliveryDetails = false;
  public responseData: any;
  public userRole;
  public dcStatus: any = 'Active';
  public carrierItems: any = [
    { label: 'DTDC', value: 'DTDC' },
    { label: 'Professional', value: 'Professional' },
    { label: 'India Post', value: 'India Post' },
    { label: 'Others', value: 'Others' }
  ];
  ngOnInit() {
    if (!this.challanId) {
      this.getChallanNum();
    }
    this.fetchPurchaseOrdersList();
    this.fetchCompanyNames();
    this.userRole = this.session.api.local.get(Config.USER_ROLE);
  }


  getChallanNum() {
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_NUM, {}).subscribe((response) => {
        if (response.status === true) {
          this.deliveryChallanDetails.challanNo = response.data;
          this.deliveryChallanDetails.challanLabel = response.data;
        } else {
          this.toastr.error(response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchCompanyNames() {
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_COMPANIES_NAMES, {}).subscribe((response) => {
        if (response.status === true) {
          this.companyList = response.data;
        } else {
          this.toastr.error(response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeCompany(event) {
    try {
      let companyID;
      for (const ele of this.companyList) {
        if (ele.value === event) {
          companyID = ele.id;
        }
      }
      if (!companyID) {
        this.toastr.warning('Failed to get the mapped company details');
        return;
      }
      const payLoad = { companyId: companyID };
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_DCCONFIG, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.companyDetails = response.data.bodyContent;
        } else {
          this.toastr.error(response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchPurchaseOrdersList() {
    try {
      this.purchaseOrders = undefined;
      this.http.post(Config.SERVICE_IDENTIFIER.fetchPurchaseOrders, {}).subscribe((response) => {
        if (response.status === true) {
          this.purchaseOrders = response.data.tableData;
          if (this.challanId) {
            setTimeout(() => {
              this.getdeliveryChallanDetails();
            }, 1000);
          } else {
            this.selectedPO = this.purchaseOrders.bodyContent[0];
            this.changePO(this.selectedPO);
          }
        } else {
          this.toastr.error(response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  fetchPoDetails() {
    this.http.post(Config.SERVICE_IDENTIFIER.fetchPurchaseOrderDetails,
      { purchaseOrderId: this.selectedPO.purchaseOrderId }).subscribe((response) => {
        if (response.status === true) {
          this.poForm = response.data;
        }
      });
  }

  fetchMaterialsList() {
    const inputJSON = { ticket_type: 'All' };
    this.http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.materialsItems = response.data;
      }
    });
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

  addDeliveryChallan() {
    let count = 0;
    if (this.poForm.materialsList) {
      this.poForm.materialsList.forEach(material => {
        if (!material.materialName || !material.quantity || !material.status) {
          count++;
        }
        if (!material.value) {
          material.value = 0;
        }
        if (!material.qty) {
          material.qty = 0;
        }
      });
    } else {
      return;
    }
    this.deliveryChallanDetails.dcStatus = this.challanId ? this.deliveryChallanDetails.dcStatus : 'Active';
    const poform = JSON.parse(JSON.stringify(this.poForm));
    const payLoad = {
      bodyContent: Object.assign(this.deliveryChallanDetails, this.companyDetails),
      poForm: poform,
      type: this.challanId ? 'edit' : 'add',
      deliveryChallanId: this.challanId ? this.challanId : ''
    };
    try {
      const a = payLoad['bodyContent'].date;
      payLoad['bodyContent'].date = a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear();
    } catch (error) {
      console.log(error);
    }
    payLoad.bodyContent['poNumber'] = this.selectedPO.poNumber;
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.SAVEDC, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', response.message);
          this.navigateToList();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  validate() {
    const a = { ...this.deliveryChallanDetails };
    delete a['siteName'];
    if (this.selectedPO && this.selectedPO.clientName.country !== 'India') {
      delete a['GSTN'];
    }
    if (Object.values(a).includes(null || '')) {
      return true;
    } else {
      return false;
    }
  }
  getdeliveryChallanDetails() {
    const payLoad = {
      deliveryChallanId: this.challanId
    };
    this.responseData = undefined;
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.getDCDeatils, payLoad).subscribe((response) => {
        if (response.status === true && response.data) {
          this.responseData = response.data;
          this.deliveryChallanDetails = response.data.bodyContent;
          try {
            let a = this.deliveryChallanDetails.date;
            a = a.split('-');
            if (a[0].length <= 2) {
              this.deliveryChallanDetails.date = new Date(a[1] + '-' + a[0] + '-' + a[2]);
            }
          } catch (error) {
            console.log(error);
          }
          this.companyDetails = response.data.bodyContent;
          this.ConsigneeAddress = response.data.bodyContent.consigneeAddress;
          this.changeCompany(this.deliveryChallanDetails.companyName);
          for (const PO of this.purchaseOrders.bodyContent) {
            if (PO.poNumber === response.data.bodyContent.poNumber) {
              this.selectedPO = PO;
              this.changePO(this.selectedPO);
            }
          }
          this.poForm = response.data.poForm;
          if (this.poForm && this.poForm.dispatchDate) {
            this.showDeliveryDetails = true;
          }
          this.dcStatus = this.deliveryChallanDetails.dcStatus;
          this.changeDcStatus(this.deliveryChallanDetails.dcStatus);
          this.deliveryChallanDetails.decleration =
            'We Declare this DC shows the Actual Qty of Goods described and that all particulars are true & Correct';
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  navigateToList() {
    if (this.poNo) {
      this.router.navigate(['manage-purchase-order', this.poNo]);
    } else {
      this.router.navigate(['delivery-Challan/list', this.activeTab]);
    }
  }

  formatDate(date) {
    try {
      const dateArray = date.split('/');
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      return new Date(month + '/' + day + '/' + year);
    } catch (error) {
      return date;
    }
  }

  changePO(data) {
    try {
      this.deliveryChallanDetails.consigneeName = data.clientName.siteName;
      this.deliveryChallanDetails.poDate = data.poDate;
      // this.fetchPoDetails();
      if (this.challanId && this.responseData.poForm.poNumber === data.poNumber) {
        this.deliveryChallanDetails.consigneeAddress = this.ConsigneeAddress;
        this.poForm = this.responseData.poForm;
        this.changeValues('', '');
      } else {
        this.deliveryChallanDetails.consigneeAddress =
          data.clientName.city + ',' + ' ' + data.clientName.district + ' ' + 'dist' + ',' + ' ' + data.clientName.state;
        this.fetchPoDetails();
        this.deliveryChallanDetails.totalValue = 0;
      }
      this.fetchMaterialsList();
    } catch (error) {
      console.log(error);
    }
  }

  resetDCForm() {
    try {
      this.deliveryChallanDetails = {
        date: '', poDate: '', siteName: '',
        decleration: 'We Declare this DC shows the Actual Qty of Goods described and that all particulars are true & Correct',
        totalValue: '', GSTN: '', consigneeName: '', consigneeAddress: '',
      };
    } catch (error) {
      console.log(error);
    }
  }

  printPDF() {
    const userID = this.session.api.local.get(Config.USER_IDENTIFIER);
    try {
      if (userID) {
        const url = Config.SERVICE_IDENTIFIER.DC_PDF + '/' + this.challanId + '/' + userID;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.log(error);
    }
  }

  editMaterialRow(row) {
    row.new = true;
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
  changeValues(event, row) {
    try {
      let value = 0;
      for (const ele of this.poForm.materialsList) {
        value += ele.value ? ele.value : 0;
      }
      this.deliveryChallanDetails.totalValue = value;
    } catch (error) {
      console.log(error);
    }
  }

  sendMail() {
    try {
      const payLoad = {
        deliveryChallanId: this.challanId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.SEND_DC_MAIL, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeDcStatus(event) {
    try {
      if (event === 'Approved') {
        this.disableinputField = true;
        this.disableField = true;
      } else {
        this.disableinputField = false;
        this.disableField = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
