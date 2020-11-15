import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();


  public deleteUserId;
  public userList;
  public showConfirmation = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };



  public userTable = {
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
          label: 'Add User',
          type: 'addnew',
          icon: 'fa fa-plus',
        },
        {
          action: 'refresh',
          label: 'Refresh',
          type: 'refresh',
          icon: 'fa fa-refresh',
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
            key: 'userID',
            label: 'User ID',
          },
          {
            key: 'firstName',
            label: 'First Name',
          },
          {
            key: 'lastName',
            label: 'Last Name',
          },
          {
            key: 'userRole',
            label: 'User Role',
          },
          {
            key: 'createTime',
            label: 'Created On',
          },
          {
            key: 'lastLogin',
            label: 'Last Login',
          },
        ],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['userID']
    }
  };



  constructor(
    private _http: HttpLayerService,
    private _router: Router,
    private _route: ActivatedRoute,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.fetchUserList();
  }

  fetchUserList() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_USER_LIST, null).subscribe((response) => {
      if (response.status === true) {
        this.userTable = {
          ...this.userTable,
          tableData: response.data.tableData,
        };
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  deleteUserService() {
    let postJson = {
      userID: this.deleteUserId
    }
    this._http.post(Config.SERVICE_IDENTIFIER.DELETE_USER, postJson).subscribe((response) => {
      if (response.status === true) {
        this.toastr.success('', 'User Deleted Successfully');
        this.fetchUserList();
      }
      else {
        this.toastr.error('', response.message);
      }
    });
  }
  actionPerformed(event) {
    if (event.action) {
      if (this.confirmJson.type === 'delete_user') {
        this.deleteUserService();
      }
    }
    this.showConfirmation = false;
  }

  createUser() {
    this._router.navigate(['user-list/user-management', '', 'new']);
  }
  deleteUser(userID) {
    this.deleteUserId = userID;
    this.confirmJson.type = 'delete_user';
    this.confirmJson.title = "Delete User";
    this.confirmJson.message = "Are you sure you want to delete this user?";
    this.showConfirmation = true;
  }
  editUser(userID) {
    this._router.navigate(['user-list/user-management', userID, 'edit']);
  }
  navigateToUser(body) {
    this._router.navigate(['user-list/user-management', body['userID'], 'edit']);
  }





  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchUserList();
          break;
        case 'addnew':
          this.createUser();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.navigateToUser(event.data);
          break;
        case 'delete':
          this.deleteUser(event.data);
          break;
        case 'cellClick':
          this.navigateToUser(event.data);
          break;
      }
    } catch (error) {
      console.log(error);
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
