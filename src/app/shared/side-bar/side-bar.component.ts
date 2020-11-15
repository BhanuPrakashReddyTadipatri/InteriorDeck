import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../config/config';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnChanges {

  @Input('pageName') getpageName: any;
  @Output() loadPreviousDashboard: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadSldPage: EventEmitter<any>;

  public sideMenus: any;
  public heading: any;
  public flag = false;
  public headingSingular: any;
  public sidebarChanged: boolean;
  public sidebarList: any = [];
  public configurationsList: any;
  public userRole = this.session.api.local.get(Config.USER_ROLE);


  constructor(
    private router: Router,
    private http: HttpLayerService,
    private toastr: ToastrService,
    private session: SessionService,
  ) {
    this.loadSldPage = new EventEmitter<any>();
  }

  ngOnInit() {
    this.fetchSidebarList();
  }

  fetchSidebarList() {
    try {
      const postJSON = {};
      this.http.get(Config.JSON_IDENTIFIER.getSideBar).subscribe((response) => {
        if (response.status === true) {
          if (this.userRole && response[this.userRole] !== undefined) {
            this.sidebarList = response[this.userRole];
          } else {
            this.sidebarList = [];
          }
          if (this.sidebarList.length) {
            // Seperating configurations tab logic
            const index = this.sidebarList.findIndex(menu => menu.label === 'Configurations');
            if (index > -1) {
              this.configurationsList = JSON.parse(JSON.stringify(this.sidebarList[index]));
              this.sidebarList.splice(index, 1);
            }
          }
        } else {
          this.sidebarList = [];
        }
        // tslint:disable-next-line: align
      }, (error) => {
        console.log(error);
        this.sidebarList = [];
      });
    } catch (error) {
      console.log(error);
      this.sidebarList = [];
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (document.querySelector('#sideMenuList .active')) {
        document.querySelector('#sideMenuList .active').scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }

  mouseEnter() {
    try {
      if (document.body.classList.contains('pin-sidebar')) { } else {
        document.body.classList.add('overlay-sidebar');
      }
    } catch (error) {
      console.log(error);
    }
  }

  mouseLeave() {
    try {
      if (document.body.classList.contains('pin-sidebar')) { } else {
        document.body.classList.remove('overlay-sidebar');
      }
    } catch (error) {
      console.log(error);
    }
  }

  getSidebarMenus(pageName, flag?: any) {
    try {
      this.headingSingular = this.heading = pageName;
      let currentMenu;
      if (pageName !== 'Configurations') {
        currentMenu = this.sidebarList.find(menu => menu.label === pageName);
      } else {
        currentMenu = this.configurationsList;
      }
      if (currentMenu) {
        this.sidebarChanged = false;
        if (currentMenu.children) {
          this.sideMenus = [];
          const sideMenus = JSON.parse(JSON.stringify(currentMenu.children));
          sideMenus.forEach(element => {
            if (element.display) {
              this.sideMenus.push(element);
            }
          });
          if (document.body.classList.contains('no-sidebar')) {
            document.body.classList.remove('no-sidebar');
          }
        } else {
          document.body.classList.add('no-sidebar');
          this.router.navigate([currentMenu.route]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  loadDefaultDashBoard() {
    try {
      this.loadPreviousDashboard.emit();
    } catch (error) {
      console.log(error);
    }
  }
  emitSideBar(event) {
    try {
      this.loadSldPage.emit(event.data);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnChanges() {
    try {
      document.body.classList.add('no-sidebar');
      if (this.sidebarList) {
        if (this.sidebarList.length) {
          this.getSidebarMenus(this.getpageName, true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}

