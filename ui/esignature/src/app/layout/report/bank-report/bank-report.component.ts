import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank-report',
  templateUrl: './bank-report.component.html',
  styleUrls: ['./bank-report.component.scss']
})
export class BankReportComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  now = new Date()
  fromDate = new Date()
  toDate = new Date()
  institutionId = null;
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
  institutionList: any[] = [];
  selectedInstitutionName: string;
  loading: boolean = false;
  showProgress: boolean = false;
  constructor(private cs: CommonService) {
    super()
  }

  ngOnInit(): void {
    // this.search();
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
    this.loadValue();
    this.filterSearch();
  }

  loadValue() {
    forkJoin([this.loadInstitution()])
      .pipe(
        map(([institution]) => (
          {
            institution
          }
        )),
      )
      .subscribe((res: any) => {
        debugger
        this.institutionList = res['institution']?.payload;
      });

  }
  loadInstitution() {
    const payload = {
    }
    return this.cs.execute(ActionType.SELECT, ContentType.Institution, payload);
  }

  dropdownSettingsInstitution: IDropdownSettings = {
    singleSelection: true,
    idField: 'institutionId',
    textField: 'institutionName',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search Institution',
    noDataAvailablePlaceholderText: 'No institution found',
  };

  getInstitutionIdS(event: any) {
    this.institutionId = event.institutionId;
    console.log('selectedInstitutionId', this.institutionId);
  }
  deselect(event: any) {
    this.institutionId = null;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
    }, 0);
  }


  getInstitutionId() {
    const selectedInstitution = this.institutionList.find(f => f.institutionName === this.selectedInstitutionName);
    const selectedInstitutionId = selectedInstitution?.institutionId;
    console.log('selectedInstitutionId', selectedInstitutionId);

    this.institutionId = selectedInstitutionId;
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
      //   id: 'signatureInfoId', name: 'Signature Id', field: 'signatureInfoId',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 100,

      // },
      // {
      //   id: 'institutionId', name: 'Institution Id', field: 'institutionId',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 100,

      // },
      {
        id: 'pa', name: 'PA', field: 'pa',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 120,

      },
      {
        id: 'employeeId', name: 'Employee Id', field: 'employeeId',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'name', name: 'Name', field: 'name',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'email', name: 'Email', field: 'email',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 250,

      },
      {
        id: 'institutionName', name: 'Institution Name', field: 'institutionName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'department', name: 'Department', field: 'department',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'designation', name: 'Designation', field: 'designation',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'address', name: 'Address', field: 'address',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'baranchName', name: 'Branch/Division Name', field: 'baranchName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'approval', name: 'Approval', field: 'approval',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      // {
      //   id: 'isSignatoryActive', name: 'Is Signatory Active', field: 'isSignatoryActive',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 80,

      // },
      // {
      //   id: 'isSignatureActive', name: 'Is Signature Active', field: 'isSignatureActive',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 80,

      // },

      // {
      //   id: 'signatoryId', name: 'Signatory Id', field: 'signatoryId',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 120,

      // },
      // {
      //   id: 'signatureId', name: 'Signature Id', field: 'signatureId',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 120,

      // },

      {
        id: 'effictiveDate', name: 'Effective Date', field: 'effictiveDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,
        formatter: (row, cell, value) => value ? value.split(' ')[0] : value,

      },

      {
        id: 'paAuthDate', name: 'PA Auth Date & Time', field: 'paAuthDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },

      {
        id: 'signatureCreateDate', name: 'Signature Create Date & Time', field: 'signatureCreateDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },

      {
        id: 'signatureStatus', name: 'Signature Status', field: 'signatureStatus',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.signatureStatus),
        minWidth: 190,

      },

      {
        id: 'status', name: 'Approved Status', field: 'status',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, }, formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.status),
        minWidth: 150,

      },

      {
        id: 'rejectionCause', name: 'Rejection Cause', field: 'rejectionCause',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 220,

      },
      {
        id: 'calcelCause', name: 'Calcel Cause', field: 'calcelCause',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },

      {
        id: 'cancelTime', name: 'Cancel Date & Time', field: 'cancelTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'birthday', name: 'Birthday', field: 'birthday',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,
        formatter: (row, cell, value) => value ? value.split(' ')[0] : value,

      },
      // {
      //   id: 'active', name: 'Active', field: 'active',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 80,

      // },
      {
        id: 'cancelEffectiveDate', name: 'Cancel Effective Date', field: 'cancelEffectiveDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,
        formatter: (row, cell, value) => value ? value.split(' ')[0] : value,

      },
      {
        id: 'inactiveTime', name: 'Inactive Date', field: 'inactiveTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,
        formatter: (row, cell, value) => value ? value.split(' ')[0] : value,

      },
      {
        id: 'modDate', name: 'Mod Date & Time', field: 'modDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },

      {
        id: 'signatureType', name: 'Signature Type', field: 'signatureType',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 100,

      },
      // {
      //   id: 'isMainSignature', name: 'Is Main Signature', field: 'isMainSignature',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 50,

      // },
      // {
      //   id: 'ownInstitution', name: 'Own Institution', field: 'ownInstitution',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 50,

      // },
      {
        id: 'deligation', name: 'Deligation', field: 'deligation',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'contactNumber', name: 'Contact Number', field: 'contactNumber',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'group', name: 'Group', field: 'group',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 100,

      },
      // {
      //   id: 'approveBy', name: 'Approve By', field: 'approveBy',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 150,

      // },
      {
        id: 'approveDate', name: 'Approve Date & Time', field: 'approveDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      // {
      //   id: 'authorizeBy', name: 'Authorize By', field: 'authorizeBy',
      //   sortable: true, type: FieldType.number,
      //   filterable: true, filter: { model: Filters.inputText, },
      //   minWidth: 150,

      // },
      {
        id: 'authorizeDate', name: 'Authorize Date & Time', field: 'authorizeDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 180,

      },
      {
        id: 'remarks', name: 'Remarks', field: 'remarks',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150,

      },
      {
        id: 'agreementFileDate', name: 'Agreement Upload Date & Time', field: 'agreementFileDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'approvalFileDate', name: 'Approval Upload Date & Time', field: 'approvalFileDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },

      {
        id: 'deleteDate', name: 'Deletion Date & Time', field: 'deleteDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },
      {
        id: 'updateDate', name: 'Updated sign date & Time.', field: 'updateDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 170,
      },

    ];

  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "signatureInfoId",
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
      institutionId: this.institutionId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.loading = true;
    this.showProgress = true;
    this.cs.execute(ActionType.ACTION_BANK_SEARCH_REPORT, ContentType.ReportSearch, payload)
      .subscribe((res: any) => {
        console.log(res)
        debugger
        this.searchReport = res.payload.itemsBankReport.map(item => ({
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
