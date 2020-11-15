import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from '../../config/config';
import { SessionService } from 'src/app/services/session.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sites-management',
  templateUrl: './sites-management.component.html',
  styleUrls: ['./sites-management.component.scss']
})
export class SitesManagementComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();


  @ViewChild(CdkVirtualScrollViewport)
  private readonly scrollRef: CdkVirtualScrollViewport;
  @ViewChild('manageSitePopup') manageSitePopup;
  public listStateDistrict;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };
  public showConfirmation = false;
  public filterTickets: any;
  public sitesList = [];
  public districtList = [];
  public stateList = [];
  public countryList = [];
  public searchKeys: any = ['siteName', 'lastUpdatedBy', 'lastUpdatedTime'];
  public userRole;
  public selectedSite = undefined;


  public sitesTable = {
    tableActions: {
      actions: [
        {
          action: 'edit',
          label: 'Edit',
          type: 'edit',
          onlyIcon: true,
          icon: 'fa fa-pencil-alt',
        },
        {
          action: 'delete',
          label: 'Delete',
          type: 'delete',
          onlyIcon: true,
          icon: 'fa fa-trash-alt',
        },
      ],
      enableActions: true,
      externalActions: [
        {
          action: 'addnew',
          label: 'Add Site',
          type: 'addnew',
          icon: 'fa fa-plus',
        },
        {
          action: 'refresh',
          label: 'Refresh',
          type: 'refresh',
          icon: 'fa fa-refresh',
        },
        {
          action: 'downloadNew',
          label: 'Download',
          type: 'downloadNew',
          icon: 'fa fa-download',
        },
      ],
      columnSearch: {
        enable: true,
        searchExceptions: [],
      },
      columnSort: {
        enable: true,
        sortExceptions: [],
      },
      showSerialNumber: true,
      stylings: {
        height: 'calc(100vh - 265px)',
      },
      columnFilter: {
        show: true,
        minimumColumns: 2,
        defaultColumnsToDisplay: [
          {
            key: 'siteName',
            label: 'Site Name',
          },
          {
            key: 'industry',
            label: 'Industry',
          },
          {
            key: 'city',
            label: 'City',
          },
          {
            key: 'district',
            label: 'District',
          },
          {
            key: 'state',
            label: 'State',
          },
          {
            key: 'country',
            label: 'Country',
          },
        ],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['siteName']
    }
  };

  constructor(
    private http: HttpLayerService,
    private session: SessionService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.userRole = this.session.api.local.get(Config.USER_ROLE);
    this.fetchAllSites();
    this.fetchStateDistrictList();
  }
  fetchStateDistrictList() {
    this.http.get(Config.SERVICE_IDENTIFIER.FETCH_STATE_LIST).subscribe((response) => {
      this.listStateDistrict = response;
      this.countryList = Object.keys(this.listStateDistrict);
    });
  }
  selectCountry(event) {
    this.stateList = Object.keys(this.listStateDistrict[this.selectedSite.country]);
    this.selectedSite['state'] = null;
    this.selectedSite['district'] = null;
  }

  selectState() {
    this.districtList = this.listStateDistrict[this.selectedSite.country][this.selectedSite.state];
    this.selectedSite.district = null;
  }
  checkEditAvailability() {
    if ((this.userRole === 'manager') || (this.userRole === 'accounts')) {
      return true;
    }
    return false;
  }
  isManagerLogin() {
    return (this.userRole === 'manager');
  }
  editSite(site) {
    this.selectedSite = JSON.parse(JSON.stringify(site));
    this.openPopup();
  }
  fetchAllSites() {
    this.http.post(Config.SERVICE_IDENTIFIER.listSitesInTableFormat, { ticket_type: 'All' }).subscribe((response) => {
      if (response.status === true) {
        this.sitesTable = {
          ...this.sitesTable,
          tableData: response.data.tableData,
        };
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteSite() {
    const postJson = this.selectedSite;
    this.http.post(Config.SERVICE_IDENTIFIER.deleteSite, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'Site deleted successfully');
        this.fetchAllSites();
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteSiteConfirmation(bodySubscript) {
    this.selectedSite = bodySubscript;
    this.confirmJson.type = 'deleteSite';
    this.confirmJson.title = 'Delete Site';
    this.confirmJson.message = 'Are you sure you want to delete the Site?';
    this.showConfirmation = true;
  }
  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'deleteSite') {
        this.deleteSite();
      }
    }
    this.showConfirmation = false;
  }

  getDateTimeForExport() {
    const d = new Date();
    const dformat = [
      d.getDate(),
      d.getMonth() + 1,
      d.getFullYear()].join('-') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }

  exportToExcel() {
    const tabName = 'sitesList';
    this.http.downloadExcel(this.sitesTable.tableData, tabName + '(' + this.getDateTimeForExport() + ')');
  }

  addNewSitePopup() {
    this.editSite({});
  }

  openPopup() {
    this.modalService.open(this.manageSitePopup).result.then((result) => {

    }, (reason) => {

    });
  }

  saveSite() {
    this.selectedSite.ticket_type = 'All';
    this.selectedSite.place = this.selectedSite.city || '';
    this.selectedSite.landmark = '';
    const inputJSON = JSON.parse(JSON.stringify(this.selectedSite));
    inputJSON.type = this.selectedSite.siteId ? 'update' : 'add';
    this.http.post(Config.SERVICE_IDENTIFIER.createSiteUpdated, inputJSON).subscribe((response) => {
      if (response.status === true) {
        this.toastr.error('', 'Site saved successfully');
        this.fetchAllSites();
      } else {
        this.toastr.error(response.message, 'Failed to save site');
      }
    });
  }



  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchAllSites();
          break;
        case 'addnew':
          this.addNewSitePopup();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'downloadNew':
          this.exportToExcel();
          break;
        case 'edit':
          this.editSite(event.data);
          break;
        case 'delete':
          this.deleteSiteConfirmation(event.data);
          break;
        case 'cellClick':
          this.editSite(event.data);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  reloadTable() {
    try {
      this.tableReloadSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }

}
