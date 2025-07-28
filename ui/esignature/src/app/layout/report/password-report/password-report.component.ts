import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-password-report',
  templateUrl: './password-report.component.html',
  styleUrls: ['./password-report.component.scss']
})
export class PasswordReportComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  userId = null;
  loginName = "null";
  isCollapsed = true;

  pageSize = 20;
  pageNumber = 1;
  totalItem = 0;
  searchReport: any[] = []
  showGrid = false;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  angularGrid: AngularGridInstance;
  paginationService: PaginationService
  gridObj;
  dataViewObj;
  userList: any[] = [];
  selectedFullName: string;
  loading: boolean = true;
  showProgress: boolean = true;
  loaderConfig: any = {
    loader: 'twirl',
    position: 'right',
    color: 'white',
    background: '#fff',
    padding: '10px',
    height: .6,
    opacity: 1,
    speed: 1000,
    padButton: true,
  }

  constructor(private cs: CommonService) {
    super()
  }

  ngOnInit(): void {
    // this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
    this.loadValue();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
    }, 0);
  }

  loadValue() {
    forkJoin([this.loadUsers(), this.loadInitialValue()])
      .pipe(
        map(([user, pList]) => (
          {
            user,
            pList
          }
        )),
      )
      .subscribe((res: any) => {
        debugger
        this.userList = res['user']?.payload;
        const pList = res['pList']?.payload;
        if (pList) {
          this.buildGridValue(pList.itemsPasswordReport, pList.totalItem);
        }
      });

  }


  loadInitialValue() {
    const dt = this.filterFromDate?.replace(/-/g, '');
    const payload = {
      fromDate: this.filterFromDate ? dt + '000000' : null,
      toDate: dt ? this.filterToDate.replace(/-/g, '') + '235959' : null,
      // toDate: this.filterToDate,
    }

    return this.cs.execute(ActionType.ACTION_PASSWORD_SEARCH_REPORT, ContentType.ReportSearch, payload);
  }
  loadUsers() {
    const payload = {
    }
    return this.cs.execute(ActionType.SELECT, ContentType.ReportSearch, payload);
  }
  dropdownSettingsUser: IDropdownSettings = {
    singleSelection: true,
    idField: 'userId',
    textField: 'fullName',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search User',
    noDataAvailablePlaceholderText: 'No user found',
  };

  getUserIdS(event: any) {
    this.userId = event.userId;
    console.log('selectedInstitutionId', this.userId);
  }
  deselectUser(event: any) {
    this.userId = null;
  }

  getUserId() {
    const selectedUser = this.userList.find(f => f.fullName === this.selectedFullName);
    const selectedUserId = selectedUser?.userId;
    console.log('selectedInstitutionId', selectedUserId);

    this.userId = selectedUserId;
  }
  serialNumberFormatter = (row, cell, value, columnDef, dataContext) => {
    if (this.pageNumber == 1) {
      return row + 1;
    }
    var prevItem = (this.pageNumber - 1) * this.pageSize
    return row + 1 + prevItem;
  };

  attemptStatusFormatter = (row, cell, value, columnDef, dataContext) => {
    return value === 'SUCCESS' ? 'Yes' : (value === 'FAIL' ? 'No' : value);
  };

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      {
        id: '', name: 'SL No', field: '',
        sortable: true, type: FieldType.number,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.serialNumberFormatter,
        minWidth: 80

      },
      // {
      //   id: 'passwordReportKey', name: 'Password Report Key', field: 'passwordReportKey',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 100,

      // },
      {
        id: 'userName', name: 'User Name', field: 'userName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'email', name: 'Email', field: 'email',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 200,

      },
      {
        id: 'institutionName', name: 'Institution Name', field: 'institutionName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'dateTime', name: 'Date Time', field: 'dateTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'status', name: 'Status', field: 'status',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.status),
        minWidth: 100,

      },
      {
        id: 'type', name: 'Type', field: 'type',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.type),
        minWidth: 200,

      },


    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "passwordReportKey",
      enableFiltering: true,
      enableSorting: true,
      enablePagination: true,
      enableExcelExport: true,
      pagination: {
        pageNumber: this.pageNumber,
        pageSizes: [10, 20, 50, 80, 150],
        pageSize: this.pageSize,
        totalItems: 0,
      },
      enableColumnReorder: true,
      enableHeaderButton: true,
      enableEmptyDataWarningMessage: true,
      enableCellMenu: true,
      enableCellNavigation: true,
      forceFitColumns: true, // this one is important        
      enableContextMenu: true,
      enableGridMenu: false,
      enableRowSelection: true,
      enableTextSelectionOnCells: true,
      enableAutoTooltip: true,
      enableAutoSizeColumns: true,
      showCustomFooter: true,
      createFooterRow: true,
      customFooterOptions: {
        leftFooterText: "try it"
      },
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 200
      },
      presets: {},
      enableHeaderMenu: true,
      headerMenu: {
        hideFreezeColumnsCommand: false
      },
      columnPicker: {
        onColumnsChanged: (e, args) => {
          console.log(args);
        }
      },
      gridMenu: {
        hideClearFrozenColumnsCommand: false,
        hideExportCsvCommand: false,
        customItems: [
        ]
      }
    }
    return option;
  }

  headerMenu() {
    var items: MenuCommandItem[] = [
      {
        command: "Refresh",
        action: (e, args) => { this.handleRefresh() },
        title: "Refresh",
        positionOrder: 100,
        cssClass: "fa fa-refresh"
      },
      {
        divider: true, command: '', positionOrder: 2
      },
    ]
    var header = {
      items: items
    }
    return header;

  }

  handleRefresh() {
    throw new Error('Method not implemented.');
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.paginationService = angularGrid.paginationService;
    this.paginationService.onPaginationChanged.subscribe((pagination: ServicePagination) => {
      const pointer = this.dataViewObj.getItems()[0].pointer;
      this.handlePaginationChange(pagination, pointer)
    });
  }

  handlePaginationChange(pagination: ServicePagination, pointer): void {
    this.pageNumber = pagination.pageNumber
    this.pageSize = pagination.pageSize
    if (pointer == 'FILTER_SEARCH') {
      this.filterSearch();
    }
    else if (pointer == 'SEARCH') {
      this.search();
    }
    this.gridObj.invalidate();
    this.gridObj.render();
  }

  getStartOfDay(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  getEndOfDay(date) {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  formatDateToYYYYMMDDHHMMSS(date) {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  filterToDate: string = new Date().toISOString().split('T')[0];
  // filterFromDate: string = '';
  // filterFromDate: string = new Date().toISOString().split('T')[0];
  filterFromDate: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  filterSearch() {
    // if (!this.filterFromDate || !this.filterToDate) {
    //   return;
    // }
    var fromDate = this.filterFromDate ? this.filterFromDate.replace(/-/g, '') + '000000' : null;
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';
    // var fromDate = null;
    // var toDate = null;

    this.loadData(fromDate, toDate, 'FILTER_SEARCH')

  }

  loadData(fromDate, toDate, pointer) {
    debugger
    var payload = {
      fromDate: fromDate,
      toDate: toDate,
      loginName: this.loginName,
      userId: this.userId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }

    this.loading = true;
    this.showProgress = true;

    this.cs.execute(ActionType.ACTION_PASSWORD_SEARCH_REPORT, ContentType.ReportSearch, payload)
      .subscribe((res: any) => {
        console.log(res)
        debugger
        this.searchReport = res.payload.itemsPasswordReport.map(item => ({
          ...item,
          pointer: pointer
        }));
        this.totalItem = res.payload.totalItem

        this.updateGrid();

      });
  }
  updateGrid() {
    setTimeout(() => {
      this.paginationService.updateTotalItems(this.totalItem);
    }, 500);
    this.loading = false;
    this.showProgress = false;
  }
  buildGridValue(itemsPasswordReport: any, total: number) {
    this.searchReport = itemsPasswordReport;
    this.totalItem = total;
    this.updateGrid();
  }

  search() {
    var fromDate = this.formatDateToYYYYMMDDHHMMSS(this.getStartOfDay(this.fromDate));
    var toDate = this.formatDateToYYYYMMDDHHMMSS(this.getEndOfDay(this.fromDate));
    this.loadData(fromDate, toDate, 'SEARCH');
  }


  onResponse(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'LOGON_REPORT') {
      console.log(res);

    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;
    console.log('error', res);
  }



}
