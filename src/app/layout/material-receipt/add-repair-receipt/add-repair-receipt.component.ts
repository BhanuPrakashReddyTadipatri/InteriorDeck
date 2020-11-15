import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';

@Component({
  selector: 'app-add-repair-receipt',
  templateUrl: './add-repair-receipt.component.html',
  styleUrls: ['./add-repair-receipt.component.scss']
})
export class AddRepairReceiptComponent implements OnInit {

  public receiptId: any;
  public receiptViewMode = false;
  public repairReceiptDetails = {
    productList: [],
    clientName: null,
    clientId: null,
    name: '',
    contactNumber: '',
    email: '',
    address: '',
    reasonForRepair: '',
    remarks: '',
    status: 'pending',
    assignedTo: null,
    associatedChallan: null,
  };
  productList: any = [
    {
      deviceId: '',
      materialName: '',
      quantity: 1,
    }
  ];
  public selectProduct = [];
  public clientList: any = [];
  public userList: any = [];
  public challanList: any = [];
  public statusList = [
    {
      label: 'Pending',
      value: 'pending'
    },
    {
      label: 'In Progress',
      value: 'inProgress'
    },
    {
      label: 'Returned',
      value: 'returned'
    },
    {
      label: 'Disposed',
      value: 'disposed'
    },
  ];
  public showConfirmation = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public innerTab = 'pending';

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private session: SessionService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.receiptId = params.id;
      this.innerTab = params.innerTab;
      this.receiptViewMode = params.type === 'view' ? true : false;
    });
  }

  ngOnInit() {
    this.fetchMaterialsList();
    this.fetchSiteList();
    this.fetchUserList();
    if (this.receiptId) {
      this.fetchReceiptDetails();
    }
  }
  changeClientName(event) {
    try {
      if (!event) { return; }
      const indx = this.clientList.findIndex(el => el.siteId === event);
      if (indx > -1) {
        this.repairReceiptDetails.clientName = this.clientList[indx]['siteName'];
      }
    } catch (error) {
      console.log(error);
    }
  }
  changeMaterialName(event, row) {
    try {
      if (!event || !row) { return; }
      const indx = this.selectProduct.findIndex(el => el.materialCode === event);
      if (indx > -1) {
        row['materialName'] = this.selectProduct[indx]['name'];
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchReceiptDetails() {
    try {
      const payLoad = {
        repairReceiptId: this.receiptId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_REPAIR_RECEIPT, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.repairReceiptDetails = response.data;
          this.productList = response.data.productList;
          this.fetchChallanList();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchChallanList() {
    try {
      if (this.repairReceiptDetails.status === 'returned' && (!this.challanList || this.challanList.length === 0)) {
        const inputJSON = {
          dcStatus: 'Approved',
        };
        this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_LIST, inputJSON).subscribe((response) => {
          if (response.status === true && response.data.tableData) {
            this.challanList = response.data.tableData.bodyContent;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  fetchUserList() {
    try {
      const inputJSON = {};
      this.http.post(Config.SERVICE_IDENTIFIER.GET_USER_LIST, inputJSON).subscribe((response) => {
        if (response.status === true && response.data.tableData) {
          this.userList = response.data.tableData.bodyContent;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  fetchMaterialsList() {
    try {
      const inputJSON = { ticket_type: 'All' };
      this.http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
        if (response.status === true) {
          this.selectProduct = response.data;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchSiteList() {
    try {
      const inputJSON = { ticket_type: 'All' };
      this.http.post(Config.SERVICE_IDENTIFIER.listSitesInTableFormat, inputJSON).subscribe((response) => {
        if (response.status === true) {
          this.clientList = response.data.tableData ? response.data.tableData.bodyContent : [];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  confirmation() {
    if ((this.repairReceiptDetails.status === 'returned' || this.repairReceiptDetails.status === 'disposed') && this.mandatoryCheck()) {
      this.confirmJson.type = 'continue';
      this.confirmJson.title = 'Confirmation';
      // tslint:disable-next-line:max-line-length
      this.confirmJson.message = 'Once you ' + this.repairReceiptDetails.status + ' the repair receipt then it cannot be reverted. Are you sure you want to dispose?';
      this.showConfirmation = true;
    } else if (this.repairReceiptDetails.status === 'pending' || this.repairReceiptDetails.status === 'inProgress') {
      this.submitForm();
    }
  }

  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'continue') {
        this.submitForm();
      }
    }
    this.showConfirmation = false;
  }

  deleteRepairRow(index) {
    try {
      this.productList.splice(index, 1);
    } catch (error) {
      console.log(error);
    }
  }

  addRepairRow() {
    try {
      const newmatRow = {
        deviceId: '',
        materialName: '',
        quantity: 1,
      };
      this.productList.push(newmatRow);
    } catch (error) {
      console.log(error);
    }
  }
  goBack() {
    this.router.navigate(['receipts/list', 'repairReceipt', this.innerTab]);
  }

  mandatoryCheck() {
    try {
      const checkKeys = ['quantity', 'materialName'];
      if (this.productList.length) {
        for (const element of this.productList) {
          for (const newEle of checkKeys) {
            if (!element[newEle] || element[newEle] === '') {
              this.toastr.error('', 'Please fill all mandatory fields');
              return false;
            }
          }
        }
      } else {
        this.productList = [];
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  submitForm() {
    try {
      this.showConfirmation = false;
      if (!this.mandatoryCheck()) {
        return;
      }
      const postJson = JSON.parse(JSON.stringify(this.repairReceiptDetails));
      postJson.productList = this.productList;
      this.http
        .post(Config.SERVICE_IDENTIFIER.SAVE_REPAIR_RECEIPT, postJson)
        .subscribe((response) => {
          if (response.status === true) {
            this.toastr.success('', response.message || 'Repair receipt saved successfully');
            this.router.navigate(['receipts/list', 'repairReceipt', this.innerTab]);
          } else {
            this.toastr.error('', response.message || 'Failed to save repair receipt');
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

}
