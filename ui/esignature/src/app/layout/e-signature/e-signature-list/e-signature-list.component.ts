import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, Formatter, GridOption, GridStateChange, GridStateType, MenuCallbackArgs, OnEventArgs, PaginationService, ServicePagination } from 'angular-slickgrid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { RequestPopupComponent } from 'src/app/shard-module/request-popup/request-popup.component';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { ESignaturePopupComponent } from '../e-signature-popup/e-signature-popup.component';
import { SignatureService } from './signature.service';

@Component({
  selector: 'app-e-signature-list',
  templateUrl: './e-signature-list.component.html',
  styleUrls: ['./e-signature-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ESignatureListComponent extends Softcafe implements OnInit, Service, AfterViewInit, AfterContentChecked, OnDestroy {

  @ViewChild('signaGridList')
  private angularGrid!: AngularGridInstance;
  loading: boolean = true;
  showProgress: boolean = false;

  signatureList: any[] = [];
  columnDefinitions: Column[] = [];

  private gridObj: any;
  private dataViewObj: any;
  private paginationService: PaginationService;
  private filterRequestTimer: any;
  pageNumber: number = 1;
  pageSize: number = 20;
  rejectionCause: string;
  showActionBtn: boolean = true;


  private printText: string;
  private downloadText: string;
  private mtSelected: boolean;


  view: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    const obj = dataContext;
    // if (obj.status === 'PENDING') {
    return '<i title="View" class="fa fa-eye btn-outline-dark" aria-hidden="true""></i>';
    // }
    // return;
    // return '<button class="btn"><i class="fa fa-home"></i> Home</button>';
  };
  edit: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // return '<button type="button" class="btn-danger px-3"><i title="NO"  style="font-size:14px;" class="fa fa-times pointer btn-danger" aria-hidden="true"></i></button>';
    // if (dataContext.status === 'PENDING') {
    if ((dataContext?.status.toUpperCase().includes('NEW') || dataContext?.status.toUpperCase().includes('REJECTED') || dataContext?.status.toUpperCase().includes('APPROVED')) &&
      (this.cs.forceAllow()
        || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
        || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && dataContext.institutionName.toUpperCase().includes('PRIME BANK'))
      )) {
      return '<i title="EDIT"  style="font-size:14px;" class="fa fa-edit pointer btn-outline-dark" aria-hidden="true"></i>';
    } else {
      return '';
    }

    // }
    // return;
  };
  delete: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    // !dataContext?.status.toUpperCase().includes('REJECTED') && 
    if (!dataContext?.status.toUpperCase().includes('PEND_DELETE') && (this.cs.forceAllow()
      || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
      || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && dataContext.institutionName.toUpperCase().includes('PRIME BANK'))
    )) {
      return '<i title="DELETE"  style="font-size:14px; " class="fa fa-trash pointer btn-outline-danger" aria-hidden="true"></i>';
    } else {
      return '';
    }
    // }
    // return;
  };

  approve: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    const obj = dataContext;

    const allowAction = this.cs.forceAllow()
      || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
      || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && dataContext.institutionName.toUpperCase().includes('PRIME BANK'));

    if (allowAction && obj.status === 'NEW' && this.permissioinStoreService.hasAnyPermission([AppPermission.SIGNATURE_MAKER, AppPermission.UPDATE_SIGNATURE])) {
      return '<button type="button" class="btn-success pointer"><i title="Submit" class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else if (allowAction && obj.status === 'PEND_APPROVE' && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)) {
      return '<button type="button" class="btn-primary pointer"><i title="Approve" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }

    else if (allowAction && obj.status === 'PEND_DELETE' && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_DELETE_SIGNATURE)) {
      return '<button type="button" class="btn-warning pointer"><i title="Approve Delete" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }

    return;
  };

  reject: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // return '<button type="button" class="btn-danger px-3"><i title="NO"  style="font-size:14px;" class="fa fa-times pointer btn-danger" aria-hidden="true"></i></button>';
    const allowAction = this.cs.forceAllow()
      || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
      || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && dataContext.institutionName.toUpperCase().includes('PRIME BANK'));
    if (allowAction && dataContext.status === 'NEW' && this.permissioinStoreService.hasPermission(AppPermission.SIGNATURE_MAKER)) {
      // return '<button type="button" class="btn-danger pointer"><i title="Reject" class="fa fa-trash-o" aria-hidden="true"></i></button>';
      return '';
    }
    else if (allowAction && dataContext.status === 'PEND_APPROVE' && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)) {
      return '<button type="button" class="btn-warning pointer"><i title="Reject" class="fa fa-ban" style="color:white" aria-hidden="true"></i></button>';
    }
    return;
  };
  rejectedData: any;
  isMultipleStatus: boolean = true;
  status: string;
  btnRef: string;

  appPermission = AppPermission;
  permissionList: any[];
  showGrid: boolean = false;
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

  total: number = 0;
  gridOptions: GridOption;
  allowInstitutionSearch: boolean = false;
  user: any;

  isSearch: boolean = false;

  constructor(
    private cs: CommonService,
    private signatureService: SignatureService,
    private modalService: NgbModal,
    private bsService: BsModalService,
    public permissioinStoreService: PermissioinStoreService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super();
    this.user = this.cs.loadLoginUser();
    if (this.user.userType == 'INTERNAL_USER' || cs.forceAllow()) {
      this.allowInstitutionSearch = true;
    }
    debugger
    this.showActionBtn = route.snapshot.routeConfig.path != 'signature-log';
  }


  ngOnInit(): void {
    // this.prepareGrid();
    // this.buildGrid();
    this.prepareGrid();
    this.buildGridOption();

    this.loadESignatuure(this.pageNumber, this.pageSize);

    // if(localStorage.getItem('permission')){
    //   this.permissionList = JSON.parse(localStorage.getItem('permission'));
    // }
  }
  ngAfterViewInit(): void {
    this.showGrid = true;
    // this.cdr.detectChanges();

    this.getScreenSize();

    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.angularGrid?.destroy;
  }

  // async buildGrid() {
  //   await this.permissioinStoreService.loadPermission();
  // }
  buildGridOption() {
    this.gridOptions = {
      datasetIdPropertyName: 'signatureInfoId',
      enableAutoResize: false,
      explicitInitialization: true,
      enableSorting: true,
      enableRowSelection: true,
      enableCellNavigation: true,
      enableCheckboxSelector: this.showActionBtn,
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
        pageSizes: [10, 20, 50, 100, 150, 500],
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        totalItems: this.total,
      },
      contextMenu: {
        autoAdjustDrop: true,
        optionItems: [
          // {
          //   // command: 'Active_Status',
          //   // iconCssClass: 'fa fa-user',
          //   // title: 'Active/Inactive user',
          //   // positionOrder: menuOrder++,
          //   // action: (e, args) => { this.toggleActivation(e, args) },
          //   // disabled: false,
          //   // itemUsabilityOverride: (args) => {
          //   //   debugger
          //   //   console.log(args);
          //   //   args.grid.getOptions().contextMenu.commandItems.forEach(element => {
          //   //     if (element.command == 'Active_Status') {
          //   //       element.title = args.dataContext.allowLogin == 'Yes' ? "Inactive User" : "Active User"
          //   //     }
          //   //   });
          //   //   return this.checkActiveRole(args.dataContext);
          //   //   // return true;
          //   // },
          // },
          {
            option: 'Test',
            title: 'Generate Link',
            iconCssClass: 'fa fa-address-card-o py-1',
            textCssClass: 'mx-1',
            disabled: false,
            itemVisibilityOverride: (args) => this.checkPermission(args),
            action: (event, callbackArgs) =>
              this.createLink(event, callbackArgs)
          },
        ]
      }
      // presets: {
      //   columns: [
      //     {
      //       columnId: 'pa'
      //     },
      //     {
      //       columnId: 'name'
      //     },
      //   ]
      // }
    }
  }
  prepareGrid() {
    this.columnDefinitions = this.signatureService.getGridColumn();

    // save signature parmition get
    const permissioinSaveAction: Column[] = [
      {
        id: 'edit', name: '', field: 'edit',
        formatter: this.edit,
        minWidth: 20, width: 25, maxWidth: 100,
        onCellClick: (e, args) => {
          if ((args.dataContext?.status.toUpperCase().includes('NEW') || args.dataContext?.status.toUpperCase().includes('REJECTED') || args.dataContext?.status.toUpperCase().includes('APPROVED')) &&
            (this.cs.forceAllow()
              || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
              || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && args.dataContext.institutionName.toUpperCase().includes('PRIME BANK'))
            )) {
            this.openSignatureUpdatePopup(args.dataContext, 'EDIT');
          } else {
            return;
          }

          // this.editeSignatory(args);
          // if (args.dataContext.status === 'PENDING') {
          //     this.openLoanRejectPopup(args.dataContext);
          //     // this.loanSubmitionNo(args.dataContext);
          // } else {
          //     return;
          // }
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },
    ];

    const permissioinViewAction: Column[] = [
      {
        id: 'view', name: '', field: 'view',
        formatter: this.view,
        minWidth: 20, width: 25, maxWidth: 100,

        onCellClick: (e, args) => {
          console.log(args);
          this.openSignatureUpdatePopup(args.dataContext, 'VIEW');
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false,
      },
    ];

    const permissioinDeleteAction: Column[] = [
      {
        id: 'delete', name: '', field: 'delete',
        formatter: this.delete,
        width: 20,
        onCellClick: (e, args) => {
          debugger
          if (!args.dataContext?.status.toUpperCase().includes('PEND_DELETE') && (this.cs.forceAllow()
            || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
            || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && args.dataContext.institutionName.toUpperCase().includes('PRIME BANK'))
          )) {
            this.reqDeleteSignatory(args);
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
    ];


    if (this.showActionBtn && this.permissioinStoreService.hasPermission(this.appPermission.UPDATE_SIGNATURE)) {
      permissioinSaveAction.push(...this.columnDefinitions);
      this.columnDefinitions = permissioinSaveAction;
    }
    if (this.showActionBtn && this.permissioinStoreService.hasPermission(AppPermission.SIGNATURE_VIEWER)) {
      permissioinViewAction.push(...this.columnDefinitions);
      this.columnDefinitions = permissioinViewAction;
    }
    if (this.showActionBtn && this.permissioinStoreService.hasPermission(AppPermission.SIGNATURE_DELETER)) {
      permissioinDeleteAction.push(...this.columnDefinitions);
      this.columnDefinitions = permissioinDeleteAction;
    }


    const permissioinSaveAndApproveBtn: Column[] = [
      {
        id: 'approve', name: '', field: 'approve',
        formatter: this.approve,
        width: 35, maxWidth: 100,

        onCellClick: (e, args) => {
          debugger
          const allowAction = this.cs.forceAllow()
            || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
            || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && args.dataContext.institutionName.toUpperCase().includes('PRIME BANK'));
          console.log(args);
          if (allowAction && args.dataContext.status === 'NEW'
            && this.permissioinStoreService.hasAnyPermission([AppPermission.SIGNATURE_MAKER, AppPermission.UPDATE_SIGNATURE])) {
            this.request4Approve(args.dataContext);
          } else if (allowAction && args.dataContext.status === 'PEND_APPROVE'
            && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)) {
            this.approveRequestByApprover(args.dataContext);
          }
          else if (allowAction && args.dataContext.status === 'PEND_DELETE'
            && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_DELETE_SIGNATURE)) {
            this.approveDeleteRequestByApprover(args.dataContext);
          }
          else {
            return;
          }
          // this.printSingle(e, args);
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false,
      },
    ];

    const permissioinApproveBtn: Column[] = [
      {
        id: 'reject', name: 'BTN', field: 'reject',
        formatter: this.reject,
        width: 35, maxWidth: 100,
        onCellClick: (e, args) => {
          debugger
          const allowAction = this.cs.forceAllow()
            || !this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE)
            || (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && args.dataContext.institutionName.toUpperCase().includes('PRIME BANK'));
          // this.openSignatureUpdatePopup();
          // this.editeSignatory(args);
          if (allowAction && (args.dataContext.status === 'PEND_APPROVE')
            && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)) {
            // this.rejectByApprover(args.dataContext);
            this.openModal(args.dataContext);
            // this.loanSubmitionNo(args.dataContext);
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
    ];

    if (this.showActionBtn && this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)) {

      permissioinApproveBtn.push(...this.columnDefinitions);
      this.columnDefinitions = permissioinApproveBtn;
    }
    debugger
    if (this.showActionBtn && this.permissioinStoreService.hasAnyPermission([AppPermission.SIGNATURE_MAKER, AppPermission.APPROVE_SIGNATURE, AppPermission.APPROVE_DELETE_SIGNATURE, AppPermission.UPDATE_SIGNATURE])) {
      permissioinSaveAndApproveBtn.push(...this.columnDefinitions);
      this.columnDefinitions = permissioinSaveAndApproveBtn;
    }

    else {
      this.columnDefinitions = this.columnDefinitions;
    }

    // // this.columnDefinitions = actionColumn;
    console.log('permission: approver= ', this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE))
    console.log(this.columnDefinitions);

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
    this.loadESignatuure(pageNumber, pageSize);
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

      // this.pageNumber = pageNumber;
      // this.pageSize = pageSize;
      // this.searchPayment();
      // this.handlePaginationChagne(pageNumber, pageSize);
    } else if (change.change.type == GridStateType.rowSelection) {
      this.handleRowSelection(change);
    }
  }

  handleRowSelection(change) {
    const selectedRows = this.dataViewObj.getAllSelectedItems();
    this.checkMultipleRequestStatus(selectedRows);

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


  rejectByApprover() {
    debugger
    console.log('rejected value is: ', this.rejectedData, 'cause: ', this.rejectionCause);

    this.sendRequest(this.rejectedData, 'REJECTED_BY_APPROVER', 'Want to Submit?', this.rejectionCause);

  }

  approveRequestByApprover(dataContext: any) {
    debugger
    // console.log('data context', dataContext);
    // let data: any = [];
    // if (dataContext.length > 0) {
    //   data = dataContext;
    // } else {
    //   data = [dataContext];
    // }

    if (!this.cs.forceAllow() && (dataContext?.approveBy == this.cs.loadLoginUser()?.userId || dataContext?.deleteBy == this.cs.loadLoginUser()?.userId)) {
      Swal.fire({
        title: 'Info',
        icon: 'info',
        text: 'You can not Approve this Signature.',
      });
      return;
    } else {
      this.sendRequest(dataContext, 'APPROVED', 'Want to Submit?')
    }


  }

  approveDeleteRequestByApprover(dataContext: any) {
    debugger
    this.sendRequest(dataContext, 'APPROVE_DELETE', 'Want to Submit?')
  }

  request4Approve(dataContext: any) {
    debugger
    // console.log('data context', dataContext);
    // let data: any = [];
    // if (dataContext.length > 0) {
    //   data = dataContext;
    // } else {
    //   data = [dataContext];
    // }
    this.sendRequest(dataContext, 'PEND_APPROVE', 'Want to Submit?');
  }

  sendRequest(dataContext: any, status: string, notification: string, cause?: string) {
    debugger
    let data: any[] = [];
    if (dataContext.length > 0) {
      data = dataContext;
    } else {
      data = [dataContext];
    }

    const payload = {
      updateSignature: data,
      status: status,
      rejectionCause: cause ?? null,
    };

    this.buidSendUpdateRequest(payload, ActionType.UPDATE, notification);
  }

  reqDeleteSignatory(args: OnEventArgs) {
    debugger
    const deleteData = args.dataContext;
    this.sendRequest(deleteData, 'PEND_DELETE', 'Want to Submit?');
  }

  onRequest4ApproverBtn(btnRef?: string) {
    this.btnRef = btnRef;
    const selectedRows = this.dataViewObj.getAllSelectedItems();
    this.approveRequestByApprover(selectedRows);
  }

  checkPermission(args: MenuCallbackArgs): boolean {
    return this.showActionBtn && this.permissioinStoreService.hasPermission(this.appPermission.GENERATE_LINK)
  }
  onApproveRequestByBtn(btnRef?: string) {
    this.btnRef = btnRef;
    const selectedRows = this.dataViewObj.getAllSelectedItems();
    this.request4Approve(selectedRows);
  }

  onRejectedRequestByBtn(status?: string) {
    this.status = status;
    const selectedRows = this.dataViewObj.getAllSelectedItems();
    this.openModal(selectedRows);
  }

  buidSendUpdateRequest(dataContext: any, action: ActionType, title?: string) {

    const payload = dataContext;
    Swal.fire({
      title: title,
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showProgress = true;
        this.loading = true;

        this.cs.sendRequest(this, ActionType.UPDATE, ContentType.SignatureInfo, 'UPDATE', payload);

      }
      else if (result.isDenied) {
        this.closeModale();
        // this.authInprogress = false;
        // this.showProgress = false;
      }
    });
  }

  isRequestApprover(status: string): boolean {

    const selectedRows = this.dataViewObj?.getAllSelectedItems();
    const res = this.permissioinStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE)
      && selectedRows && selectedRows[0]?.status === 'PEND_APPROVE';
    if (res) {
      this.status = status;
    }
    return res;
  }
  isRequestMaker(status: string): boolean {
    const selectedRows = this.dataViewObj?.getAllSelectedItems();
    const res = this.permissioinStoreService.hasPermission(this.appPermission.SIGNATURE_MAKER)
      && selectedRows && selectedRows[0]?.status === 'NEW';
    if (res) {
      this.status = status;
    }
    return res;
  }

  checkMultipleRequestStatus(selectedRows): boolean {
    debugger
    if (selectedRows.length > 0) {
      const re = selectedRows?.filter((r: any) => {
        if (this.status) {
          return r.status != selectedRows[0].status;
          // return r.status != this.status;
        }
      });
      console.log(re);

      this.isMultipleStatus = selectedRows.length == 0 || re?.length > 0;
    } else {
      this.status = null;
    }

    return this.isMultipleStatus;
  }

  loadESignatuure(pageNumber: number, pageSize: number) {

    debugger
    const payload = {
      pageNumber: pageNumber != 0 ? pageNumber : 1,
      pageSize: pageSize,
      institutionId: this.user?.institutionId,
    };
    this.loading = true;
    this.showProgress = true;

    if(this.permissioinStoreService.hasAnyPermission([this.appPermission.SIGNATURE_MAKER, this.appPermission.SIGNATURE_DELETER]) && this.permissioinStoreService.hasPermission(this.appPermission.SIGNATURE_VIEWER)){
      this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.SignatureInfo, 'SELECT_ALL', payload);
    }
    else if(this.permissioinStoreService.hasAnyPermission([this.appPermission.APPROVE_SIGNATURE, this.appPermission.APPROVE_DELETE_SIGNATURE]) && this.permissioinStoreService.hasPermission(this.appPermission.SIGNATURE_VIEWER)){
      this.cs.sendRequest(this, ActionType.SELECT_ALL_4CHECKER, ContentType.SignatureInfo, 'SELECT_ALL', payload);
    }
  }

  updateTotalItemsInPaginationService(total: number) {
    setTimeout(() => {
      if (this.paginationService) {
        this.paginationService.updateTotalItems(total);
        // this.paginationService.changeItemPerPage(this.pageSize);
      }
    }, 100);
    this.cdr.detectChanges();
  }

  onResponse(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'SELECT_ALL') {
      this.isSearch = false;
      this.signatureList = res.payload.allSignature;
      console.log('all signature is, ', this.signatureList);
      this.total = res.payload.total;

      this.updateTotalItemsInPaginationService(this.total);

    }
    else if (res.header.referance === 'UPDATE') {
      this.signatureList = res.payload.allSignature;
      if (res.payload.updateSignature) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${res.payload.updateSignature.length} Signature Update successful.`,
          showConfirmButton: false,
          timer: 5000
        }).then(r => {

          this.closeModale();
          this.gridObj?.setSelectedRows([]);
        });
      }
      console.log('all signature is, ', this.signatureList);

    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    this.showProgress = false;
    console.log('getting error, ', res);

  }

  @Input() component = ESignaturePopupComponent;
  updateSignature: NgbModalRef;
  openSignatureUpdatePopup(data: any, ref?: string) {
    debugger
    this.updateSignature = this.modalService.open(this.component, { windowClass: 'my-class', backdrop: 'static' });

    this.updateSignature.componentInstance.signatureValue = data;
    this.updateSignature.componentInstance.ref = ref;
    this.updateSignature.componentInstance.allData = this.signatureList;
    this.updateSignature.componentInstance.pageNumber = this.pageNumber;
    this.updateSignature.componentInstance.pageSize = this.pageSize;

    this.updateSignature.result.then(res => {
      console.log(res);
      if (res?.updateSignature) {

        this.signatureList = res?.allSignature!;
        this.pageSize = this.signatureList.length;
        this.total = res?.total;
        this.updateTotalItemsInPaginationService(this.total);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${res.updateSignature.length} Signature Update successful.`,
          showConfirmButton: false,
          timer: 5000
        });
      }
      console.log('all signature is, ', this.signatureList);
    });
  }


  @ViewChild('template')
  template!: TemplateRef<any>

  modalRef: BsModalRef;
  openModal(data: any) {
    this.rejectedData = data;
    // this.imageFile = null;
    this.modalRef = this.bsService.show(this.template);
  }

  closeModale() {
    this.rejectionCause = null;
    this.rejectedData = [];
    this.modalRef?.hide();
    this.status = null;
  }


  public createLink(event, callbackArgs) {
    const signatureInfo = callbackArgs.dataContext;
    debugger
    this.openRequestComponent(signatureInfo);
  }

  searchBtnClick(event) {
    this.pageNumber = 1;
    debugger
    if (event.name && event.name.length < 3) {
      this.isSearch = false;
      this.showProgress = false;
      this.loading = false;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Name must be at least 3 characters long.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const payload = event;
    payload.pageSize = this.pageSize;
    payload.pageNumber = this.pageNumber;
    payload.showProgress = true;
    this.showProgress = payload.showProgress;
    this.loading = true;
    this.isSearch = true;
    this.cs.sendRequest(this, ActionType.SEARCH_SIGNATURE, ContentType.SignatureInfo, 'SELECT_ALL', payload);
  }

  @Input()
  private requestTamp = RequestPopupComponent;
  openRequestComponent(information: any) {
    debugger
    const ref = this.modalService.open(this.requestTamp, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.isFromView = true;
    ref.componentInstance.linkInformation = information;
    ref.result.then(res => {
      if (res?.payload?.length) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Request Save Successfull.`,
          showConfirmButton: false,
          timer: 5000
        });
      }
    });
  }

  height: number = 360;
  width: number;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.height = window.innerHeight * 0.8;
    this.width = document.getElementById('temp')?.offsetWidth;
    let gr = document.getElementById('signatureGrid');
    debugger
    if (gr) {
      gr.style.width = this.width + 'px';
      this.angularGrid.slickGrid?.resizeCanvas();
    }

  }

}
