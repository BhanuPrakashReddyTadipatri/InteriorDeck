import {
  Component,
  OnInit,
} from '@angular/core';

import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service'
import { CommuteProviderService } from 'src/app/services/commute-provider.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-schedule-site-visit',
  templateUrl: './schedule-site-visit.component.html',
  styleUrls: ['./schedule-site-visit.component.scss']
})
export class ScheduleSiteVisitComponent implements OnInit {
  public activeTab: String;
  public goalText;
  public goalList = [{ goal: '' }];
  public matTableData: Array<any> = [];
  public contactTableData: Array<any> = [];
  public dateRange: Date[];
  public goalNotes: String;
  public districtList = [];
  public stateList = [];
  public selectedSite;
  public issueText = null;

  public todayDate: Date;

  public siteIssues = ["RC-Kit Device Issues", "Camera Issues", "Replacement of Converters", "Data Connectivity", "Display Board", "HMI Issues", "Others"];
  public categoryList = [];
  public ticketTypesList = []; // [{id: 'GLens', name: 'GLens'}, {id: 'glens_labs', name: 'GLens Labs'}];
  public projectTypesList = [];
  public siteList = [];
  public materialList = [];

  public designationList = ["Chief Executive Officer", "Chief Operating Officer", "Chief Marketing Officer", "General Manager", "Other"];

  public listStateDistrict;


  public usersList = [];
  public engineersList = [];


  public createTicket = {
    "ticketId": "",
    "ticket_type": null,
    "requestedBy": null,
    "category": null,
    "purposeDescription": '',
    "expectedStartDate": new Date(),
    "expectedEndDate": new Date(),
    "keyGoals": [],
    "materialsRequired": [],
    "siteContact": [],
    "siteDetails": {
      "siteType": null,
      "siteId": '',
      "siteName": '',
      "place": '',
      "district": null,
      "state": null,
      "country": "India",
      "landmark": '',
    },
    "ticketStatus": "",
    "assignedEngineers": [],
    "activityInfo": [
      {
        "updatedBy": "",
        "activity": "",
        "updatedTime": ""
      }
    ],
    "siteReadinessStatus": {},
    "meta": {
      "lastUpdatedBy": "",
      "lastUpdatedTime": "",
      "createTime": "",
      "createdBy": ""
    }
  };

  public matRow = {
    materialCode: '',
    materialName: '',
    quantity: '',
    new: false
  };
  public contactRow = {
    name: '',
    designation: null,
    email: '',
    contactNo: '',
    new: false
  };
  public route;
  public ticketId: any;
  public purchaseOrderId: any;

  constructor(
    private _http: HttpLayerService,
    private router: Router,
    private _session: SessionService,
    public _commute: CommuteProviderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.ticketId = params.ticketId ? ((params.ticketId !== 'new') ? params.ticketId : undefined) : undefined;
      this.purchaseOrderId = params.purchaseOrderId;
    });
  }

  ngOnInit() {
    this.activeTab = 'general';
    if (this.ticketId) {
      this.fetchSiteVisitDetails();
    }
    this.initializeNewSiteVisitForm();
  }

  initializeNewSiteVisitForm() {
    this.todayDate = new Date();
    this.fetchUserList();
    this.createTicket.requestedBy = this._session.api.local.get(Config.USER_IDENTIFIER);
    this.fetchStateDistrictList();
    // this.fetchMaterialsList();
    this.fetchTicketTypes();
    this.fetchProjectTypes();
  }
  fetchSiteVisitDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_DETAILS, { ticketId: this.ticketId }).subscribe((response) => {
      if (response.status === true) {
        this.createTicket['ticketId'] = response.data['ticketId'];
        this.createTicket['ticket_type'] = response.data['ticket_type'] ? response.data['ticket_type'] : 'GLens';
        this.fetchCategoriesList();
        this.fetchMaterialsList();
        this.createTicket['category'] = response.data['general']['category'];
        this.createTicket['purposeDescription'] = response.data['general']['purposeDescription'];
        this.createTicket['expectedStartDate'] = response.data['general']['expectedStartDate'];
        this.createTicket['expectedEndDate'] = response.data['general']['expectedEndDate'];
        this.selectedSite = response.data['siteDetails']['siteName'];
        this.createTicket['ticketStatus'] = response.data['ticketStatus'];
        this.selectSite();
        this.contactTableData = response.data['siteContact'];
        this.contactRow = (this.contactTableData.length > 0) ? this.contactTableData[0] : {};
        this.goalList = response.data['keyGoals'];
        this.goalList.push({ goal: '' });
        this.matTableData = response.data['materialsRequired'];
      }
    });
  }
  fetchUserList() {
    const inputJSON = { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_USER_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.usersList = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchTicketTypes() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_TYPES_LIST, null).subscribe((response) => {
      if (response.status === true) {
        this.ticketTypesList = response.data['ticketType'];
      }
    });
  }
  fetchProjectTypes() {
    this._http.post(Config.SERVICE_IDENTIFIER.fetchProjectTypes, null).subscribe((response) => {
      if (response.status === true) {
        this.projectTypesList = response.data['projectTypes'];
      }
    });
  }
  fetchCategoriesList() {
    const inputJSON = { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_CATEGORIES_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.categoryList = response.data['category'];
      }
    });
    this.categoryList = ["Site Issues", "RC-Kit Installation", "New Site Commissioning", "Remote Calibration", "New Camera Connectivity", "New Display Board Configuration", "AMC Visit", "Training Related Visit", "Old Site", "Other"];
  }
  fetchMaterialsList() {
    const inputJSON = { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_MATERIALS_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.materialList = response.data;
      }
    });
  }
  fetchStateDistrictList() {
    this._http.get(Config.SERVICE_IDENTIFIER.FETCH_STATE_LIST).subscribe((response) => {
      this.listStateDistrict = response;
      this.selectCountry();
    });
  }

  createTicketCall() {
    const inputJSON = JSON.parse(JSON.stringify(this.createTicket));
    inputJSON.expectedStartDate = this.formatDateTime(inputJSON.expectedStartDate);
    inputJSON.expectedEndDate = this.formatDateTime(inputJSON.expectedEndDate);
    if (this.purchaseOrderId) {
      inputJSON.poDetails = {
        purchaseOrderId: this.purchaseOrderId,
        po_status: 'P.O No.: ' + this.purchaseOrderId
      };
    } else {
      inputJSON.poDetails = {
        purchaseOrderId: '',
        po_status: 'No P.O Assinged'
      };
    }
    this._http.post(Config.SERVICE_IDENTIFIER.GET_SITE_SCHEDULE_DETAILS, inputJSON).subscribe((response) => {
      if (response.status === true) {
        if (this.createTicket.ticketStatus === 'visitScheduled' || this.createTicket.ticketStatus === 'waitingReadiness') {
          this.router.navigate(['ticket-list/ticket-workflow', response.data.ticketId]);
        } else {
          if (this.purchaseOrderId) {
            this.router.navigate(['manage-purchase-order/' + this.purchaseOrderId + '/tickets']);
          } else {
            this.router.navigate(['ticket-list/ticket-details', response.data.ticketId]);
          }
        }

        if (inputJSON.ticketId) {
          this.toastr.success('', 'Ticket Updated Successfully');
        } else {
          this.toastr.success('', 'Ticket Created Successfully');
        }
        // this.toastr.success('', 'Ticket Created Successfully');
      } else {
        this.toastr.error('', 'Failed to save ticket. Please try again later');
      }
    });
  }
  createSite() {
    let postJson = this.createTicket.siteDetails;
    postJson['ticket_type'] = this.createTicket['ticket_type'];
    this._http.post(Config.SERVICE_IDENTIFIER.CREATE_SITE_DETAILS, postJson).subscribe((response) => {
      if (response.status) {

      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchSiteList() {
    const inputJSON = { ticket_type: 'All' }; // { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_SITE_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.siteList = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }

  fetchSiteDetails(siteName) {
    const inputJSON = siteName;
    inputJSON['ticket_type'] = this.createTicket['ticket_type'];
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_SITE_DETAILS, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.createTicket.siteDetails = {
          "siteType": response.data ? response.data.siteType : '',
          "siteId": response.data ? response.data.siteId : '',
          "siteName": response.data ? response.data.siteName : '',
          "place": response.data ? response.data.place : '',
          "district": response.data ? response.data.district : '',
          "state": response.data ? response.data.state : '',
          "country": response.data ? response.data.country : '',
          "landmark": response.data ? response.data.landmark : ''
        }
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  //general section

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.toLowerCase().includes(term) || item.toLowerCase().includes('new');
  }

  selectCountry() {
    this.stateList = Object.keys(this.listStateDistrict[this.createTicket.siteDetails.country]);
  }

  selectState() {
    this.districtList = this.listStateDistrict[this.createTicket.siteDetails.country][this.createTicket.siteDetails.state];
    this.createTicket.siteDetails.district = null;
  }

  selectSite() {
    if (this.siteIsOther) {
      this.createTicket.siteDetails = {
        "siteType": null,
        "siteId": '',
        "siteName": null,
        "place": null,
        "district": null,
        "state": null,
        "country": "India",
        "landmark": null,
      }
    } else {
      this.fetchSiteDetails({ siteName: this.selectedSite });
    }
  }
  get siteIsOther() {
    return this.selectedSite === 'New';
  }

  //contact section

  addContactRow() {
    this.contactRow = {
      name: '',
      designation: '',
      email: '',
      contactNo: null,
      new: true
    };
    if (this.contactTableData.length) {
      this.contactTableData
      this.contactTableData.forEach(item => {
        item.new = false;
      });
    }
    this.contactTableData.unshift(this.contactRow);
  }
  deleteContactRow(index) {
    this.contactTableData.splice(index, 1);
    delete this.contactRow;
  }
  saveContactRow(row) {
    row.new = false;
  }
  editContactRow(row) {
    row.new = true;
  }
  get disableContactSave() {
    if (this.contactTableData.length > 0) {
      if (this.contactRow) {
        if (this.contactRow.name.trim() === '' ||
          this.contactRow.designation.trim() === '' ||
          this.contactRow.email.trim() === '' ||
          this.contactRow.contactNo === null) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  //Purpose section

  addingGoal(index) {
    if (index === (this.goalList.length - 1)) {
      this.goalList.push({ goal: '' });
    }
  }
  blurGoal(index) {
    if (this.goalList[index]['goal'].trim().length === 0) {
      if (index != this.goalList.length - 1) {
        this.goalList.splice(index, 1);
      }
    }
  }


  //Prerquisites section
  addMaterialRow() {
    this.matRow = {
      materialCode: '',
      materialName: '',
      quantity: '1',
      new: true
    };
    this.matTableData.unshift(this.matRow);
  }
  selectMaterial(row, _idx) {
    let _materialCode = this.materialList.filter(x => {
      if (x.name === row.materialName) {
        row.isDeviceId = (x.isDeviceId) ? true : false;
        this.matTableData[_idx]['isDeviceId'] = (x.isDeviceId) ? true : false;
        return true;
      }
    })[0].id;
    if (this.matTableData.some(material => ((material.materialCode === _materialCode) && (material.materialName !== 'others')))) {
      this.toastr.error('', 'Material already selected..!');
      row.materialCode = null;
      row.materialName = null;
    } else {
      row.materialCode = _materialCode;
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
    if (this.matTableData.length != 0 &&
      (this.matRow.materialName === null ||
        ((this.matRow.quantity !== null) || (this.matRow.quantity !== undefined)) ? (this.matRow.quantity.trim().length === 0) : false)) {
      return true;
    } else {
      return false;
    }
  }
  get disableMaterialAdd() {
    if (this.matTableData.length != 0 && this.matTableData.some(material =>
      material.materialCode == null || material.materialName === null
    )) {
      return true;
    }
  }


  //bottom section
  previous() {
    if (this.activeTab === 'siteDetails') {
      this.contactTableData.forEach((item, index) => {
        if (item.name.trim() === '' ||
          item.designation.trim() === '' ||
          item.email.trim() === '' ||
          item.contactNo === null) {
          this.contactTableData.splice(index, 1);
        } else {
          item.new = false;
        }
      });
    }
    delete this.contactRow;
    this.activeTab = this.activeTab === 'siteDetails' ? 'general' :
      this.activeTab === 'purpose' ? 'siteDetails' :
        this.activeTab === 'prerequisites' ? 'purpose' :
          this.activeTab === 'engineers' ? 'prerequisites' : '';
  }
  next() {
    if (this.activeTab === 'purpose') {
      this.createTicket.keyGoals = [];
      this.goalList.forEach((item, index) => {
        let keyGoals = {
          goalId: index,
          goal: '',
          status: 'Not Completed',
          notes: ''
        }
        if (item['goal'].trim().length != 0) {
          keyGoals.goal = item['goal'];
          this.createTicket.keyGoals.push(keyGoals);
        }
      });
      delete this.contactRow;
    } else if (this.activeTab === 'general') {
      this.fetchSiteList();
    } else if (this.activeTab === 'siteDetails') {
      this.createTicket.siteContact = [];
      this.contactTableData.forEach((item, index) => {
        if (item.name.trim() === '' ||
          item.designation.trim() === '' ||
          item.email.trim() === '' ||
          item.contactNo === null) {
          this.contactTableData.splice(index, 1);
        }
        item.new = false;
      });

      this.contactTableData.forEach((item) => {
        let siteContact = {
          name: item.name,
          designation: (item.designation !== 'Other') ? item.designation : item.newDesignation,
          email: item.email,
          contactNo: item.contactNo
        }
        this.createTicket.siteContact.push(siteContact);
      });
      this.createSite();
    }
    this.activeTab = this.activeTab === 'general' ? 'siteDetails' :
      this.activeTab === 'siteDetails' ? 'purpose' :
        this.activeTab === 'purpose' ? 'prerequisites' :
          this.activeTab === 'prerequisites' ? 'engineers' : '';

  }
  finish() {
    if (this.createTicket.category === 'Site Issues') {
      this.createTicket.category = "Site Issue: " + this.issueText;
    }
    this.createTicket.materialsRequired = [];
    if (this.matTableData.length != 0) {
      this.matTableData.forEach((item) => {
        let matRow = {
          materialCode: item.materialCode,
          materialName: (item.materialName !== 'others') ? item.materialName : item.newMaterialName,
          deviceId: item.deviceId,
          quantity: item.quantity,
          isDeviceId: item.isDeviceId ? item.isDeviceId : false
        };
        this.createTicket.materialsRequired.push(matRow);
      });
    }
    this.createTicketCall();
  }
  // This function returns date time string in "28-08-2019T12:14:00Z"
  formatDateTime(date) {
    const temp = new Date(date);
    let month = '' + (temp.getMonth() + 1);
    let day = '' + temp.getDate();
    const year = temp.getFullYear();
    month = month.length < 2 ? '0' + month : month;
    day = day.length < 2 ? '0' + day : day;

    let hours = '' + temp.getHours();
    let minutes = '' + temp.getMinutes();
    let seconds = '' + temp.getSeconds();
    hours = hours.length < 2 ? '0' + hours : hours;
    minutes = minutes.length < 2 ? '0' + minutes : minutes;
    seconds = seconds.length < 2 ? '0' + seconds : seconds;

    const formattedDate = [year, month, day].join('-');
    const formattedTime = [hours, minutes, seconds].join(':');

    return formattedDate + 'T' + formattedTime + 'Z';
  }

  validateEmail(row) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(row.email)) {
      return false;
    } else if (row.email != '') {
      return true;
    }
  }
  validatePhone(row) {
    if (row.contactNo != null) {
      if (row.contactNo.toString().length < 10 || row.contactNo.toString().length > 12) {
        return true;
      }
    }
  }

  get nextDisabled() {
    if (this.activeTab === 'general') {
      if (this.createTicket.purposeDescription ? this.createTicket.purposeDescription.trim().length === 0 : true ||
        this.createTicket.ticket_type === null ||
        this.createTicket.expectedStartDate === null ||
        this.createTicket.expectedEndDate === null ||
        this.createTicket.category === null || ((this.createTicket.category === 'Site Issues' && this.issueText === null))) {
        return true;

      }
    } else if (this.activeTab === 'siteDetails') {
      if (this.createTicket.siteDetails) {
        if (this.createTicket.siteDetails.district === null ||
          this.createTicket.siteDetails.country === null ||
          this.createTicket.siteDetails.place.trim().length === 0 ||
          this.createTicket.siteDetails.siteName.trim().length === 0 ||
          this.createTicket.siteDetails.siteId.trim().length === 0 ||
          this.createTicket.siteDetails.state === null ||
          this.contactTableData.length === 0 ||
          this.disableContactSave) {
          return true;
        }
      }
    } else if (this.activeTab === 'purpose') {
      if (this.goalList.length === 1) {
        return true;
      }
    } else if (this.activeTab === 'prerequisites') {
      if (this.goalList.length === 1) {
        return true;
      }
    }
  }
  get finishDisabled() {
    if (this.matTableData.length > 0 &&
      this.matTableNotFill ||
      (this.matTableData.length === 0)) {
      return true;
    } else {
      return false;
    }
  }
  get matTableNotFill() {
    return this.matTableData.some(mat =>
      mat.materialCode == '' || mat.materialName === ''
    )
  }
}
