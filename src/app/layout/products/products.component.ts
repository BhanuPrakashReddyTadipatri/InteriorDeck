import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/services/session.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'src/app/config/config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('productPopup') productPopup;

  public showConfirmation = false;
  public ticketIdToDelete = undefined;
  public selectedProduct: any = {
    materialName: '',
    // materialCode: '',
    materialMake: '',
    materialModel: '',
    // minPrice: '',
    // maxPrice: '',
    // warranty: '',
    specification: '',
    new: false,
    deviceType: 'GLens',
  };

  public deviceTypes = [
    {
      label: 'GLens',
      value: 'GLens'
    },
    {
      label: 'GLens Labs',
      value: 'GLens Labs'
    },
    {
      label: 'Others',
      value: 'Others'
    },
  ];

  public confirmJson = {
    type: '',
    message: '',
    title: '',
    messageContent: '',
    trueButton: 'Yes, Continue',
    falseButton: 'Cancel',
  };

  public ProductsTable = {
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
          label: 'Add Products',
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
          action: 'download',
          label: 'Download',
          type: 'download',
          icon: 'fa fa-download',
        },
      ],
      columnOptions: {
        quantity: {
          customColumnClass: 'center-aligned',
        },
        materialCode: {
          customColumnClass: 'min-table-width',
        },
        deviceType: {
          customColumnClass: 'min-table-width',
        },
        lastUpdatedTime: {
          customColumnClass: 'min-table-width-request-by',
        },
      },
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
      list: ['materialName'],
    },
  };
  isvalueChecked = false;

  constructor(
    private http: HttpLayerService,
    private router: Router,
    private session: SessionService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    try {
      this.http
        .get(Config.SERVICE_IDENTIFIER.FETCH_PRODUCTS_ALL)
        .subscribe((response) => {
          if (response.status === true) {
            this.ProductsTable = {
              ...this.ProductsTable,
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

  handleTableEmitter(event) {
    try {
      if (!event || !event.action || !event.action.type) {
        return;
      }
      switch (event.action.type) {
        case 'fetchData':
          this.fetchAllProducts();
          break;
        case 'addnew':
          this.addNewProductPopup();
          break;
        case 'refresh':
          this.reloadTable();
          break;
        case 'edit':
        case 'cellClick':
          this.editProducts(event.data);
          break;
        case 'delete':
          this.deleteProductConfirmation(event.data);
          break;
        case 'download':
          this.exportToExcel();
          break;
        case 'view':
          this.editProducts(event.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  reloadTable() {
    this.fetchAllProducts();
  }

  deleteProductConfirmation(product) {
    this.ticketIdToDelete = product;
    this.confirmJson.type = 'deleteProduct';
    this.confirmJson.title = 'Delete Product';
    this.confirmJson.messageContent = `${product.materialName} ?`;
    this.confirmJson.message = `Are you sure you want to delete the Products -`;
    this.showConfirmation = true;
  }

  actionPerformed(event) {
    try {
      if (!event.action) {
        return;
      }

      this.http
        .post(Config.SERVICE_IDENTIFIER.DELETE_PRODUCTS, this.ticketIdToDelete)
        .subscribe((response) => {
          if (response.status === true) {
            this.showConfirmation = false;
            this.reloadTable();
            this.modalService.dismissAll();
            this.toastr.success('', response.message);
          } else {
            this.toastr.error('', response.message);
          }
        });

    } catch (error) {
      console.log(error);

    }
  }


  valueCheck() {

    this.isvalueChecked = false;

    if ((this.selectedProduct.minPrice && this.selectedProduct.maxPrice) &&
      this.selectedProduct.minPrice > this.selectedProduct.maxPrice) {
      this.isvalueChecked = true;

    } else if ((this.selectedProduct.minPrice && this.selectedProduct.maxPrice) &&
      this.selectedProduct.minPrice < this.selectedProduct.maxPrice) {

      this.isvalueChecked = false;

    }

  }


  openPopup() {
    this.modalService.open(this.productPopup, { size: 'lg' });
    // .result.then(
    //   (result) => { },
    //   (reason) => { }
    // );
  }

  editProducts(product: any, type?) {
    this.valueCheck();
    this.selectedProduct = JSON.parse(JSON.stringify(product));
    if (!type || type !== 'new') {
      this.selectedProduct.new = false;
    } else {
      this.selectedProduct.quantity = null;
      this.selectedProduct.deviceType = 'GLens';
    }
    this.openPopup();
  }

  addNewProductPopup() {
    // this.isvalueChecked = false;
    this.valueCheck();
    this.editProducts({ new: true }, 'new');
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
    // const tabName = this.exportName[this.ticketStatus.ticketStatus] || this.ticketStatus.ticketStatus;
    this.http.downloadExcel(this.ProductsTable.tableData, 'Products' + '(' + this.getDateTimeForExport() + ')');
  }

  submitForm(a) {
    try {
      this.http
        .post(Config.SERVICE_IDENTIFIER.SAVE_PRODUCTS, this.selectedProduct)
        .subscribe((response) => {
          if (response.status === true) {
            this.selectedProduct = {
              materialName: '',
              prodCode: '',
              materialMake: '',
              materialModel: '',
              minPrice: '',
              maxPrice: '',
              warranty: '',
              specification: '',
              deviceType: 'GLens',
              new: false,
            };
            this.reloadTable();
            this.modalService.dismissAll();
            this.toastr.success('', response.message);
          } else {
            this.toastr.error('', response.message);
          }
        });
    } catch (error) {
      console.log(error);

    }

  }
}
