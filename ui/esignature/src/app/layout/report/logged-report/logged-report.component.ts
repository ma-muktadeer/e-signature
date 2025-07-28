import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-logged-report',
  templateUrl: './logged-report.component.html',
  styleUrls: ['./logged-report.component.scss']
})
export class LoggedReportComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  institutionId = null;
  loginName = "null";
  isCollapsed = true;
  btnRef: string;
  pageSize = 20;
  pageNumber = 1;
  totalItem = 0;

  loggedReport: any[] = []
  showGrid = false;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  angularGrid: AngularGridInstance;
  paginationService: PaginationService
  gridObj;
  dataViewObj;
  loading: boolean = true;
  showProgress: boolean = false;
  loaderConfig: any = {
    loader: 'twirl', // full list of loaders is provided below
    position: 'right', // options: 'right', 'center', 'left'
    color: 'white',
    background: '#fff',
    padding: '10px', // any supported format
    height: .6, // number relative to input height like 0.9 or 0.25
    opacity: 1,
    speed: 1000, // in milliseconds
    padButton: true, // adds padding to buttons

    // In case any property is not specified, default options are used.
  }
fullName: any;



  constructor(private cs: CommonService, private cdk: ChangeDetectorRef, private http: HttpClient,private dp: DatePipe) {
    super()
  }

  ngOnInit(): void {
    this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.showGrid = true
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
    // return value === 'SUCCESS' ? 'Yes' : (value === 'FAIL' ? 'No' : value);
    return blockToCamel(value);
  };

  attemptStatusCustomFilter = {
    collection: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
      // Include other potential values if needed
    ],
    filter: (value, searchTerm) => {
      const displayValue = value === 'SUCCESS' ? 'Yes' : (value === 'FAIL' ? 'No' : value);
      return displayValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
  };

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      {
        id: '', name: 'SL No', field: '',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.serialNumberFormatter,
        minWidth: 100,
      },
      {
        id: 'loginName', name: 'User Name', field: 'loginName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 230
      },
      {
        id: 'entryTime', name: 'Date & Time', field: 'entryTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },

      {
        id: 'attemptStatus', name: 'Success', field: 'attemptStatus',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.attemptStatusFormatter,
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'action', name: 'Action', field: 'action',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.action),
        minWidth: 170
      },
      {
        id: 'ip', name: 'IP', field: 'ip',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'fullName', name: 'Name', field: 'fullName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'institutionName', name: 'Bank Name', field: 'institutionName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'branchName', name: 'Branch/Division', field: 'branchName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'genNoticeTime', name: 'Gen Notice Accept Date & Time', field: 'genNoticeTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },
      {
        id: 'mdNoticeTime', name: 'MD Notice Accept Date & Time', field: 'mdNoticeTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        maxWidth: 200,
        minWidth: 170
      },

    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "idLoggedKey",
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

  handlePaginationChange(pagination: ServicePagination, pointer: any): void {
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
    debugger
    if (!this.filterFromDate || !this.filterToDate) {
      return;
    }
    this.btnRef = 'search';
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';

    this.loadData(fromDate, toDate, 'FILTER_SEARCH')
  }

  loadData(fromDate, toDate, pointer) {
    debugger
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
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.loading = true;
    this.showProgress = true;

    this.cs.execute(ActionType.ACTION_LOGON_REPORT, ContentType.ReportSearch, payload)
      .subscribe((res: any) => {
        console.log(res)
        this.loggedReport = res.payload.items.map(item => ({
          ...item,
          pointer: pointer
        }));
        this.totalItem = res.payload.totalItem

        setTimeout(() => {
          this.paginationService.updateTotalItems(this.totalItem);
        }, 500);
        this.showProgress = false;
        this.loading = false;
        this.cdk.detectChanges();

      });
  }

  search() {
    var fromDate = this.formatDateToYYYYMMDDHHMMSS(this.getStartOfDay(this.fromDate));
    var toDate = this.formatDateToYYYYMMDDHHMMSS(this.getEndOfDay(this.fromDate));
    debugger
    this.loadData(fromDate, toDate, 'SEARCH');
  }
  public filePathObject;
  onDownloadLoggedReport() {

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

    }

    this.loading = true;
    this.showProgress = true;
    this.http.post(environment.SERVER_BASE_URL + '/logged/report/download', payload).subscribe((res) => {
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
      saveAs(res, "LoggedReport_" + fileName);

      setTimeout(() => {
        this.paginationService.updateTotalItems(this.totalItem);
      }, 500);
      this.loading = false;
      this.showProgress = false;

    });



  }



  onResponse(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.loading = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'LOGON_REPORT') {
      console.log(res);

    }
  }
  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.loading = false;
    console.log('error', res);
  }



}
