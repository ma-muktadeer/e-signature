import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, GridStateChange, GridStateType, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CommonViewComponent } from '../common-view/common-view.component';

@Component({
  selector: 'app-common-file-view-grid',
  templateUrl: './common-file-view-grid.component.html',
  styleUrls: ['./common-file-view-grid.component.scss']
})
export class CommonFileViewGridComponent extends Softcafe implements OnInit, Service {

  @Input('dataSet') dataSet: any;
  @Input('agreement') agreement: boolean = false;
  @Input()
  private cmnPop = CommonViewComponent;

  isSaveGeneralNotic: boolean = true;
  isSaveInstructionFile: boolean = true;
  @Output() valueSelected: EventEmitter<any> = new EventEmitter();

  columnDefinitions: Column[] = [];

  private angularGrid: AngularGridInstance;
  private gridObj: any;
  private dataViewObj: any;
  private paginationService: PaginationService;
  private filterRequestTimer: any;
  pageNumber: number = 1;
  pageSize: number = 20;
  actionColumnWidth: number = 10;

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    const ext = dataContext.fileName.substring(dataContext.fileName.lastIndexOf('.'));
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
      return '<i title="View"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>';
    } else {
      return;
    }
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="edit" title="View" style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>';
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="delete"  style="font-size:14px;"  class="fa fa-trash pointer" aria-hidden="true"></i>';
  };
  fileTypeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return blockToCamel(dataContext?.configSubGroup);
  };

  public appPermission = AppPermission;
  isShow: any;
  file: boolean = false;
  imgFile: any;

  constructor(
    public permissionStoreService: PermissioinStoreService,
    private cs: CommonService,
    private model: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareGrid();
    this.getScreenSize();
  }


  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    let mainCollumn = [
      {
        id: 'view',
        name: '',
        field: 'view',
        formatter: this.viewIcon,
        minWidth: 25,
        width: this.actionColumnWidth,
        maxWidth: 50,
        toolTip: "View File",
        onCellClick: (e, args) => {
          const ext = args.dataContext.fileName.substring(args.dataContext.fileName.lastIndexOf('.'));
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
            this.onView(e, args)
          }
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },
      {
        id: 'delete',
        name: '',
        field: 'delete',
        formatter: this.deleteIcon,
        minWidth: 20,
        width: this.actionColumnWidth,
        maxWidth: 50,
        toolTip: "Delete User",
        onCellClick: (e, args) => {
          if (this.permissionStoreService.hasPermission(this.appPermission.AGREEMENT_SETUP_MAKER)) {
            this.onDelete(e, args)
          }
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },

      {
        id: 'fileName',
        name: 'File name',
        field: 'fileName',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },

        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'type',
        name: 'File Type',
        field: 'configSubGroup',
        sortable: true,
        type: FieldType.text,
        formatter: this.fileTypeFormatter,
        filterable: isFilterable,
        filter: { model: Filters.inputText },

        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'createDate',
        name: 'Create date',
        field: 'createDate',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },

        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },

      {
        id: 'status',
        name: 'Status',
        field: 'status',
        // formatter: this.status,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },

        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
    ];

    if (!this.permissionStoreService.hasPermission(this.appPermission.AGREEMENT_SETUP_MAKER)) {
      mainCollumn = mainCollumn.filter(f => f.id != 'delete');
    }
    this.columnDefinitions = mainCollumn;

  }
  
  gridOptions: GridOption = {
    datasetIdPropertyName: 'agreementFileId',
    enableAutoResize: false,
    enableSorting: true,
    enableRowSelection: true,
    enableCellNavigation: true,
    enableCheckboxSelector: false,
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
      pageNumber: 1,
      pageSizes: [25, 50, 75, 100, 150, 500],
      pageSize: 25
    },
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // this.getScreenSize();

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
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
      const pageNumber = change.gridState.pagination.pageNumber;
      const pageSize = change.gridState.pagination.pageSize;

    } else if (change.change.type == GridStateType.rowSelection) {
      this.handleRowSelection(change);
    }
  }

  handleRowSelection(change) {
    const selectedRows = this.dataViewObj.getAllSelectedItems();
  }

  onDelete(e: any, args: any) {
    // let payload = args.dataContext;
    let payload: any={objectId: args.dataContext.configId};
    if (this.agreement) {
      payload.configGroup = 'AGREEMENT_FILE';
      payload.configSubGroupList = ['GENERAL_NOTIC_FILE', 'INSTRUCTION_FILE'];
    } else {
      payload.configGroup = 'DISCLAIMER';
      payload.configSubGroupList = ['LEGAL_DISCLAIMER'];
    }
    // this.openPopup(payload);
    if (payload) {
      this.popupInfoMsg('warning', 'Delete').then(
        (r: any) => {
          if (r.isConfirmed) {
            this.cs.sendRequest(this, ActionType.DELETE_AGREEMENT, ContentType.DocumentFiles, 'SELECT_ALL_AGREEMENT', payload);
          }
        }
      )
    }
  }

  popupInfoMsg(icon: SweetAlertIcon, action: string): any {
    return Swal.fire({
      icon: icon,
      title: 'Info',
      // text: `Are you want to ${action}?`,
      text: `Want to Submit?`,
      showDenyButton: true,
      showConfirmButton: true,
    });
  }


  popupMsg(icon: SweetAlertIcon, title: string, text: string, timer?: boolean): any {
    return Swal.fire({
      icon: icon,
      title: title,
      timer: timer ? 5000 : null,
      text: text,
    });
  }

  showDeleteSuccessMsg(list: any[]) {
    this.popupMsg('success', 'Success', 'Delete successful.').then(
      () => {
        this.dataSet = list;
        this.sendValue();
      }
    );
  }

  sendValue() {
    this.valueSelected.emit(this.dataSet);
  }

  onView(e: any, args: any) {

    this.imgFile = args.dataContext;

    const payload = this.imgFile;
  this.cs.sendRequest(this, ActionType.BUILD_IMAGE64, ContentType.DocumentFiles, 'BUILD_IMAGE64', payload);
  }

  openPopup(file: any) {
    let popRef = this.model.open(this.cmnPop, {backdrop: 'static', size: 'xl'});
     popRef.componentInstance.imgFile = this.imgFile;
     popRef.componentInstance.file = file;
   }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      this.popupMsg('error', 'Error', super.getErrorMsg(res),);
      return;
    }
    debugger
    if (res.header.referance === 'SELECT_ALL_AGREEMENT') {
      const list = res.payload;
      if (this.dataSet?.length > list.length) {
        this.showDeleteSuccessMsg(list);
      } else {
        this.dataSet = res.payload;
      }
    }
    else if (res.header.referance === 'BUILD_IMAGE64') {
      this.openPopup(res.payload);
    }
  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


  height: number;
  width: number;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.height = window.innerHeight * 0.5;
    this.width = document.getElementById('temp')?.offsetWidth;
    let gr = document.getElementById('agreementtureGrid');
    if (gr && this.angularGrid) {
      gr.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }

  }

}
