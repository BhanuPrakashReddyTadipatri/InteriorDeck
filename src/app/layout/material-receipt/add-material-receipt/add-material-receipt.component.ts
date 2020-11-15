import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';
import * as moment from 'moment';

@Component({
  selector: 'app-add-material-receipt',
  templateUrl: './add-material-receipt.component.html',
  styleUrls: ['./add-material-receipt.component.scss']
})
export class AddMaterialReceiptComponent implements OnInit {

  public selectedVendor = [];
  public selectProduct = [];

  materialReceipt: any = {
    vendorId: null,
    purchaseDate: '',
    status: 'active',
    grantTotal: 0,
  };

  selectCode: any = {};

  productList: any = [];

  public receiptId: any;
  public receiptViewMode = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public showConfirmation = false;
  public selectedStatus = [
    {
      label: 'Active',
      value: 'active'
    },
    {
      label: 'Approved',
      value: 'approved'
    },
  ];
  public today = new Date();
  public innerTab = 'active';

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
    this.fetchVendorDropDown();
    if (this.receiptId) {
      this.fetchReceiptDetails();
    }
  }

  fetchReceiptDetails() {
    try {
      const payLoad = {
        materialReceiptId: this.receiptId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_MATERIAL_RECEIPT, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.materialReceipt = response.data;
          this.materialReceipt.purchaseDate = moment(this.materialReceipt.purchaseDate, 'MM-DD-YYYY').toDate();
          this.fetchProductList();
          this.productList = this.materialReceipt.productList;
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  ondropdownChange() {
    try {
      this.fetchProductList();
      if (this.productList) {
        this.productList = [
          {
            deviceId: '',
            materialCode: null,
            materialName: '',
            quantity: 1,
            price: 0,
            totalPrice: 0,
          }
        ];
      }
    } catch (err) {
      console.log(err);
    }
  }

  fetchProductList() {
    try {
      const payLoad = {
        vendorId: this.materialReceipt.vendorId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.GET_PRODUCT_BY_VENDOR_ID, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.selectProduct = response.data;
          this.updateOptions();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateOptions() {
    try {
      const selectProductTemp = JSON.parse(JSON.stringify(this.selectProduct));
      selectProductTemp.forEach(option => {
        const index = this.productList.findIndex(el => el.materialCode === option.materialCode);
        if (index > -1) {
          option['disabled'] = true;
        } else {
          option['disabled'] = false;
        }
      });
      this.selectProduct = selectProductTemp;
    } catch (error) {
      console.log(error);
    }
  }

  productChange(row, idx) {
    try {
      const deviceId = this.selectProduct.filter(x => {
        if (x.materialCode === row.materialCode) {
          row.materialName = x.materialName;
          return true;
        }
      })[0].deviceId;
      if (this.productList.some(material => (material.deviceId === deviceId))) {
        this.toastr.error('', 'Product already selected..!');
        this.productList[idx] = {};
        row.materialCode = '';
        row.materialName = '';
        row.deviceId = '';
      } else {
        row.deviceId = deviceId;
      }
      this.updateOptions();
    } catch (error) {
      console.log(error);
    }
  }

  confirmation() {
    if (this.materialReceipt.status === 'approved' && this.mandatoryCheck()) {
      this.confirmJson.type = 'continue';
      this.confirmJson.title = 'Confirmation';
      // tslint:disable-next-line:max-line-length
      this.confirmJson.message = 'Once you approve the material receipt then it will be added to the stock and it cannot be reverted. Are you sure you want to approve?';
      this.showConfirmation = true;
    } else if (this.materialReceipt.status === 'active') {
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

  fetchVendorDropDown() {
    try {
      const inputJson = {
        dropdownList: ['vendorWithIdLabel']
      };
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_DROPDOWN_LIST, inputJson).subscribe((response) => {
        if (response.status === true) {
          this.selectedVendor = response.data.vendorWithIdLabel;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteMaterialRow(index) {
    this.productList.splice(index, 1);
    this.updatePrice();
    this.updateOptions();
  }

  addMaterialRow() {
    const newmatRow = {
      materialCode: null,
      materialName: '',
      price: 0,
      totalPrice: 0,
      quantity: 1,
      deviceId: '',
    };
    this.productList.push(newmatRow);
  }

  goBack() {
    this.router.navigate(['receipts/list', 'materialReceipt', this.innerTab]);
  }
  updatePrice(row?) {
    try {
      if (row) {
        row.totalPrice = row.quantity * row.price;
      }
      this.materialReceipt.grantTotal = 0;
      this.productList.forEach(element => {
        this.materialReceipt.grantTotal += element.totalPrice;
      });
    } catch (error) {
      console.log(error);
    }
  }
  mandatoryCheck() {
    try {
      const checkKeys = ['materialName', 'price', 'quantity', 'materialCode'];
      if (this.productList.length) {
        for (const element of this.productList) {
          for (const newEle of checkKeys) {
            if ((newEle === 'price' && element[newEle] < 0) || (newEle !== 'price' && (!element[newEle] || element[newEle] === ''))) {
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
      const postJson = JSON.parse(JSON.stringify(this.materialReceipt));
      postJson.productList = this.productList;
      postJson.purchaseDate = moment(postJson.purchaseDate).format('MM-DD-YYYY');
      this.http
        .post(Config.SERVICE_IDENTIFIER.SAVE_MATERIAL_RECEIPT, postJson)
        .subscribe((response) => {
          if (response.status === true) {
            this.toastr.success('', response.message || 'Material receipt saved successfully');
            this.router.navigate(['receipts/list', 'materialReceipt', this.innerTab]);
          } else {
            this.toastr.error('', response.message || 'Failed to save material receipt');
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

}
