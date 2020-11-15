import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';

@Component({
  selector: 'app-add-dc-config',
  templateUrl: './add-dc-config.component.html',
  styleUrls: ['./add-dc-config.component.scss']
})
export class AddDcConfigComponent implements OnInit {



  public fileData;
  public modalOptions: NgbModalOptions = {
    size: 'lg',
    windowClass: 'standard-modal'
  };
  public enableFields = false;
  public DcConfigId: any;
  public configDetails = {
    companyName: '', companyAddress: '', contactNo: '', companyGstNo: '', companyPanNo: '', location: '',
    email: '', termsandCond: ''
  };
  public url: any = '';
  constructor(
    private http: HttpLayerService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.DcConfigId = params.id;
    });
  }

  ngOnInit() {
    if (this.DcConfigId) {
      this.fetchdcConfigDetails();
    }
  }

  fetchdcConfigDetails() {
    try {
      const payLoad = {
        companyId: this.DcConfigId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.FETCH_DCCONFIG, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.configDetails = response.data.bodyContent;
          this.url = response.data.file;
        } else {
          this.toastr.success('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onFileChange(event) {
    try {
      this.fileData = undefined;
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        this.fileData = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]); // read file as data ur
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    } catch (error) {
      console.log(error);
    }
  }


  validate() {
    if (Object.values(this.configDetails).includes(null || '')) {
      return true;
    } else {
      return false;
    }
  }

  saveDCconfig() {
    try {
      const payLoad = {
        bodyContent: this.configDetails,
        type: this.DcConfigId ? 'edit' : 'add',
        companyId: this.DcConfigId ? this.DcConfigId : '',
        file: this.url
      };
      this.http.post(Config.SERVICE_IDENTIFIER.SAVE_DC_CONFIG, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('Success', response.message);
          this.route.navigate(['dc-config/list']);
        } else {
          this.toastr.success('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  enableInputFields() {
    this.enableFields = !this.enableFields;
  }

  reset() {
    try {
      this.configDetails = {
        companyName: '', companyAddress: '', contactNo: '', companyGstNo: '', companyPanNo: '', location: '',
        email: '', termsandCond: ''
      };
      this.url = '';
    } catch (error) {
      console.log(error);
    }
  }
  cancel() {
    this.route.navigate(['dc-config/list']);
  }

}
