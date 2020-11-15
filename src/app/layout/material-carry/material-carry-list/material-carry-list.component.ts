import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router } from '@angular/router';
import { Config } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-material-carry-list',
  templateUrl: './material-carry-list.component.html',
  styleUrls: ['./material-carry-list.component.scss']
})
export class MaterialCarryListComponent implements OnInit {

  a = {
    status: true,
    message: 'Users listed Successfully',
    data: {
      tableData: {
        bodyContent: [
          {
            userID: 'sangeetha',
            fullName: 'Sangeetha B',
            userRole: 'Site Engineer',
            materialsCarrying: 10,
            totalMaterialsCarried: 90,
            totalMaterialsReturned: 80
          }
        ],
        headerContent: [
          {
            key: 'userID',
            label: 'User ID'
          },
          {
            key: 'fullName',
            label: 'Name'
          },
          {
            key: 'userRole',
            label: 'User Role'
          },
          {
            key: 'materialsCarrying',
            label: 'Materials Carrying'
          },
          {
            key: 'totalMaterialsCarried',
            label: 'Total Materials Carried'
          },
          {
            key: 'totalMaterialsReturned',
            label: 'Total Materials Returned'
          }
        ]
      }
    }
  };

  userList = {
    headerContent: [],
    bodyContent: []
  };
  tableOptions: { pageLength: number; order: (string | number)[][]; lengthMenu: number[]; };

  constructor(
    private _http: HttpLayerService,
    private _router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tableOptions = {
      pageLength: 10,
      order: [[5, 'asc']],
      lengthMenu: [5, 10, 20]
    };
    this.fetchUserList();
    this.userList = this.a.data.tableData;
  }

  fetchUserList() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_MATERIAL_CARRY_LIST, {}).subscribe((response) => {
      if (response.status === true) {
        this.userList = response.data.tableData;
      } else {
        this.toastr.error('', response.message);
      }
    }, error => {
    });
  }

  navigateToUserDetails(body) {
    this._router.navigate(['/materials-carry/details', body.userID]);
  }
}
