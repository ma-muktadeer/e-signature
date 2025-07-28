import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { saveAs } from "file-saver";
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent extends Softcafe implements OnInit, Service, AfterViewInit {
  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  institutionId = null;
  loginName = "null";
  isCollapsed = true;
  loading: boolean = true;
  showProgress: boolean = false;
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
  btnRef: string;
  appPermission = AppPermission;
fullName: any;


  constructor(private cs: CommonService,
    private permissioinStoreService: PermissioinStoreService,
    private http: HttpClient,
    private dp: DatePipe,
    private cdk: ChangeDetectorRef) {
    super()
  }

  ngOnInit(): void {
    this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
    }, 0);
    this.cdk.detectChanges();
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
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.serialNumberFormatter,
        minWidth: 70
      },
      {
        id: 'loginName', name: 'User Id', field: 'loginName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 230
      },
      {
        id: 'empId', name: 'Employee Id', field: 'empId',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 120
      },
      {
        id: 'fullName', name: 'Name', field: 'fullName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'branch', name: 'Br/Division Name', field: 'branch',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'designation', name: 'Designation', field: 'designation',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'mobileNumber', name: 'Mobile No', field: 'mobileNumber',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'lastLoginDate', name: 'Last Login Date', field: 'lastLoginDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'userType', name: 'User Type', field: 'userType',
        sortable: true, type: FieldType.number, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.userType),
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 120
      },
      {
        id: 'userCreateDate', name: 'User Create Date & Time', field: 'userCreateDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.attemptStatusFormatter,
        minWidth: 170
      },
      {
        id: 'activeDate', name: 'Active Date & Time', field: 'activeDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },

      {
        id: 'inactiveDate', name: 'Inactive Date & Time', field: 'inactiveDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      // {
      //   id: 'userStatus', name: 'User Status', field: 'userStatus',
      //   sortable: true, type: FieldType.text, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.userStatus),
      //   filterable: isFilterable, filter: { model: Filters.inputText, },
      //   minWidth: 150
      // },
      {
        id: 'dbUserStatus', name: 'User Status', field: 'dbUserStatus',
        sortable: true, type: FieldType.text, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.dbUserStatus),
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      
      /* {
        id: 'createDate', name: 'Create Date & Time', field: 'createDate',
        sortable: true, type: FieldType.text,
        filterable: true, filter: { model: Filters.inputText, },
        minWidth: 170
      }, */

      {
        id: 'amendDate', name: 'Amend Date & Time', field: 'amendDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'passWordResetDateTime', name: 'Password Reset Date & Time', field: 'passWordResetDateTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'adminUser', name: 'Admin User Name', field: 'adminUser',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      }, {
        id: 'userBlockCause', name: 'Block Reason', field: 'userBlockCause',
        sortable: true, type: FieldType.text, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.userBlockCause),
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      }, {
        id: 'adminResetDateTime', name: 'Admin Reset Date & Time', field: 'adminResetDateTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170
      },
      {
        id: 'maker', name: 'Maker Name', field: 'maker',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 200
      },

      {
        id: 'authorizer', name: 'Authorizer Name', field: 'authorizer',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 200
      },


    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "idUserKey",
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  filterFromDate: string = new Date().toISOString().split('T')[0];
  filterToDate: string = new Date().toISOString().split('T')[0];

  filterSearch() {
    if (!this.filterFromDate || !this.filterToDate && (this.loading && this.btnRef == 'search')) {
      return;
    }
    this.btnRef = 'search';
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';
    this.loadData(fromDate, toDate, 'FILTER_SEARCH')
  }

  loadData(fromDate, toDate, pointer) {
    if (this.fullName && this.fullName.length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Name must be at least 3 characters long.',
        confirmButtonText: 'OK',
      });
      return;
    }
    var payload = {
      fromDate: fromDate,
      toDate: toDate,
      loginName: this.loginName,
      institutionId: this.institutionId,
      fullName: this.fullName,
      userType: this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER)
        && this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? '' :
        this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER) ? 'EXTERNAL_USER' :
          this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? 'INTERNAL_USER' : '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.loading = true;
    this.showProgress = true;

    this.cs.execute(ActionType.ACTION_USER_SEARCH_REPORT, ContentType.ReportSearch, payload)
      .subscribe((res: any) => {
        console.log(res)
        this.searchReport = res.payload.itemsUserReport.map(item => ({
          ...item,
          pointer: pointer
        }));
        this.totalItem = res.payload.totalItem

        setTimeout(() => {
          this.paginationService.updateTotalItems(this.totalItem);
        }, 500);
        this.loading = false;
        this.showProgress = false;
        this.cdk.detectChanges();
      });
  }

  search() {
    var fromDate = this.formatDateToYYYYMMDDHHMMSS(this.getStartOfDay(this.fromDate));
    var toDate = this.formatDateToYYYYMMDDHHMMSS(this.getEndOfDay(this.fromDate));
    this.loadData(fromDate, toDate, 'SEARCH');
  }



  public filePathObject;

  onDownloadUserReport() {

    if (!this.filterFromDate || !this.filterToDate || (this.loading && this.btnRef == 'download')) {
      return;
    }
    if (this.fullName && this.fullName.length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Name must be at least 3 characters long.',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.btnRef = 'download';
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';

    var payload = {
      fromDate: fromDate,
      toDate: toDate,
      fullName: this.fullName,
      userType: this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER)
        && this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? '' :
        this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER) ? 'EXTERNAL_USER' :
          this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? 'INTERNAL_USER' : '',
    }

    this.loading = true;
    this.showProgress = true;
    this.http.post(environment.SERVER_BASE_URL + '/user/report/download', payload).subscribe((res) => {
      console.log(res);
      debugger
      this.filePathObject = res;
      debugger
      if (this.filePathObject == null) {
        console.log("Res Null Array : ")
        Swal.fire({
          title: "No Data Found !!",
          toast: true,
          timer: 5000
        })
        this.loading = false;
        this.showProgress = false;
      } else {
        debugger

        this.onDownload(this.filePathObject.commonExcelFilePath);

      }

    });

  }

  onDownload(filePathP) {

    debugger
    var filePath = filePathP;


    this.http.get(environment.SERVER_BASE_URL + "/download/common/excel?filePath=" + filePath, { responseType: 'blob' }).subscribe(res => {


      var fileName = this.dp.transform(new Date(), 'yyyyMMddHHmmss') + ".xlsx";
      console.log("file >: " + fileName);
      debugger
      saveAs(res, "UserReport_" + fileName);

      setTimeout(() => {
        this.paginationService.updateTotalItems(this.totalItem);
      }, 500);
      this.loading = false;
      this.showProgress = false;

    });



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
