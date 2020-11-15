import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { HttpLayerService } from './../../services/http-service-layer.service';
import { Config } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
declare const gapi: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userId;
  public profileImage;
  public userName;
  public userRoleLabel;
  public userRole;
  public notificationList = [];
  public settingsList: any;
  public flag = false;
  public showSettings: boolean;
  public ssoLogin: any;
  public roleList = Config.CONSTANTS.USER_ROLES;

  elem: any;
  fullScreenActive: any;

  constructor(
    private _http: HttpLayerService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _session: SessionService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: any,
  ) { }

  ngOnInit() {
    this.ssoLogin = this._session.api.local.get('ssoLogin');
    this.elem = document.documentElement;
    this.fullScreenActive = false;
    this.userRole = this._session.api.local.get(Config.USER_ROLE);
    this.userId = this._session.api.local.get(Config.USER_IDENTIFIER);
    this.userRoleLabel = this.roleList.filter(role => {
      return role.value === this.userRole;
    })[0].label;
    this._session.api.local.get(Config.USER_ROLE);
    // setTimeout(() => {
    this.fetchUserBasicInfo({ userID: this.userId });
    // }, 1000);
    this.fetchNotifications();
    this.fetchSettings();
  }

  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenChange($event) {
    this.fullScreenActive = this.document.fullscreen;
  }

  navigateToRoute(url) {
    this._router.navigate([url]);
  }
  navigateToProfile() {
    this._router.navigate(['user-list/user-management', this.userId, 'view']);
  }
  feedbacklist() {
    this._router.navigate(['feedback-list']);
  }
  onLoggedOut() {
    this._session.api.local.clear();
    this._router.navigate(['/login']);
  }

  navigateToTicket(ticketId, ticketStatus) {
    if ((ticketStatus === 'submitted' || ticketStatus === 'waitingReadiness') && this.userRole === 'manager') {
      this._router.navigate(['ticket-list/ticket-workflow', ticketId]);
    } else if (this.userRole === 'manager') {
      this._router.navigate(['ticket-list/ticket-details', ticketId]);
    } else if (this.userRole === 'siteEngineer' && (ticketStatus === 'visitScheduled' || ticketStatus === 'onSite')) {
      this._router.navigate(['ticket-list/engineer-ticket', ticketId]);
    } else {
      this._router.navigate(['ticket-list/ticket-details', ticketId]);
    }
  }

  fetchUserBasicInfo(userID) {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_USER_BASIC_INFO, userID).subscribe((response) => {
      if (response.status === true) {
        this.profileImage = response.data.profilePicture;
        this.userName = response.data.firstName;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchNotifications() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_NOTIFICATIONS, null).subscribe((response) => {
      if (response.status === true) {
        this.notificationList = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }

  fetchSettings() {
    try {
      this._http.get(Config.JSON_IDENTIFIER.FETCH_SETTINGS).subscribe((response) => {
        if (this.userRole && response[this.userRole].length > 0) {
          if (response.status === true) {
            this.showSettings = true;
            this.settingsList = response[this.userRole];
          } else {
            this.toastr.error('', response.message);
          }
        } else {
          this.showSettings = false;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  get sitesManagement() {
    if (this._router.url.includes('sites-management')) {
      return true;
    }
  }

  get activeUsers() {
    if (this._router.url.includes('user-list')) {
      return true;
    }
  }

  get activeCompany() {
    if (this._router.url.includes('dc-config')) {
      return true;
    }
  }

  get feedbackLink() {
    if (this.userRole === 'manager') {
      return true;
    }
  }

  get enableSites() {
    if (this.userRole === 'accounts' || this.userRole === 'manager') {
      return true;
    }
  }

  get enableUsers() {
    if (this.userRole === 'manager') {
      return true;
    }
  }
  get notificationLength() {
    return this.notificationList.length;
  }




  toggleFullscreen(event) {
    try {

      if (!this.fullScreenActive) {
        if (this.elem.requestFullscreen) {
          this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
          /* Firefox */
          this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
          /* IE/Edge */
          this.elem.msRequestFullscreen();
        }
      } else {
        if (this.document.exitFullscreen) {
          this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
          /* Firefox */
          this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
          /* IE/Edge */
          this.document.msExitFullscreen();
        }
      }

    } catch (error) {
      console.error(error);
    }
  }
}
