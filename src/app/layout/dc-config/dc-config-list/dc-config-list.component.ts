import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dc-config-list',
  templateUrl: './dc-config-list.component.html',
  styleUrls: ['./dc-config-list.component.scss']
})
export class DcConfigListComponent implements OnInit {

  private tableReloadSubject: Subject<boolean> = new Subject<boolean>();

  public deleteChallanId;
  public DCList;
  // public tableOptions: any;
  public showConfirmation = false;
  public confirmJson = {
    type: '',
    message: '',
    title: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel'
  };


  public configurationTable = {
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
          label: 'Add Company',
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
            key: 'companyName',
            label: 'Company Name',
          },
          {
            key: 'contactNo',
            label: 'Contact No',
          },
          {
            key: 'companyGstNo',
            label: 'Company Gst No',
          },
          {
            key: 'companyPanNo',
            label: 'Company PAN No',
          },
          {
            key: 'location',
            label: 'Location',
          },
          {
            key: 'email',
            label: 'Email',
          },
        ],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['companyName']
    }
  };



  constructor(
    private http: HttpLayerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.fetchDCConfigList();
  }

  fetchDCConfigList() {
    const payLoad = {};
    try {
      this.http.post(Config.SERVICE_IDENTIFIER.GET_DC_CONFIG_LIST, payLoad).subscribe((response) => {
        if (response.status === true) {
          this.configurationTable = {
            ...this.configurationTable,
            tableData: response.data.tableData,
          };
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  deleteChallanService() {
    try {
      const postJson = {
        companyId: this.deleteChallanId
      };
      this.http.post(Config.SERVICE_IDENTIFIER.DELETE_DC_CONFIG, postJson).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', 'DC Challan Config Deleted Successfully');
          this.fetchDCConfigList();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  actionPerformed(event) {
    try {
      if (event.action) {
        if (this.confirmJson.type === 'company_details') {
          this.deleteChallanService();
        }
      }
      this.showConfirmation = false;
    } catch (error) {
      console.log(error);
    }
  }

  addDeliveryChallanConfig() {
    this.router.navigate(['dc-config/add']);
  }
  
  deleteDC(challanId) {
    this.deleteChallanId = challanId;
    this.confirmJson.type = 'company_details';
    this.confirmJson.title = 'Delete Challan Config';
    this.confirmJson.message = 'Are you sure you want to delete this Config?';
    this.showConfirmation = true;
  }

  editDCconfig(Id) {
    this.router.navigate(['dc-config/edit', Id]);
  }




  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) { return; }
      switch (event['action']['type']) {
        case 'fetchData':
          this.fetchDCConfigList();
          break;
        case 'addnew':
          this.addDeliveryChallanConfig();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.editDCconfig(event.data.companyId);
          break;
        case 'delete':
          this.deleteDC(event.data.companyId);
          break;
        case 'cellClick':
          this.editDCconfig(event.data.companyId);
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
