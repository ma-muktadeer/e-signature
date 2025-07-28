import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, GridOption, GridStateChange, GridStateType, PaginationService, ServicePagination } from 'angular-slickgrid';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { blockToCamel } from 'src/app/service/BlockToCamel';
@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss']
})
export class ActivityLogsComponent extends Softcafe implements OnInit, Service, AfterViewInit, OnDestroy {

  showGrid: boolean = true;
  columnDefinitions: Column[] = [];
  private angularGrid: AngularGridInstance;
  private gridObj: any;
  private dataViewObj: any;
  private paginationService: PaginationService;
  private filterRequestTimer: any;
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number = 0;

  private printText: string;
  private downloadText: string;
  private mtSelected: boolean;

  public appPermission = AppPermission;
  gridOptions: GridOption = {};
  isAuthView: boolean;
  fromDate = new Date()
  toDate = new Date()
  logList: any[] = [];
email: any;
name: any;
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
loading: boolean = false;
showProgress: boolean = false;
  constructor(private cs: CommonService,
    private cdr: ChangeDetectorRef,
    public permissionStoreService: PermissioinStoreService
  ) {
    super();
    this.prepareGrid();
    this.isAuthView = permissionStoreService.hasPermission(this.appPermission.ACTIVITY_LOG_VIEWER);
  }

  ngOnInit(): void {
    this.gridOptions = this.buildGridOptions();
    // this.loadActivity();
    this.filterSearch();
    this.getWindowSize();
  }

  ngAfterViewInit(): void {
    this.showGrid = true;
}

  ngOnDestroy(): void {
    this.angularGrid?.destroy;
  }


  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      // sortable: true,
      // type: FieldType.text,
      // filterable: true,
      // filter: { model: Filters.inputText },
      {
        id: 'activityType',
        name: 'Activity',
        field: 'activityType',
        minWidth: 190,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.activityType)
      },
      {
        id: 'activityTime',
        name: 'Activity Time',
        field: 'activityTime',
        minWidth: 190,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },
      
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        minWidth: 190,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },
      {
        id: 'pa',
        name: 'PA',
        field: 'pa',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },
      {
        id: 'name',
        name: 'User Name',
        field: 'name',
        minWidth: 150,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },
      {
        id: 'linkSendingEmail',
        name: 'Signature View User Email',
        field: 'linkSendingEmail',
        minWidth: 190,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },

      {
        id: 'designation',
        name: 'Designation',
        field: 'designation',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
      },



    ];

  }

  buildGridOptions() {
    var option: GridOption = {
      datasetIdPropertyName: "viewActivityLogId",
      enableAutoResize: true,
      enableSorting: true,
      enableRowSelection: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      defaultFilter: true,
      multiSelect: false,
      editable: true,
      autoEdit: true,
      enableFiltering: true,
      autoCommitEdit: true,
      forceFitColumns: true, // this one is important
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 200
      },
      enablePagination: true,
      pagination: {
        pageNumber: this.pageNumber,
        pageSizes: [5, 10, 20, 25, 50, 75, 100, 150, 500],
        pageSize: this.pageSize,
        totalItems: this.total,
      },
    }
    return option;
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    debugger
    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);

    this.paginationService = this.angularGrid.paginationService;
    this.paginationService.onPaginationChanged.subscribe((paginationData: ServicePagination) => {
      this.handlePaginationChagne(paginationData);
    });
    this.angularGrid.gridStateService.onGridStateChanged.subscribe((change: GridStateChange) => {
      debugger
      this.handleGridStateChanged(change);
    });
  }

  private handlePaginationChagne(pagination: ServicePagination) {
    console.log('pagination change');
    this.buildPagination(pagination);
  }

  buildPagination(pagination: ServicePagination) {
    debugger
    const { pageNumber, pageSize } = pagination;
    // this.loadESignatuure(pageNumber, pageSize);
    // sa; lkf
  }

  handleGridStateChanged(change: GridStateChange) {
    console.log(change);
    if (this.filterRequestTimer) {
      clearTimeout(this.filterRequestTimer);
    }
    if (change.change.type == GridStateType.filter) {
      // var filter = this.buildFilterSearch(change);
      // this.sendFilterDataRequest();
    } else if (change.change.type == GridStateType.pagination) {
      this.pageNumber = change.gridState.pagination.pageNumber;
      this.pageSize = change.gridState.pagination.pageSize;
      // this.loadActivity();
      this.filterSearch();

    } else if (change.change.type == GridStateType.rowSelection) {
      this.handleRowSelection(change);
    }
  }

  handleRowSelection(change) {
    const selectedRows = this.dataViewObj.getAllSelectedItems();
    // this.checkMultipleRequestStatus(selectedRows);

  }

  onSelectedRowsChanged(e, args) {
    this.printText = 'Print(' + args.rows.length + ')';
    this.downloadText = 'Download(' + args.rows.length + ')';
    if (args.rows.length > 0) {
      this.mtSelected = true;
    } else {
      this.mtSelected = false;
    }
  }

  // loadActivity() {
  //   var payload = {
  //     pageNumber: this.pageNumber,
  //     pageSize: this.pageSize,
  //   }
  //   this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.ActivityLog, 'SELECTE_ALL', payload);
  // }

  filterSearch() {
  const fromDate = this.filterFromDate ? this.filterFromDate.replace(/-/g, '') + '000000' : null;
  const toDate = this.filterToDate ? this.filterToDate.replace(/-/g, '') + '235959' : null;
    if (this.name && this.name.length < 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'User Name must be at least 3 characters long.',
          confirmButtonText: 'OK',
        });
        return;
      }
  const payload = {
    pageNumber: this.pageNumber,
    pageSize: this.pageSize,
    email: this.email,
    name: this.name,
    fromDate: fromDate,
    toDate: toDate,
  
  };
  this.loading = true;
  this.showProgress = true;
    this.cs.sendRequest(this, ActionType.ACTIVITY_LOG_SEARCH, ContentType.ActivityLog, 'ACTIVITY_LOG_SEARCH', payload);
 
 debugger }
  
  buildGridPagination(){

    setTimeout(()=>{
      if(this.paginationService){
        this.paginationService.updateTotalItems(this.total);
      }

    }, 100);
    this.cdr.detectChanges();
  }
  filterToDate: string = new Date().toISOString().split('T')[0];
  // filterFromDate: string = '';
  // filterFromDate: string = new Date().toISOString().split('T')[0];
  filterFromDate: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  onResponse(service: Service, req: any, res: any) {
    debugger
    this.showProgress = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'SELECTE_ALL') {
      const baseRes = res.payload;
      this.logList = baseRes.content;
      this.total = baseRes.total;

      console.log(this.logList);

      this.buildGridPagination();
    }
    else if (res.header.referance === 'ACTIVITY_LOG_SEARCH') {
      const baseRes = res.payload;
      this.logList = baseRes.content;
      this.total = baseRes.total;

      console.log(this.logList);

      this.buildGridPagination();
      this.loading = false;
      this.showProgress = false;
    }

  }
  onError(service: Service, req: any, res: any) {
    console.log('getting error, ', res);

  }

  height: number;
  width: number;
  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.75;
    debugger
    this.width = document.getElementById('gw')?.offsetWidth;
    let grd = document.getElementById('activityLogGridId');
    if (grd) {
      grd.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }
  }


}