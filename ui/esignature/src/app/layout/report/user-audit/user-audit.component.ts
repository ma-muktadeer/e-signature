import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { saveAs } from "file-saver";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.scss']
})
export class UserAuditComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  institutionId = null;
  userId = null;
  loginName = "null";
  fullName = "null"
  isCollapsed = true;
  loading: boolean = false;
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
  public dropdownSettings4User: IDropdownSettings = {};
  userList: any[] = [];
  selectedLoginName: string;
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
  userType: any;

  selectType: string = null;
  // myGroup = new FormBuilder().group({
  //   selectType: ['null'],
  // });
  //userListAll: any;


  constructor(private cs: CommonService,
    private http: HttpClient,
    private dp: DatePipe,) {
    super()
  }

  ngOnInit(): void {
    // this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
    // this.loadValue();
    this.onInitDropDownSettings()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
    }, 0);
  }

  onInitDropDownSettings() {
    this.dropdownSettings4User = {
      singleSelection: true,
      idField: 'userId',
      textField: 'fullName',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      clearSearchFilter: true

    };
  }

  selectedUserType: string = '';
  buildUser(event: any) {
    const userType = event.target.value;
    this.selectedUserType = event.target.value;
    debugger
    //this.userList = this.userListAll.filter(f=>f.userType === userType);
    this.onloadUser(userType, 1);



  }

  onloadUser(type, active) {
    var payload = {
      userType: type,
      active: active
    }
    this.cs.sendRequest(this, ActionType.LOAD_USER_TYPE_WISE, ContentType.User, "LOAD_USER_TYPE_WISE", payload);
  }

  getUserId() {
    const selectedUser = this.userList.find(f => f.loginName === this.selectedLoginName);
    debugger
    const selectedUserId = selectedUser?.userId;
    console.log('selectedInstitutionId', selectedUserId);
    debugger

    this.userId = selectedUserId;
  }

  onSelect(option: string): void {
    console.log('Selected option:', option);
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

  isFilterable = environment.enableFiltering;

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
        id: 'fullName', name: 'Full Name', field: 'fullName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 160,
      },
      {
        id: 'email', name: 'Email', field: 'email',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 250,
      },
      {
        id: 'branchName', name: 'Branch', field: 'branchName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },

      {
        id: 'loginName', name: 'Login Name', field: 'loginName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 250,
      },

      {
        id: 'userType', name: 'User Type', field: 'userType',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
        formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => {
          var data: string = dataContext.userType ?? '';
          console.log(data)
          dataContext.userType = data.toLowerCase().replace(/_/g, ' ')
            .replace(/^\w|\s(.)/g, (char) => char.toUpperCase());
          return data;
        }
      },
      {
        id: 'departmentName', name: 'Department', field: 'departmentName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },

      {
        id: 'designation', name: 'Designation', field: 'designation',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },
      {
        id: 'phoneNumber', name: 'Phone Number', field: 'phoneNumber',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },
      {
        id: 'nid', name: 'NID', field: 'nid',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },

      {
        id: 'userStatus', name: 'Status', field: 'userStatus',
        sortable: true, type: FieldType.text, formatter: (row, cell, value, columnDef, dataContext, grid) => dataContext?.userBlockCause ? 'Locked' : blockToCamel(dataContext?.userStatus),
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,
      },
      {
        id: 'institutionName', name: 'Institution Name', field: 'institutionName',
        sortable: true, type: FieldType.text,
        // formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => this.institutionList.find(l => l.institutionId == dataContext.institutionId)?.institutionName,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 290,
      },
      {
        id: 'allowLogin', name: 'Allow Login', field: 'allowLogin',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText },
        minWidth: 150,
        formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.allowLogin == 'Yes' ? "Yes" : "No" }
      },
      {
        id: 'modDate', name: 'Changed Date', field: 'modDate',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'makerName', name: 'Maker Name', field: 'makerName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'checkerName', name: 'Checker Name', field: 'checkerName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'modifierName', name: 'Modified By', field: 'modifierName',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'remarks', name: 'Remarks', field: 'remarks',
        sortable: true, type: FieldType.text,
        filterable: this.isFilterable, filter: { model: Filters.inputText, },
        minWidth: 250,
      },


    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "auditUserId",
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
      // this.search();
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
    if (!this.filterFromDate || !this.filterToDate) {
      return;
    }
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';

    // this.loadData(fromDate, toDate)
  }

  loadData() {
    debugger

    // this.getUserId();
    var payload = {
      active: 1,
      userId: this.userId
    }
    this.loading = true;
    this.showProgress = true;
    debugger

    this.cs.sendRequest(this, ActionType.USER_AUDIT_LOG, ContentType.User, 'USER_AUDIT_LOG', payload);

  }

  onUserSelect(event: any): void {
    debugger
    this.selectedLoginName = event.loginName;
    this.userId=event.userId;
  }

  onUserDeselect(event: any): void {
    this.selectedLoginName = null;
    this.userId = null;
  }




  public filePathObject;

  onDownloadUserReport() {

    if (!this.filterFromDate || !this.filterToDate) {
      return;
    }
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';

    var payload = {
      fromDate: fromDate,
      toDate: toDate
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
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'LOGON_REPORT') {
      console.log(res);

    } else if (res.header.referance === 'USER_AUDIT_LOG') {
      debugger
      this.searchReport = res.payload;


    } else if (res.header.referance === 'LOAD_USER_TYPE_WISE') {
      debugger
      this.userList = res.payload;

    }




  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;

    console.log('error', res);
  }



}
