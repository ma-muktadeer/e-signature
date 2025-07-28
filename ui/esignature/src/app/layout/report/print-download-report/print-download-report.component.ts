import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-print-download-report',
  templateUrl: './print-download-report.component.html',
  styleUrls: ['./print-download-report.component.scss']
})
export class PrintDownloadReportComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  institutionId = null;
  loginName = "null";
  isCollapsed = true;
  loading: boolean = true;
  showProgress: boolean = true;
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
    this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
    }, 0);
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
      {
        id: 'seekingFor', name: 'Seeking For', field: 'seekingFor',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.seekingFor),
        minWidth: 180
      },
      {
        id: 'downloadPa', name: 'Download PA', field: 'downloadPa',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        formatter: this.attemptStatusFormatter,
        minWidth: 150
      },
      // {
      //   id: 'downloaderKey', name: 'Downloader Key', field: 'downloaderKey',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 150
      // },

      {
        id: 'downloderName', name: 'Downloader Name', field: 'downloderName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 200
      },
      {
        id: 'downloadDate', name: 'Download Date', field: 'downloadDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180
      },
      {
        id: 'activityType', name: 'Activity Type', field: 'activityType',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.activityType),
        minWidth: 220
      },

      {
        id: 'downloadType', name: 'Download Type', field: 'downloadType',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row, cell, value, columnDef, dataContext) => blockToCamel(dataContext.downloadType),
        minWidth: 170
      },

      {
        id: 'letterIsuAuth', name: 'Letter Isu Auth', field: 'letterIsuAuth',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'remarks', name: 'Remarks', field: 'remarks',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'letterRefNum', name: 'Letter Ref Num', field: 'letterRefNum',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'letterDate', name: 'Letter Date', field: 'letterDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,
        formatter: (row, cell, value) => value ? value.split(' ')[0] : value,
      },


    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "downloadSignatureKey",
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
    debugger
    if (!this.filterFromDate || !this.filterToDate) {
      return;
    }
    var fromDate = this.filterFromDate.replace(/-/g, '') + '000000';
    var toDate = this.filterToDate.replace(/-/g, '') + '235959';
    this.loadData(fromDate, toDate, 'FILTER_SEARCH')
  }

  loadData(fromDate, toDate, pointer) {
    debugger
    var payload = {
      fromDate: fromDate,
      toDate: toDate,
      loginName: this.loginName,
      institutionId: this.institutionId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.loading = true;
    this.showProgress = true;
    this.cs.execute(ActionType.ACTION_DOWNLOAD_REPORT, ContentType.ReportSearch, payload)
      .subscribe((res: any) => {
        console.log(res)
        this.loggedReport = res.payload.itemsDownloadReport.map(item => ({
          ...item,
          pointer: pointer
        }));
        this.totalItem = res.payload.totalItem

        setTimeout(() => {
          this.paginationService.updateTotalItems(this.totalItem);
        }, 500);
        this.loading = false;
        this.showProgress = false;

      });
  }

  search() {
    var fromDate = this.formatDateToYYYYMMDDHHMMSS(this.getStartOfDay(this.fromDate));
    var toDate = this.formatDateToYYYYMMDDHHMMSS(this.getEndOfDay(this.fromDate));
    debugger
    this.loadData(fromDate, toDate, 'SEARCH');
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

    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;
    console.log('error', res);
  }



}
