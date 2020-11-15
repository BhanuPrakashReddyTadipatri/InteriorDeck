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
  selector: 'app-manage-site-expense',
  templateUrl: './manage-site-expense.component.html',
  styleUrls: ['./manage-site-expense.component.scss']
})
export class ManageSiteExpenseComponent implements OnInit {

  public contactTableData: Array<any> = [];
  public dateRange: Date[];
  public goalNotes: String;
  public districtList = [];
  public stateList = [];
  public selectedSite;
  public issueText = null;

  public todayDate: Date;

  public categoryList = [];
  public ticketTypesList = []; // [{id: 'GLens', name: 'GLens'}, {id: 'glens_labs', name: 'GLens Labs'}];
  public siteList = [];
  public expensesType = [
    "Travel",
    "Accommodation",
    "Food",
    "Others"
  ];
  public ticketNumbers = [];
  public userRole;

  public usersList = [];

  public engineersList = [];

  public siteExpenses1 = {
    'ticketId': '',
    'siteName': '',
    'amount': '',
    'file': null
  }
  public siteExpenses: any = []
  public comments: any;
  public file: any;
  public files: any;
  public commentListData: any;

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

  public route;
  public ticketId: any;
  public expenseId: any;

  constructor(
    private _http: HttpLayerService,
    private _routeObj: ActivatedRoute,
    private router: Router,
    private _session: SessionService,
    public _commute: CommuteProviderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.ticketId = params['ticketId'];
      this.expenseId = params['expenseId'];
    });
  }

  public _opened: boolean = true;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

  ngOnInit() {
    this.userRole = this._session.api.local.get(Config.USER_ROLE);
    this.addAccordion();
    this.fetchSiteList();
    this.getComments();
    if (this.ticketId) {
      this.fetchSiteVisitDetails();
      this.fetchSiteList();
    }
    this.initializeNewSiteVisitForm();
  }

  initializeNewSiteVisitForm() {
    this.todayDate = new Date();
    this.fetchUserList();
    this.createTicket.requestedBy = this._session.api.local.get(Config.USER_IDENTIFIER);
    // this.fetchMaterialsList();
    this.fetchTicketTypes();
  }
  fetchSiteVisitDetails() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_TICKET_DETAILS, { ticketId: this.ticketId }).subscribe((response) => {
      if (response.status === true) {
        this.createTicket['ticketId'] = response.data['ticketId'];
        this.createTicket['ticket_type'] = response.data['ticket_type'] ? response.data['ticket_type'] : 'GLens';
        this.fetchCategoriesList();
        // this.fetchSiteList();
        this.createTicket['category'] = response.data['general']['category'];
        this.createTicket['purposeDescription'] = response.data['general']['purposeDescription'];
        this.createTicket['expectedStartDate'] = response.data['general']['expectedStartDate'];
        this.createTicket['expectedEndDate'] = response.data['general']['expectedEndDate'];
        this.selectedSite = response.data['siteDetails']['siteName'];
        this.createTicket['ticketStatus'] = response.data['ticketStatus'];
        this.selectSite();
        this.contactTableData = response.data['siteContact'];
        this.ticketNumbers['ticketId'] = response.data['ticketId']
      }
    });
  }
  //service functions
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
  fetchCategoriesList() {
    const inputJSON = { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_CATEGORIES_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.categoryList = response.data['category'];
      }
    });
    this.categoryList = ["Site Issues", "RC-Kit Installation", "New Site Commissioning", "Remote Calibration", "New Camera Connectivity", "New Display Board Configuration", "AMC Visit", "Training Related Visit", "Old Site", "Other"];
  }


  createTicketCall() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_SITE_SCHEDULE_DETAILS, this.createTicket).subscribe((response) => {
      if (response.status === true) {
        if (this.createTicket.ticketStatus === 'visitScheduled' || this.createTicket.ticketStatus === 'waitingReadiness') {
          this.router.navigate(['ticket-list/ticket-workflow', response.data.ticketId]);
        } else {
          this.router.navigate(['ticket-list/ticket-details', response.data.ticketId]);
        }
        this.toastr.success('', 'Ticket Created Successfully');
      } else {
        this.toastr.error('', response.message);
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
    const inputJSON = { ticket_type: this.createTicket['ticket_type'] };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_SITE_LIST, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.siteList = response.data;
        this.siteList.unshift("New");
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

  finish() {
    if (this.createTicket.category === 'Site Issues') {
      this.createTicket.category = "Site Issue: " + this.issueText;
    }
    this.createTicket.materialsRequired = [];
    this.createTicketCall();
  }

  saveExpenses() {
    this.toastr.success('', 'Ticket Created Successfully');
    this.router.navigate(['site-expenses-list']);
  }

  addAccordion() {
    for (let i = 1; i <= 1; i++) {
      this.siteExpenses.push({
        "ticketId": "",
        "siteName": "",
        "comments": "",
        "file": "",
        "expensesList": [
          {
            "expensesType": "",
            "newExpensesType": "",
            "description": "",
            "amount": ""
          }
        ]
      })
    }
  }
  deleteAccordion(index) {
    this.siteExpenses.splice(index, 1);
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files;
    }
  }
  saveComments() {
    // this._http.get(Config.SERVICE_IDENTIFIER.SAVE_COMMENTS,this.comments).subscribe((response) =>{
    //     if(response.status === true){
    //       this.comments = response.data
    //     }
    //   });
  }

  getComments() {
    let postJson = {};
    postJson['ticketId'] = this._routeObj.snapshot.params["ticketId"];
    this._http.get(Config.SERVICE_IDENTIFIER.COMMENT_LIST, postJson).subscribe(commentList => {
      try {
        if (commentList.status) {
          this.commentListData = commentList.data.comments;
        } else {
          this.commentListData = undefined;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  fetchTicketNumbers() {
    this._http.get(Config.SERVICE_IDENTIFIER.TICKETNUMBERS).subscribe((response) => {
      if (response.status === true) {
        this.ticketNumbers = response.data;
      }
    });
  }

  disabledsave() {
    if (!this.siteExpenses['siteName']) {
      return true;
    } else {
      return false;
    }
  }

  fetchfiles() {

  }

}


