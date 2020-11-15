
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from '../../config/config';
import { SessionService } from 'src/app/services/session.service';
import { Condition } from 'selenium-webdriver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-workflow',
  templateUrl: './ticket-workflow.component.html',
  styleUrls: ['./ticket-workflow.component.scss']
})
export class TicketWorkflowComponent implements OnInit {

  public description = '';
  public showConfirmation = false;
  public confirmJson = {
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public userRole;
  public visitSatus = 'Start Visit';
  public ticketId = {
    ticketId: null
  };
  public message = '';
  public activeTab = 'ticketDetails';
  public engineersList = [];
  public emailsList = [];
  public templateData = { templateId: null, templateName: null };

  public readinessCondition = undefined;
  public readinessConditionData;
  public templateTypeList = [];
  public ticketDetails;
  public checkBoxFlag;
  public fileData;
  public fileUpload = {
    documentName: '',
    data: ''
  };
  public uploadFileDetails = [];
  public uploadMessage;

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
    this.fetchTicketDetails();
  }

  fetchTicketDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_DETAILS, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails = response.data;
        this.updateReadStatus();
        this.fetchTemplates();
        if (this.ticketDetails.ticketStatus === 'waitingReadiness') {
          this.activeTab = 'readinessStatus';
          this.readinessCondition = this.ticketDetails.siteReadinessStatus.requirements;
          this.templateData.templateId = this.ticketDetails.siteReadinessStatus.templateId;
          this.templateData.templateName = this.ticketDetails.siteReadinessStatus.templateName;
          if (this.ticketDetails.siteReadinessStatus.hasOwnProperty('description')) {
            this.description = this.ticketDetails.siteReadinessStatus.description;
          }
        }
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  updateReadinessStatus() {
    let postJson = {
      ticketId: this.ticketId.ticketId,
      siteReadinessStatus: {
        templateId: this.templateData.templateId,
        templateName: this.templateData.templateName,
        requirements: this.readinessCondition,
        description: this.description
      }
    };
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_READINESS_STATUS, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Readiness Status Saved Successfully');
        this.ticketDetails.siteReadinessStatus = response.data;
        if (this.ticketDetails.ticketStatus === 'waitingForReadiness') {
          this.activeTab = 'readinessStatus';
        }
      } else {
        this.toastr.error('', response.message);
      }
    });
  }

  actionPerformed(event) {
    if (event.action) {
      this.assignEngineersService();
    }
    this.showConfirmation = false;
  }
  assignEngineersConfirmartion() {
    this.confirmJson.title = 'Schedule this site visit?';
    this.showConfirmation = true;
  }
  assignEngineersService() {
    const postJson = {
      ticketId: this.ticketId.ticketId,
      assignedEngineers: this.engineersList
    };
    this._http.post(Config.SERVICE_IDENTIFIER.ASSIGN_ENGINEERS, postJson).subscribe((response) => {
      if (response.status === true) {
        this.message = response.message;
        this.sendEmailNotifications();
        this._router.navigate(['/ticket-list']);
        this.toastr.success('', 'Site Visit Scheduled Successfully');
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  sendEmailNotifications() {
    const emailIds = [];
    for (let i = 0; i < this.emailsList.length - 1; i++) {
      emailIds.push(this.emailsList[i]['email']);
    }
    const postJson = {
      ticketId: this.ticketId.ticketId,
      ticket_type: this.ticketDetails['ticket_type'],
      emailId: emailIds
    };
    this._http.post(Config.SERVICE_IDENTIFIER.SEND_EMAIL_NOTIFICATION, postJson).subscribe((response) => {
      if (response.status) {
      } else {
        this.toastr.error('', response.message);
      }
    });
  }

  selectTemplateType(event) {
    this.fetchTemplateData(event);
  }

  fetchTemplateData(event) {
    const postJson = {
      templateId: event.templateId,
      ticket_type: this.ticketDetails['ticket_type']
    };
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_READINESS_TEMPLATE, postJson).subscribe((response) => {
      if (response.status === true) {
        this.readinessCondition = response.data.site_readiness_requirements;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchTemplates() {
    const inputJSON = { ticket_type: this.ticketDetails['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_TEMPLATES, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.templateTypeList = response.data;
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
  startVisit() {
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_TICKET_STATUS_START, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails.ticketStatus = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  finishVisit() {
    this._http.post(Config.SERVICE_IDENTIFIER.UPDATE_TICKET_STATUS_FINISH, this.ticketId).subscribe((response) => {
      if (response.status === true) {
        this.ticketDetails.ticketStatus = response.data;
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
  engineersListUpdate(event) {
    this.engineersList = [];
    this.engineersList = event.engineersList;
    this.emailsList = event.emails;
  }
  goalStatusUpdate(goal) {
    goal.status = !goal.status;
    this.updateGoalStatusService(goal);
  }

  nextUpdateReadinessStatus() {
    this.updateReadinessStatus();
    this.activeTab = 'assignEngineers';
  }
  completeGoal(goal) {
    goal.status = 'completed';
  }
  incompleteGoal(goal) {
    goal.status = 'incomplete';
  }
  partialcompleteGoal(goal) {
    goal.status = 'partial';
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
  updateAllCondition() {
    if (this.checkAllCondition()) {
      this.readinessCondition.forEach(condition => {
        condition.status = 'waiting';
      });
    } else {
      this.readinessCondition.forEach(condition => {
        condition.status = 'ready';
      });
    }
  }

  checkAllCondition() {
    try {
      if (this.readinessCondition) {
        return this.readinessCondition.some(condition => condition.status === 'ready');
      }
    } catch (e) {
      console.log(e);
    }
  }
  get nextDisabled() {
    try {
      if (this.readinessCondition.length) {
        return this.readinessCondition.every(condition => condition.status === 'ready');
      } else if (this.description.trim().length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }
  get proceedDisabled() {
    if (this.engineersList.length === 0) {
      return true;
    }
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
    if (condition.status === 'ready') {
      return true;
    }
  }
  notReadyCheck(condition) {
    if (condition.status === 'notReady') {
      return true;
    }
  }
  waitingCheck(condition) {
    if (condition.status === 'waiting') {
      return true;
    }
  }
  saveConditionNotes(condition) {
    condition.notes = condition.notes.trim();
  }
  statusParser(status) {
    let tabList = [
      { value: 'submitted', label: 'Submitted' },
      { value: 'waitingReadiness', label: 'Waiting Readiness' },
      { value: 'visitScheduled', label: 'Visit Scheduled' },
      { value: 'onSite', label: 'On site' },
      { value: 'completed', label: 'Completed' }];

    let statusDict = tabList.filter(item => item.value === status);
    return statusDict[0].label;
  }

  get showGoalActions() {
    if (this.userRole === 'siteEngineer') {
      return true;
    }
  }

  get showUploadFiles() {
    if (this.userRole === 'siteEngineer' && this.ticketDetails.ticketStatus === 'on site') {
      return true;
    }
  }
  get showUploadDetails() {
    if ((this.userRole === 'siteEngineer' || this.userRole === 'manager') && (this.ticketDetails.ticketStatus === 'on site' || this.ticketDetails.ticketStatus === 'submitted')) {
      return true;
    }
  }
  get checkGoal() {
    if (this.userRole === 'siteEngineer' && this.ticketDetails.ticketStatus === 'on site') {
      return true;
    }
  }
}
