import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from '../../config/config';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  public userRole;
  public userName;
  public visitSatus = 'Start Visit';
  public ticketId = {
    ticketId: null
  };
  public momData = {
    documentId: null,
    documentName: null,
    uploadedTime: null
  };
  public ticketDetails;
  public checkBoxFlag;
  public fileData;
  public fileUpload = {
    documentName: '',
    data: ''
  };
  public uploadFileDetails = [];
  public uploadMessage;
  public engineerAvatar;
  public timeLine = {};

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
    this.userRole = this._session.api.local.get(Config.USER_ROLE);
    this.userName = this._session.api.local.get(Config.USER_IDENTIFIER);
    this.fetchTicketDetails();
    this.updateReadStatus();
    this.fetchEngineerDetails();
  }

  editSiteVisit(ticketId) {
    this._router.navigate(['schedule-site-visit/', ticketId]);
  }
  checkEditAvailability(ticketDetails) {
    if (this.userRole === 'manager') {
      if (ticketDetails['ticketStatus'] === 'submitted' || ticketDetails['ticketStatus'] === 'waitingReadiness') {
        return true;
      }
    }
    return false;
  }
  fetchTicketDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_DETAILS, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails = response.data;
        if (this.showUploadDetails) {
          this.fetchFileDetails();
          this.fetchMOMDetails();
        }
        this.fetchActivityTimeline();
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchEngineerDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_ENGINEER_ICON, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.engineerAvatar = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
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
  downloadMomManager(momId) {
    const url = Config.SERVICE_IDENTIFIER.DOWNLOAD_MOM_FILE_MANAGER + '/' + this.userName + '/' + this.ticketId.ticketId + '/' + 'doc/' + momId;
    window.open(url);
  }
  updateReadStatus() {
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_READ_STATUS, this.ticketId).subscribe((response) => {
      if (response.status) {
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  updateGoalStatusService(goal) {
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_GOAL_STATUS, goal).subscribe((response) => {
      if (response.status) {
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  goalStatusUpdate(goal) {
    goal.status = !goal.status;
    this.updateGoalStatusService(goal);
  }

  completeGoal(goal) {
    goal.status = 'completed'
  }
  incompleteGoal(goal) {
    goal.status = 'incomplete'
  }
  partialcompleteGoal(goal) {
    goal.status = 'partial'
  }
  completeCheck(goal) {
    if (goal.status === 'completed') {
      return true;
    }
  }
  incompleteCheck(goal) {
    if (goal.status === 'incomplete') {
      return true;
    }
  }
  partialCheck(goal) {
    if (goal.status === 'partial') {
      return true;
    }
  }
  saveGoal(goal) {
    goal.notes = goal.notes.trim();
  }

  downloadFile(downloadId) {
    const url = Config.SERVICE_IDENTIFIER.DOWNLOAD_FILE + '/' + this.userName + '/' + this.ticketId.ticketId + '/' + 'doc/' + downloadId;
    window.open(url);
  }
  downloadMOM(docId) {
    const url = Config.SERVICE_IDENTIFIER.DOWNLOAD_FILE + '/' + this.userName + '/' + this.ticketId.ticketId + '/' + 'mom/' + docId;
    window.open(url);
  }
  createMOM() {
    const url = Config.SERVICE_IDENTIFIER.CREATE_MOM + '/' + this.ticketId.ticketId + '/' + this.userName + '/' + this.userRole;
    window.open(url);
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
  fetchActivityTimeline() {
    this._http.post(Config.SERVICE_IDENTIFIER.ACTIVITY_TIMELINE, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.timeLine = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  ready(condition) {
    if (condition.status === 'ready') {
      condition.status = '';
    } else {
      condition.status = 'ready';
    }
  }
  notReady(condition) {
    if (condition.status === 'notReady') {
      condition.status = '';
    } else {
      condition.status = 'notReady';
    }
  }
  waiting(condition) {
    if (condition.status === 'waiting') {
      condition.status = '';
    } else {
      condition.status = 'waiting';
    }
  }
  readyCheck(condition) {
    if (condition.status == 'ready') {
      return true;
    }
  }
  notReadyCheck(condition) {
    if (condition.status == 'notReady') {
      return true;
    }
  }
  waitingCheck(condition) {
    if (condition.status == 'waiting') {
      return true;
    }
  }
  get showDownloadMOM() {
    if (this.userRole === 'manager' && this.ticketDetails.ticketStatus === 'visitScheduled') {
      return true;
    }
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
  get readinessDescription() {
    if (this.ticketDetails.siteReadinessStatus.hasOwnProperty('description')) {
      return true;
    } else {
      return false
    }
  }

  get showReadiness() {
    if (this.userRole === 'manager') {
      return true;
    }
  }
  get showUploadDetails() {
    if ((this.userRole === 'siteEngineer' || this.userRole === 'manager')) {
      return true;
    }
  }
  get showGoalActions() {
    if ((this.ticketDetails.ticketStatus === 'onSite' || this.ticketDetails.ticketStatus === 'completed') && (this.userRole === 'manager' || this.userRole === 'siteEngineer')) {
      return true;
    }
  }
  get showAssignedEngineers() {
    if ((this.userRole === 'manager' || this.userRole === 'siteEngineer') && this.ticketDetails.hasOwnProperty('assignedEngineers') && this.ticketDetails.assignedEngineers.length > 0) {
      return true;
    }
  }
  get showMaterials() {
    if (this.ticketDetails.materialsRequired.length > 0) {
      return true;
    }
  }
  get showaAvatar() {
    if (this.userRole === 'manager' || this.userRole === 'siteEngineer') {
      return true;
    }
  }
  get timeLineHaveData() {
    if(this.timeLine.hasOwnProperty('ticketCreatedTime')) {
      return true;
    }
  }
}