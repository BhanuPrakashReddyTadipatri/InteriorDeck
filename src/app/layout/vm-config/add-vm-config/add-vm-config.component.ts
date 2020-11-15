import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';

@Component({
  selector: 'app-add-vm-config',
  templateUrl: './add-vm-config.component.html',
  styleUrls: ['./add-vm-config.component.scss'],
})
export class AddVmConfigComponent implements OnInit {
  LOAD_VENDOR_EDIT: any;
  public vendorDetails = {
    // vendorId: '',
    vendorName: '',
    contactName: '',
    contactNo: '',
    contactEmail: '',
    products: [],
    website: '',
    vendorGstNo: '',
    vendorAddress: '',
    location: '',
    bankName: '',
    accountName: '',
    accountNo: '',
    accountIfsc: '',
  };
  public vendorMasterId: any;

  public productCode: any = [];

  public ddOptions: any = {
    countryCode: [],
  };
  constructor(
    private http: HttpLayerService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.vendorMasterId = params.id;
    });
  }

  ngOnInit() {
    this.fetchProductList();
    if (this.vendorMasterId) {
      this.fetchVendorDetails();
    }
  }
  fetchVendorDetails() {
    try {
      const payLoad = {
        vendorId: this.vendorMasterId
      };
      this.http
        .post(Config.SERVICE_IDENTIFIER.FETCH_VENDOR_DETAILS, payLoad)
        .subscribe((response) => {
          if (response.status === true) {
            this.vendorDetails = response.bodyContent;
          } else {
            this.toastr.error('', response.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  fetchProductList() {
    try {
      const inputJson = {
        dropdownList: ['product']
      };

      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_DROPDOWN_LIST, inputJson)
        .subscribe((response) => {
          if (response.status === true && response.data.product.length >= 1) {
            this.productCode = response.data.product;
          } else {
            this.toastr.error('', response.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  textNumberOnly(event): boolean {
    try {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  avoidSpaceOnly(event): boolean {
    try {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode === 32) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  submitForm() {
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.SAVE_VENDOR_DETAILS, this.vendorDetails).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', response.message || 'Vendor details saved successfully');
          this.route.navigate(['vm-config/list']);
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  cancel() {
    this.route.navigate(['vm-config/list']);
  }

  reset() {
    try {
      if (this.vendorMasterId) {
        this.fetchVendorDetails();
        return;
      }
      this.vendorDetails = {
        // vendorId: '',
        vendorName: '',
        contactName: '',
        contactNo: '',
        contactEmail: '',
        products: [],
        website: '',
        vendorGstNo: '',
        vendorAddress: '',
        location: '',
        bankName: '',
        accountName: '',
        accountNo: '',
        accountIfsc: '',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
