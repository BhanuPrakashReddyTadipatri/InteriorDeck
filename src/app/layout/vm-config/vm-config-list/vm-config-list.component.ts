import { Component, OnInit } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/config/config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vm-config-list',
  templateUrl: './vm-config-list.component.html',
  styleUrls: ['./vm-config-list.component.scss'],
})
export class VmConfigListComponent implements OnInit {
  private vendorMasterSubject: Subject<boolean> = new Subject<boolean>();

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
          label: 'Add Vendor',
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
        defaultColumnsToDisplay: [],
      },
    },
    tableData: {
      bodyContent: [],
      headerContent: [],
    },
    clickableColumns: {
      list: ['vendorName', 'website'],
    },
  };

  public confirmJson = {
    type: '',
    message: '',
    title: '',
    messageContent: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel',
  };
  showConfirmation: boolean;
  ticketIdToDelete: any;

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchVendorList();
  }

  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) {
        return;
      }
      switch (event.action.type) {
        case 'fetchData':
          this.fetchVendorList();
          break;
        case 'addnew':
          this.addNewVendor();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
          this.editVendorDetails(event.data.vendorId);
          break;
        case 'delete':
          this.deleteVM(event.data);
          break;
        case 'cellClick':
          if (event.cellKey === 'vendorName') {
            this.editVendorDetails(event.data.vendorId);
          } else {
            const url = event.data.website;
            if (url) {
              window.open(url, '_blank');
            }
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  fetchVendorList() {
    try {
      this.http
        .get(Config.SERVICE_IDENTIFIER.FETCH_VENDOR)
        .subscribe((response) => {
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

  addNewVendor() {
    this.router.navigate(['vm-config/add']);
  }

  reloadTable() {
    try {
      this.vendorMasterSubject.next(true);
    } catch (error) {
      console.log(error);
    }
  }

  editVendorDetails(id) {
    try {
      this.router.navigate(['vm-config/edit', id]);
    } catch (error) {
      console.log(error);
    }
  }

  deleteVM(vendor) {
    try {
      this.ticketIdToDelete = vendor;
      this.confirmJson.type = 'deleteProduct';
      this.confirmJson.title = 'Delete Vendor Master';
      this.confirmJson.messageContent = ` ${vendor.vendorName}?`;
      this.confirmJson.message = `Are you sure you want to delete the Vendor -`;
      this.showConfirmation = true;
    } catch (error) {
      console.log(error);

    }
  }

  actionPerformed(event) {
    try {
      this.showConfirmation = false;
      if (!event.action) {
        return;
      }
      this.http.post(Config.SERVICE_IDENTIFIER.DELETE_VENDOR, this.ticketIdToDelete).subscribe((response) => {
        if (response.status === true) {
          this.toastr.success('', response.message);
          this.reloadTable();
        } else {
          this.toastr.error('', response.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
