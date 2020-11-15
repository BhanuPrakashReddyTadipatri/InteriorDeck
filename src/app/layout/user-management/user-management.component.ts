import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from 'src/app/config/config';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  @ViewChild('updatePopUp') updatePopUp;

  public fileData;
  public encodedFile;
  public encodedFileImage;
  public encodedFileIdCard;
  public message;
  public actionType = "Create"
  public profilePopup = true;
  public modalOptions: NgbModalOptions = {
    'size': 'lg',
    'windowClass': 'standard-modal'
  };
  public userIdToFetch = {
    userID: null
  };
  public idcardLink = '';

  public userDetails = {
    "profilePicture": '',
    "userID": '',
    "firstName": '',
    "lastName": '',
    "contactNo": '',
    "alternateContactNo": '',
    "emergencyContactNo": '',
    "email": '',
    "userRole": null,
    "password": '',
    "location": '',
    "userType": null,
    "dateOfBirth": '',
    "idCardType": null,
    "idCardCode": '',
    "idCardAttachment": ''
  }

  public roleList = Config.CONSTANTS.USER_ROLES;
  public typeList = ['Vendor', 'Employee'];
  public IdCardList = ['AADHAR', 'VOTER-ID', 'PAN', 'COMPANY-ID', 'OTHER'];
  public klUserRole: any;
  public klUserId: any;

  constructor(
    private _http: HttpLayerService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router,
    private session: SessionService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.userIdToFetch.userID = params['userId'];
      this.actionType = params['type'];
      this.klUserRole = this.session.api.local.get(Config.USER_ROLE);
      this.klUserId = this.session.api.local.get(Config.USER_IDENTIFIER);
      if(this.klUserRole!=='manager' &&  params['userId']!==this.klUserId){
        this.route.navigate(['not-found'])
      }
    });
  }

  ngOnInit() {
    if (this.userIdToFetch.userID != '') {
      this.fetchUserDetails();
    }
  }

  createUser() {
    this._http.post(Config.SERVICE_IDENTIFIER.CREATE_USER, this.userDetails).subscribe((response) => {
      if (response.status === true) {
        this.message = response.message;
        this.toastr.success('', 'User created Successfully');
      } else {
        this.message = response.message;
        this.toastr.success('', this.message);
      }
    });
  }
  updateUser() {
    this.userDetails.userID.trim();
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_USER, this.userDetails).subscribe((response) => {
      if (response.status === true) {
        this.message = response.message;
        this.toastr.success('', 'User Details Updated Successfully');
      } else {
        this.message = response.message;
        this.toastr.success('', this.message);
      }
    });
  }
  fetchUserDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_USER_DETAILS, this.userIdToFetch).subscribe((response) => {
      if (response.status === true) {
        this.userDetails = response.data;
      } else {
        this.message = response.message;
      }
    });
  }
  openProfilePicUploadPopup() {
    this.fileData = undefined;
    document.getElementById('profilePicture').click();
  }
  onFileChange(event, type) {
    try {
      this.fileData = undefined;
      if (event.target.files && event.target.files.length > 0) {
        this.fileData = event.target.files[0];
        if (type === 'profilePicture') {
          this.resizeImage();
        } else if (type === 'idCard') {
          this.cardAtoB();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  resizeImage() {
    const instance = this;
    if (this.fileData.type.match(/image.*/)) {
      // Load the image
      const reader = new FileReader();
      reader.onload = function (readerEvent) {
        const image = new Image();
        image.onload = function () {

          // Resize the image
          const canvas = document.createElement('canvas'),
            max_size = 544;	// Change this number to reduce the file size (resolution also changes)
          let width = image.width,
            height = image.height;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width ? width : 50;
          canvas.height = height ? height : 50;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/svg');

          instance.encodedFile = dataUrl;
          instance.profilePopup = true;
          instance.modalService.open(instance.updatePopUp, instance.modalOptions);
        }
        image.src = readerEvent['target']['result'];
      }
      reader.readAsDataURL(this.fileData);
    }
  }
  cardAtoB() {
    if (this.fileData.type.match(/image.*/)) {
      let file = this.fileData;
      let fileReader: FileReader = new FileReader();
      fileReader.onloadend = () => {
        this.userDetails.idCardAttachment = fileReader.result.toString();
        this.idcardLink = file.name;
      }
      fileReader.readAsDataURL(file);
    }
  }

  validate() {
    if (Object.values(this.userDetails).includes(null || '')) {
      return true;
    }
    else {
      return false;
    }
  }

  saveImage() {
    this.userDetails.profilePicture = this.encodedFile;
  }
  addUser() {
    if (this.actionType === 'new') {
      this.createUser();
    } else if (this.actionType === 'edit' || this.actionType === 'view') {
      this.updateUser();
    }
  }
  get viewIdCard() {
    if (this.userDetails.idCardAttachment == '') {
      return false;
    }
    else {
      return true;
    }
  }
  openIdCard() {
    this.profilePopup = false;
    this.modalService.open(this.updatePopUp, this.modalOptions);
    this.encodedFile = this.userDetails.idCardAttachment;
  }
  get viewMode() {
    if (this.actionType === 'view') {
      return true;
    }
  }

  cancel() {
    if(this.klUserRole==='manager'){
      this.route.navigate(['user-list']);
    }
    else{
      this.route.navigate(['home']);
    }
  }
}
