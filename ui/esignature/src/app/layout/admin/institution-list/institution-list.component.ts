import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, OnEventArgs, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { InstitutionAddComponent } from 'src/app/shard-module/institution-add/institution-add.component';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss']
})
export class InstitutionListComponent extends Softcafe implements OnInit, Service, AfterViewInit, OnDestroy, AfterContentChecked {


  actionColumnWidth = 25;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataViewObj;
  pageNumber: number = 1;
  pageSize: number = 20;
  public paginationService: PaginationService;

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="view"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>';
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.status === 'PEND_DELETE') {
      return null;
  }
    return '<i title="Delete" style="font-size:14px; color: red" class="fa fa-trash pointer" aria-hidden="true"></i>';
  };

  actionIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if ((dataContext?.status === 'NEW' || dataContext?.status === 'PEND_UPDATE') && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_MAKER)) {
      return '<button type="button" style="color: white;" class="btn-warning pointer"><i title="Submit" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }
    else if (dataContext?.status === 'PEND_APPROVE' && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_CHECKER)) {
      return '<button type="button" style="color: white;" class="btn-info pointer"><i title="Authorize" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }
    else if (dataContext?.status === 'PEND_DELETE' && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_DELETE_APPROVER)) {
      return '<button type="button" style="color: white;" class="btn-danger pointer"><i title="Delete" class="fa fa-trash" aria-hidden="true"></i></button>';
    }

    else {
      return null;
    }
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.isEditeStatus(dataContext.status)) {
      return '<i title="edit"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>';
    }
    return;
  };
  typeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return blockToCamel(dataContext?.type);
  };
  statusFormattter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return blockToCamel(dataContext?.status);
  };
  gridObj: any;
  showGrid: boolean = false;
  institutionList: any = [];

  appPermission = AppPermission;

  constructor(
    private cs: CommonService,
    private cdf: ChangeDetectorRef,
    private modalService: NgbModal,
    public permissionStoreService: PermissioinStoreService

  ) {
    super();
  }

  ngOnInit(): void {
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
    this.loadInstitution();
  }
  ngAfterViewInit(): void {
    this.getWindowSize();
    this.showGrid = true;
    this.cdf.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdf.detectChanges();
  }
  ngOnDestroy(): void {
    this.angularGrid.destroy;
  }

  isEditeStatus(status: any): boolean {
    return status === 'NEW' || status === 'PEND_UPDATE' || status === 'REJECTED' || status === 'APPROVED';
  }


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    this.paginationService = angularGrid.paginationService;

    this.paginationService.onPaginationChanged.subscribe((pagination: ServicePagination) => {
      this.handlePaginationChange(pagination);
    });
  }
  handlePaginationChange(pagination: ServicePagination): void {

    console.log('pagination chenched', pagination);
    this.loadInstitution(pagination);
    this.gridObj.invalidate();
    this.gridObj.render();

  }
  isFilterable = environment.enableFiltering;
  colDef: Column[] = [
    // {
    //   id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon,
    //   minWidth: 20, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Delete User",
    //   onCellClick: (e, args) => { this.onDelete(e, args) },
    //   excludeFromColumnPicker: true,
    //   excludeFromGridMenu: true,
    //   excludeFromHeaderMenu: true,
    //   excludeFromExport: true,
    //   resizable: false,
    //   focusable: false,
    //   selectable: false
    // },
    {
      id: 'view', name: '', field: 'view', formatter: this.viewIcon, minWidth: 25,
      width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { this.onViewUser(e, args, 'View'); },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },

    {
      id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 20,
      width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => {
        if (this.isEditeStatus(args.dataContext.status)  && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_MAKER)){
          this.onViewUser(e, args, 'Update');
        } else {
          return;
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
      id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon, minWidth: 25,
      width: this.actionColumnWidth, maxWidth: 50,
      // onCellClick: (e, args) => { this.reqDeleteInstitution(e, args, 'Delete'); },
      onCellClick: (e, args) => {
        if (args.dataContext?.status !== 'PEND_DELETE' && 
            this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_DELETER)) {
          this.reqDeleteInstitution(e, args, 'Delete');
        } else {
          return;
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
      id: 'action', name: '', field: 'action', formatter: this.actionIcon,
      width: 35, maxWidth: 100,
      onCellClick: (e, args) => {
        this.buildAction(e, args);
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
      id: 'institutionName', name: 'Institution Name', field: 'institutionName',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
      minWidth: 50,
      // maxWidth: 200,
      resizable: true,
      focusable: false,
      selectable: false,
      width: 200,
    },
    {
      id: 'type', name: 'Institution Type', field: 'type',
      sortable: true, type: FieldType.text, formatter: this.typeFormatter,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
      minWidth: 50,
      // maxWidth: 200,
      resizable: true,
      focusable: false,
      selectable: false,
      width: 200,
    },
    {
      id: 'domain', name: 'Domain', field: 'domain',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
      minWidth: 50,
      // maxWidth: 200,
      resizable: true,
      focusable: false,
      selectable: false,
      width: 200,
    },
    {
      id: 'status', name: 'Institution Status', field: 'status',
      sortable: true, type: FieldType.text, formatter: this.statusFormattter,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
      minWidth: 50,
      // maxWidth: 200,
      resizable: true,
      focusable: false,
      selectable: false,
      width: 200,
    },

  ];

  // actionColumn: Column[] = [
  //   {
  //     id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon, minWidth: 25,
  //     width: this.actionColumnWidth, maxWidth: 50,
  //     // onCellClick: (e, args) => { this.onViewUser(e, args, 'View') },
  //     excludeFromColumnPicker: true,
  //     excludeFromGridMenu: true,
  //     excludeFromHeaderMenu: true,
  //     excludeFromExport: true,
  //     resizable: false,
  //     focusable: false,
  //     selectable: false
  //   },

  // ]

  prepareGrid() {

    if (this.cs.forceAllow()) {
      // this.actionColumn.push(...this.colDef);
      this.colDef = this.colDef;
    }
    else {
      if (!this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_MAKER)) {
        this.colDef = this.colDef.filter(x => x.id != 'edit');
      }
      if (!this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_DELETER)) {
        this.colDef = this.colDef.filter(x => x.id != 'delete');
      }
      if (!this.permissionStoreService.hasAnyPermission([this.appPermission.INSTITUTION_MAKER, this.appPermission.INSTITUTION_CHECKER, this.appPermission.INSTITUTION_DELETE_APPROVER])) {
        this.colDef = this.colDef.filter(x => x.id != 'action');
      }

      // if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.SAVE_USER)) {
      //   this.colDef = this.colDef.filter(x => x.id != 'edit');
      // }

      // if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.APPROVE_USER)) {
      //   this.colDef = this.colDef.filter(x => x.id != 'view');
      // }
    }

    this.columnDefinitions = this.colDef;

    // this.dataset = this.userList;
  }
  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "institutionId",
      enableAutoResize: false,
      explicitInitialization: true,
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

  loadInstitution(pagination?: ServicePagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;

    const payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
    };
    this.cs.sendRequest(this, ActionType.SELECT_2, ContentType.Institution, 'SELECT_ALL', payload);
  }


  onViewUser(e, args, ref: string) {
    // var item = this.gridObj.getDataItem(args.row);
    var item: any = args.dataContext;
    debugger

    this.openPopup(ref, item);
  }
  showStatus(title: string, icons: SweetAlertIcon, text: string, res?: any) {
    Swal.fire({
      title: title,
      icon: icons,
      timer: 5000,
      text: text,
    }).then(t => {
      if (res) {
        this.institutionList = res.payload.content;
        this.chengPagination(res.payload?.total);
      }
    });
  }

  reqDeleteInstitution(e: any, args: any, ref: string) {
    const inst = args.dataContext;

    if (inst) {
      this.buildRequest(inst, 'PEND_DELETE', ref);
    }

  }


  buildRequest(value: any, actionStatus: string, ref: string) {

    let payload: any = value;
    payload.status = actionStatus;

    this.openConfirmation(payload, ref);


  }
  openConfirmation(payload: any, ref: string) {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      // text: `Are you want to ${ref} this Institution?`,
      text: `Want to Submit?`,
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showDenyButton: true,
      showConfirmButton: true,
      color: '#fff',
      background: '#082666',
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        denyButton: 'btn btn-danger mx-2',
      },
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then(r => {
      if (r.isConfirmed) {
        // this.sendRequest(payload, ref);
        this.sendRequest(payload, (ref === 'Submit' || ref === 'Authorize') ? 'Update' : 'Delete');
      } else {
        return;
      }
    });
  }

  sendRequest(value: any, resRef: string) {
    const payload = value;

    this.cs.sendRequest(this, ActionType.SAVE, ContentType.Institution, resRef, payload);

  }

  buildAction(e: any, args: OnEventArgs) {
    const payload = JSON.parse(JSON.stringify(args.dataContext));
    debugger
    let resRef;
    if ((payload.status === 'NEW' || payload.status === 'PEND_UPDATE') && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_MAKER)) {
      payload.status = 'PEND_APPROVE';
      resRef = 'Submit';
    }
    else if (payload.status === 'PEND_APPROVE' && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_CHECKER)) {
      payload.status = 'APPROVED';
      resRef = 'Authorize';
    }
    // else if (payload.status === 'PEND_APPROVE' && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_APPROVER)) {
    //   payload.status = 'APPROVED';
    //   resRef = 'Authorize';
    // }
    else if ((payload.status === 'PEND_DELETE') && this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_DELETE_APPROVER)) {
      payload.status = 'DELETED';
      resRef = 'Deleted';
    }
    else {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'OPSSSS....',
      //   text: 'Somethings Getting Wrong...',
      // }).then(r => { return; });
      return;
    }
    this.openConfirmation(payload, resRef);
  }

  chengPagination(total: number) {
    setTimeout(() => {
      if (this.paginationService) {
        this.paginationService.updateTotalItems(total);
      }
    }, 100);
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }
    else if (res.header.referance == 'SELECT_ALL') {
      // this.institutionList = res.payload;
      this.institutionList = res.payload.content;
      console.log('institution list', this.institutionList);
      
      this.chengPagination(res.payload?.total);
    }
    else if (res.header.referance == 'Delete') {
      this.showStatus('Success', 'success', 'Delete request process successful.', res);
    }
    else if (res.header.referance == 'Update') {
      this.showStatus('Success', 'success', 'Update request process successful.', res);
    }
    else if (res.header.referance == 'Submit') {
      this.showStatus('Success', 'success', 'Request process successful.', res);
    }
    else if (res.header.referance == 'Authorize') {
      this.showStatus('Success', 'success', 'Authorize Request process successful.', res);
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log('error ');

  }

  @Input()
  private component = InstitutionAddComponent;
  private componentRef: NgbModalRef;

  addInstitution(btnRef: any) {
    debugger
    this.openPopup(btnRef);
  }

  openPopup(btnRef: string, insInfo?: any) {
    this.componentRef = this.modalService.open(this.component,
      { size: 'lg', backdrop: 'static', backdropClass: 'light-blue-backdrop' }
    );
    this.componentRef.componentInstance.insInfo = insInfo ?? '';
    this.componentRef.componentInstance.btnRef = btnRef;

    this.componentRef.result.then(res => {
      if (typeof res != 'string') {
        if (res.payload) {
          this.showStatus('Success', 'success', res.payload?.total > this.institutionList.length ? 'Institution Save Successful.' : 'Institution Update Successful.', res);
        }
        else {
          this.showStatus('OPSSS', 'error', 'Sorry something is Wrong');
        }
      }
    })
  }


  height: number;
  width: number;

  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.75;
    this.width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById('insGridId');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }
  }

}
