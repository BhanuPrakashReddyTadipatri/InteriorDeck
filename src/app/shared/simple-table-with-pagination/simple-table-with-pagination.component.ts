import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild, HostListener, OnDestroy, SimpleChanges
} from '@angular/core';
import { EmptyStateDataConf } from '../empty-state/empty-state-interface';
import { Observable } from 'rxjs';

// tslint:disable: trailing-comma max-line-length component-selector no-increment-decrement

@Component({
  selector: 'app-simple-table-with-pagination',
  templateUrl: './simple-table-with-pagination.component.html',
  styleUrls: ['./simple-table-with-pagination.component.scss']
})
export class SimpleTableWithPaginationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tableDataWithActions;
  @Input() tableReloadEvent: Observable<boolean>;
  @Output() actionEmitter = new EventEmitter();
  @ViewChild('scrollHeader') scrollHeader: ElementRef;
  @ViewChild('scrollBody') scrollBody: ElementRef;
  @ViewChild('scrollLeftBody') scrollLeftBody: ElementRef;
  public emptyData: EmptyStateDataConf;

  public columnSearchModel: any = {};
  public metaData = {
    searchText: null,
    counter: 1,
    no_of_steps: 1,
    no_of_items_to_display: 10,
    display_options: [
      {
        label: '5',
        value: 5,
      },
      {
        label: '10',
        value: 10,
      },
      {
        label: '25',
        value: 25,
      },
      {
        label: '50',
        value: 50,
      },
    ],
  };
  public downloadObj = {};
  public seggregatedTableContent = [];
  public filterObject: any = {};
  public filteredData = [];
  public emptyTableNotify = true;
  public scrollTableHeader = true;
  public isDesc: any;
  public column: any;
  public headerData = [];
  public filteredColumns: any = [];
  public ignoreScrollEventsBody = false;
  public ignoreScrollEventsLeft = false;
  public tableReloadSubscription: any;
  public tableSettings: any = {
    actions: [],
    enableActions: true,
    externalActions: [],
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
      height: 'calc(100vh - 300px)',
    },
    columnOptions: {},
    itemsPerPage: {
      top: false,
    },
    actionPosition: {
      fixedRight: true,
    },
    paginationOptions: {
      noOfItemsToDisplay: 50,
      displayOptions: []
    },
    columnFilter: {
      show: true,
      minimumColumns: 1,
      defaultColumnsToDisplay: [],
    },
  };
  // tslint:disable-next-line: deprecation
  scrollOnToRight(event: MouseWheelEvent) {
    try {
      const ignore = this.ignoreScrollEventsLeft;
      this.ignoreScrollEventsLeft = false;

      if (ignore) {
        return false;
      }
      const scrollHeader = this.scrollHeader.nativeElement as HTMLElement;
      const scrollBody = this.scrollBody.nativeElement as HTMLElement;
      scrollHeader.scrollLeft = scrollBody.scrollLeft;
      if (this.scrollLeftBody) {
        const scrollLeftBody = this.scrollLeftBody.nativeElement as HTMLElement;
        scrollLeftBody.scrollTop = scrollBody.scrollTop;
        this.ignoreScrollEventsBody = true;
      }
      event.stopPropagation();
    } catch (error) {
      console.log(error);
    }
  }
  // tslint:disable-next-line: deprecation
  scrollToBody(event: MouseWheelEvent) {
    try {
      const ignore = this.ignoreScrollEventsBody;
      this.ignoreScrollEventsBody = false;

      if (ignore) {
        return false;
      }
      const scrollLeftBody = this.scrollLeftBody.nativeElement as HTMLElement;
      const scrollBody = this.scrollBody.nativeElement as HTMLElement;
      scrollBody.scrollTop = scrollLeftBody.scrollTop;
      this.ignoreScrollEventsLeft = true;
      event.stopPropagation();
    } catch (error) {
      console.log(error);
    }
  }
  constructor() { }

  ngOnInit() {
    if (this.tableDataWithActions.tableData && this.tableDataWithActions.tableData.headerContent && this.tableDataWithActions.tableData.headerContent.length > 0) {
      this.headerData = JSON.parse(JSON.stringify(this.tableDataWithActions.tableData.headerContent));
    }
    this.setDefaultOptions();
    this.setFilterData();
    this.metaData['counter'] = 1;
    this.seggregateTableData();
    this.observeTableReload();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableDataWithActions) {
      // this.setDefaultOptions();
      this.setFilterData();
      if (this.tableDataWithActions.tableActions &&
        this.tableDataWithActions.tableActions.columnOptions &&
        this.tableDataWithActions.tableActions.columnOptions.show) {
        this.setHeaderData(true, true);
      }
      this.searchColumn(true);
    }
  }
  /**
   * method to configure empty Data
   */
  setEmptyData() {
    this.emptyData = {
      image: {
        rounded: false,
        show: true,
        url: 'assets/images/logo.png',
        width: '400',
      },
    };
  }
  /**
   * method to configure default table settings
   */
  setDefaultOptions() {
    try {
      if (this.tableDataWithActions && this.tableDataWithActions.tableActions) {
        this.tableDataWithActions.tableActions = { ...this.tableSettings, ...this.tableDataWithActions.tableActions };
      }
      if (this.tableDataWithActions && this.tableDataWithActions.tableActions && this.tableDataWithActions.tableActions.paginationOptions) {
        if (this.tableDataWithActions.tableActions.paginationOptions.displayOptions.length > 0) {
          this.metaData.display_options = this.tableDataWithActions.tableActions.paginationOptions.displayOptions;
        }
        if (this.tableDataWithActions.tableActions.paginationOptions.noOfItemsToDisplay) {
          const index = this.metaData.display_options.findIndex(ele => ele.value === this.tableDataWithActions.tableActions.paginationOptions.noOfItemsToDisplay);
          if (index > -1) {
            this.metaData.no_of_items_to_display = this.tableDataWithActions.tableActions.paginationOptions.noOfItemsToDisplay;
          }
        }
      }
      if (this.tableDataWithActions.tableActions.columnFilter.show) {
        if (this.headerData.length > 0) {
          if (this.tableDataWithActions.tableActions.columnFilter.defaultColumnsToDisplay.length > 0) {
            this.filteredColumns = this.tableDataWithActions.tableActions.columnFilter.defaultColumnsToDisplay;
          } else {
            this.filteredColumns = JSON.parse(JSON.stringify(this.headerData));
          }
        }
        if (this.tableDataWithActions.tableActions.columnFilter.show && this.tableDataWithActions.tableActions.columnFilter.minimumColumns && this.tableDataWithActions.tableActions.columnFilter.minimumColumns > 0) {
          if (this.tableDataWithActions.tableActions.columnFilter.minimumColumns > this.filteredColumns.length) {
            this.tableDataWithActions.tableActions.columnFilter.minimumColumns = 1;
          }
        }
      }
      if (this.tableDataWithActions.tableActions.columnFilter.show) {
        this.setHeaderData();
      }
    } catch (error) {
      console.error(error);
    }
  }
  onChangeInDisplay(value) {
    try {
      this.seggregateTableData();
    } catch (error) {
      console.error(error);
    }
  }
  seggregateTableData() {
    try {
      this.seggregatedTableContent = [];
      if (!this.tableDataWithActions || !this.tableDataWithActions['tableData'] || !this.tableDataWithActions['tableData']['bodyContent']) {
        return;
      }
      const bodyContentLength = this.tableDataWithActions['tableData']['bodyContent'].length;
      if (bodyContentLength) {
        this.emptyTableNotify = false;
        this.scrollTableHeader = false;
        this.metaData['no_of_steps'] = Math.ceil(bodyContentLength / this.metaData['no_of_items_to_display']);
        for (let eachStep = 1; eachStep <= this.metaData['no_of_steps']; eachStep++) {
          const eachStepArray = [];
          const fromIndex = (eachStep - 1) * this.metaData['no_of_items_to_display'];
          const toIndex = eachStep * this.metaData['no_of_items_to_display'] - 1;
          this.filteredData.forEach((eachItem, index) => {
            if (index >= fromIndex && index <= toIndex) {
              eachStepArray.push(eachItem);
            }
          });
          this.seggregatedTableContent.push(eachStepArray);
        }
        this.seggregatedTableContent = this.seggregatedTableContent.filter((eachStep) => {
          if (eachStep.length) {
            eachStep = eachStep.filter((subStep) => {
              return (subStep !== null && subStep !== '' && subStep !== undefined);
            });
          }
          return (eachStep !== null && eachStep !== '' && eachStep !== undefined);
        });
      } else {
        this.emptyTableNotify = true;
      }
    } catch (error) {
      console.error(error);
    }
  }
  emitAction(actionType, data?: any, rowIndex?: any, value?: any, valueKey?: any) {
    try {
      const dataToEMit = {
        action: actionType,
      };
      if (data) {
        dataToEMit['data'] = data;
      }
      if (rowIndex !== undefined) {
        dataToEMit['rowIndex'] = rowIndex;
      }
      if (value !== undefined) {
        if (valueKey) {
          dataToEMit[valueKey] = value;
        } else {
          dataToEMit['value'] = value;
        }
      }
      this.actionEmitter.emit(dataToEMit);
    } catch (error) {
      console.error(error);
    }
  }

  get searchTerm(): string {
    return this.metaData['searchText'];
  }

  /**
   * ### Method to setting the table data based on the string entered
   */
  set searchTerm(value: string) {
    try {
      this.metaData['searchText'] = value;
      if (!this.tableDataWithActions || !this.tableDataWithActions['tableData'] || !this.tableDataWithActions['tableData']['headerContent']) {
        return;
      }
      const headerContent = this.tableDataWithActions['tableData']['headerContent'];
      this.filterObject = {};
      for (const item of headerContent) {
        this.filterObject[item['key'] || item['value']] = this.metaData['searchText'];
      }
      this.filteredData = this.filterdata(value);
      this.seggregateTableData();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * #### Method to filter the data based on search string entered and updating the table data
   * @param searchString refernce of search string entered inside the search field
   */
  filterdata(searchString: string) {
    try {
      const afterFilter = this.tableDataWithActions['tableData']['bodyContent'].filter((eachItem) => {
        let searchStringFound = false;
        this.tableDataWithActions['tableData']['headerContent'].forEach((eachHeader) => {
          if (eachItem[eachHeader['key'] || eachHeader['value']]) {
            if (['string'].includes(typeof eachItem[eachHeader['key'] || eachHeader['value']])) {
              if (eachItem[eachHeader['key'] || eachHeader['value']].toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
                searchStringFound = true;
                return eachItem;
              }
            } else {
              if (eachItem[eachHeader['key'] || eachHeader['value']] === searchString) {
                searchStringFound = true;
                return eachItem;
              }
            }
          }
        });
        if (searchStringFound) {
          return eachItem;
        }
      });
      return afterFilter;
    } catch (error) {
      console.error(error);
    }
  }
  searchColumn(counterNotClear?) {
    try {
      this.filteredData = this.filterdataColumnLevel();
      if (this.column) {
        this.isDesc = !this.isDesc;
        if (!counterNotClear) {
          this.metaData['counter'] = 1;
          this.sort(this.column, true, false);
        } else {
          this.sort(this.column, true, true);
        }
      } else {
        if (!counterNotClear) {
          this.metaData['counter'] = 1;
        }
        this.seggregateTableData();
      }
    } catch (error) {
      console.error(error);
    }
  }
  filterdataColumnLevel() {
    try {
      const afterFilter = this.tableDataWithActions['tableData']['bodyContent'];
      const filterKeys = [];
      for (const key in this.columnSearchModel) {
        if (this.columnSearchModel[key].length > 0) {
          filterKeys.push(key);
        }
      }
      return afterFilter.filter(item =>
        filterKeys.reduce((x, keyName) =>
          (x && new RegExp(this.columnSearchModel[keyName], 'gi').test(item[keyName])) || this.columnSearchModel[keyName] === "", true));

    } catch (error) {
      console.error(error);
    }
  }
  setFilterData() {
    try {
      if (this.tableDataWithActions['tableData'] && this.tableDataWithActions['tableData']['bodyContent']) {
        this.filteredData = JSON.parse(JSON.stringify(this.tableDataWithActions['tableData']['bodyContent']));
      }
    } catch (error) {
      console.error(error);
    }
  }
  sort(property, notSearch?, counterNotClear?) {
    try {
      this.isDesc = !this.isDesc; // change the direction
      this.column = property;
      const direction = this.isDesc ? 1 : -1;
      if (!notSearch) {
        this.filteredData = this.filterdataColumnLevel();
      }
      this.filteredData.sort((a, b) => {
        if (a[property] < b[property]) {
          return -1 * direction;
        } else if (a[property] > b[property]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
      if (!counterNotClear) {
        this.metaData['counter'] = 1;
      }
      this.seggregateTableData();
    } catch (error) {
      console.error(error);
    }
  }
  getTotalPages() {
    try {
      if (this.filteredData.length > this.metaData.no_of_items_to_display) {
        const totalPagesLength = (this.metaData.counter - 1) * this.metaData.no_of_items_to_display + this.metaData.no_of_items_to_display;
        if (totalPagesLength > this.filteredData.length) {
          return this.filteredData.length;
        } else {
          return totalPagesLength;
        }
      } else {
        return this.filteredData.length;
      }
    } catch (error) {
      console.log(error);
      return '10';
    }
  }
  setHeaderData(notClearSearch?, notClearSort?) {
    try {
      if (this.filteredColumns.length > (this.tableDataWithActions.tableActions.columnFilter.minimumColumns - 1)) {
        const filteredArray = [];
        this.headerData.forEach((elementHead) => {
          this.filteredColumns.forEach((elementFilter) => {
            if (elementHead.key === elementFilter.key) {
              filteredArray.push(elementHead);
            }
          });
        });
        this.tableDataWithActions.tableData.headerContent = filteredArray;
      } else {
        setTimeout(() => {
          if (this.tableDataWithActions.tableData.headerContent.length > 0) {
            this.filteredColumns = this.tableDataWithActions.tableData.headerContent;
          }
        }, 100);
      }
      if (!notClearSearch) {
        this.columnSearchModel = {};
        this.searchColumn();
      }
      if (!notClearSort) {
        this.column = '';
      }
    } catch (error) {
      console.log(error);
    }
  }
  public onSelectAll() {
    this.filteredColumns = JSON.parse(JSON.stringify(this.headerData));
    this.setHeaderData();
  }

  public onClearAll() {
    this.filteredColumns = this.headerData.slice(0, this.tableDataWithActions.tableActions.columnFilter.minimumColumns);
    this.setHeaderData();
  }
  /**
   * Method to subscribe the table reload from parent component
   */
  observeTableReload() {
    try {
      if (this.tableReloadEvent) {
        this.tableReloadSubscription = this.tableReloadEvent.subscribe((val: boolean) => {
          if (val) {
            this.reloadTable();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  reloadTable() {
    this.emitAction({ type: 'fetchData' });
  }
  ngOnDestroy() {
    if (this.tableReloadSubscription) {
      this.tableReloadSubscription.unsubscribe();
      this.tableReloadSubscription = undefined;
    }
  }
}
