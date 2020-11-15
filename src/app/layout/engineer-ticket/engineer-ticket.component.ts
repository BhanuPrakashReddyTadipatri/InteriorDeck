import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from 'src/app/config/config';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-engineer-ticket',
  templateUrl: './engineer-ticket.component.html',
  styleUrls: ['./engineer-ticket.component.scss']
})
export class EngineerTicketComponent implements OnInit {

  public feedbackCategoryList = ["Travel" ,"Site","Others"];
  public feedbackinfo = {
    'rating':'',
    'categoryList': '',
    'othercategory':'',
    'subject' : '',
    'issues': '',
    'suggestions':'',
    'description' : '',
    'siteId':'',
    'siteName':'',
    'ticketId':''
  }

  public todayDate = new Date();
  public completedDate;
  public materialList = [];
  public matTableData: any = [];
  public matRow = {
    materialCode: '',
    materialName: '',
    quantity: '',
    new: false
  };
  public ticketId = {
    ticketId: null
  };
  public fileUpload = {
    documentName: '',
    data: ''
  };
  public momData = {
    documentId: null,
    documentName:null,
    uploadedTime:null
  };
  public showConfirmation = false;
  public confirmJson = {
    type:'',
    message: '',
    title:'',
    trueButton:'Yes, Continue',
    falseButton:'Cancel'
  };
  public documentDescription: any = '';
  public userName;
  public uploadFileDetails;
  public uploadMessage;
  public uploadMessageMOM;
  public ticketDetails;
  public activeTab = 'ticketDetails';
  public goalStatusList = ['Completed', 'Partially Completed', 'Not Completed'];
  public message = '';
  public fileData;
  public fileDataMOM;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _http: HttpLayerService,
    private _session: SessionService,
    private toastr: ToastrService

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.ticketId.ticketId = params['ticketId'];
    });
  }

  ngOnInit() {
    this.completedDate = this.todayDate;
    this.userName = this._session.api.local.get(Config.SESSION_USER_NAME);
    this.fetchTicketDetails();
    this.fetchFileDetails();
  }

  fetchMaterialsList() {
    const inputJSON = { ticket_type: this.ticketDetails['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.materialList = response.data;
      }
    });
  }
  fetchTicketDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_DETAILS, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails = response.data;
        this.fetchMaterialsList();
        this.fetchMOMDetails();
        this.updateReadStatus();
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  updateReadStatus() {
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_READ_STATUS, this.ticketId).subscribe((response) => {
      if (response.status) {
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  updateGoalStatusService() {
    let postJson = {
      ticketId: this.ticketId.ticketId,
      keyGoals: this.ticketDetails.keyGoals
    }
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_GOAL_STATUS, postJson).subscribe((response) => {
      if (response.status === true) {
        this.message = response.message;
        this.toastr.success('', 'Goal Status Updated Successfully');
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  startVisitConfirmation() {
    this.confirmJson.type = 'startVisit'
    this.confirmJson.title = "Start Visit"
    this.confirmJson.message = "Are you sure you want to start the visit?"
    this.showConfirmation = true;
  }
  actionPerformed(event) {
    if(event.action) {
      if(this.confirmJson.type === 'startVisit') {
        this.startVisit();
      } else if(this.confirmJson.type === 'finishVisit') {
        this.finishVisit();
      }
    }
    this.showConfirmation = false;
  }
  startVisit() {
    this.activeTab ='updates';
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_TICKET_STATUS_START, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails.ticketStatus = response.data;
        this.toastr.success('', 'Site Visit Started');
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  finishVisitConfirmation() {
    this.confirmJson.type = 'finishVisit'
    this.confirmJson.title = "Finish Visit"
    this.confirmJson.message = "Are you sure you want to finish the visit?"
    this.showConfirmation = true;
  }
  finishVisit() {
    this.feedbackinfo.categoryList = (this.feedbackinfo.categoryList === 'Others') ? this.feedbackinfo.othercategory :
                                      this.feedbackinfo.categoryList;
    this.feedbackinfo.ticketId = this.ticketId.ticketId;
    this.feedbackinfo.siteId = this.ticketDetails.siteDetails.siteId;
    this.feedbackinfo.siteName = this.ticketDetails.siteDetails.siteName;
    const postJson = {
      ticketId: this.ticketId.ticketId,
      finishedDate: this.completedDate,
      feedbackinfo: this.feedbackinfo,
      spareMaterials: this.matTableData
    };
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_TICKET_STATUS_FINISH, postJson).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails.ticketStatus = response.data;
        this._router.navigate(['/ticket-list']);
        this.toastr.success('', 'Feedback Submitted Successfully');
        this.toastr.success('', 'Site Visit Finished');
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  saveState(tab) {
    if (tab === 'updates') {
      this.updateGoalStatusService();
    }
  }
  onFileChange(event) {
    try {
      this.fileData = undefined;
      if (event.target.files && event.target.files.length > 0) {
        this.fileData = event.target.files[0];
        if (this.fileData.type.match(/image*/) || this.fileData.type.toString() == 'application/pdf') {
          let file = this.fileData;
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = () => {
            this.fileUpload.data = fileReader.result.toString();
            this.fileUpload.documentName = this.fileData.name;
          }
          fileReader.readAsDataURL(file);
        }
      } else {
        this.fileData = undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }
  onFileChangeMOM(event) {
    try {
      this.fileDataMOM = undefined;
      if (event.target.files && event.target.files.length > 0) {
        this.fileDataMOM = event.target.files[0];
        if (this.fileDataMOM.type.match(/image*/) || this.fileDataMOM.type.toString() == 'application/pdf') {
          let file = this.fileDataMOM;
          let fileReader: FileReader = new FileReader();
          fileReader.onloadend = () => {
            this.fileUpload.data = fileReader.result.toString();
            this.fileUpload.documentName = this.fileDataMOM.name;
          }
          fileReader.readAsDataURL(file);
        }
      } else {
        this.fileDataMOM = undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }
  uploadFile(type) {
    if (type === 'doc') {
      let postJson = {
        ticketId: this.ticketId.ticketId,
        documentDetails: this.fileUpload,
        description: this.documentDescription
      };
      this._http.post(Config.SERVICE_IDENTIFIER.UPLOAD_FILES, postJson).subscribe((response) => {
        if (response.status === true) {
          this.uploadMessage = response.message;
          this.fileData = undefined;
          this.documentDescription = '';
          this.toastr.success('', 'Document Uploaded Successfully');
          this.fetchFileDetails();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } else if (type === 'mom') {
      let postJson = {
        ticketId: this.ticketId.ticketId,
        documentName: this.fileUpload.documentName,
        data: this.fileUpload.data
      };
      this._http.post(Config.SERVICE_IDENTIFIER.UPLOAD_MOM, postJson).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', 'MOM Uploaded Successfully');
          this.fetchMOMDetails();
          this.fileDataMOM = undefined;
        } else {
          this.toastr.error('', response.message);
        }
      });
    }
  }
  fetchMOMDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_MOM_DETAILS, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.momData.documentId = response.data.documentId;
        this.momData.documentName = response.data.documentName;
        this.momData.uploadedTime = response.data.uploadedTime;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchFileDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_UPLOAD_FILE_DETAILS, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.uploadFileDetails = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  downloadFile(downloadId) {
    const url = Config.SERVICE_IDENTIFIER.DOWNLOAD_FILE + '/' + this.userName + '/' + this.ticketId.ticketId + '/' + 'doc' + '/' + downloadId;
    window.open(url);
  }
  downloadMOM(docId) {
    const url = Config.SERVICE_IDENTIFIER.DOWNLOAD_FILE + '/' + this.userName + '/' + this.ticketId.ticketId + '/' + 'mom' + '/' + docId;
    window.open(url);
  }
  statusParser(status) {
    let tabList = [
      { value: "submitted", label: "Submitted" },
      { value: "waitingReadiness", label: "Waiting Readiness" },
      { value: "visitScheduled", label: "Visit Scheduled" },
      { value: "onSite", label: "On site" },
      { value: "completed", label: "Completed" }];

    let statusDict = tabList.filter(item => item.value == status);
    return statusDict[0].label;
  }

  get finishDisabled() {
    if(this.momData.documentId === null || !this.feedbackinfo['categoryList'] || !this.feedbackinfo['subject'] || !this.feedbackinfo['rating'] || !this.feedbackinfo['description']) {
      return true;
    }
  }
  minrating(count) {
    if (count <= 0) {
      return false;
    } else {
      return true;
    }
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
        this.matTableData[idx]['isDeviceId'] = (x.isDeviceId) ? true : false;
        return true;
      }
    })[0].id;
    if (this.matTableData.some(material => ((material.materialCode === materialCode) && (material.materialName !== 'others')))) {
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
    return this.matTableData.some(x => x['new'] === true);
  }

  get disableMaterialSave() {
    if (this.matTableData.length !== 0 &&
      (this.matRow.materialName === null ||
        // this.matRow.materialCode === null ||
        ((this.matRow.quantity !== null) || (this.matRow.quantity !== undefined)) ? (this.matRow.quantity.trim().length === 0) : false)) {
      return true;
    } else {
      return false;
    }
  }
  get disableMaterialAdd() {
    if (this.matTableData.length !== 0 && this.matTableData.some(material =>
      material.materialCode == null || material.materialName === null
    )) {
      return true;
    }
  }
}
