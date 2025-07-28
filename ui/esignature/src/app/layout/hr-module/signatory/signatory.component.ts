import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularGridInstance, Column, Formatter, GridOption, GridStateChange, GridStateType, OnEventArgs, PaginationService, ServicePagination } from 'angular-slickgrid';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DateConvertService } from 'src/app/service/date-convert.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { app } from 'src/app/softcafe/common/App';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { GroupDeligation } from 'src/app/softcafe/constants/group-daligation';
import Swal from 'sweetalert2';
import { checkNullValue } from '../../../service/BlockToCamel';
import { INSTITUTION_TYPE, InstitutionType } from '../../admin/moder/institution_type';
import { SignatoryService } from './signatory.service';

@Component({
  selector: 'app-signatory',
  templateUrl: './signatory.component.html',
  styleUrls: ['./signatory.component.scss']
})
export class SignatoryComponent extends Softcafe implements OnInit, Service, AfterViewInit, OnDestroy {
  selectInsDrop: any;
  isSearch: boolean = false;
  showProgress: boolean = false;
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
  // isCollapsed = true;
  columnDefinitions: Column[] = [];
  appPermission = AppPermission;
  app = app;
  loading: boolean = true;

  othersDocs: { file: File, fileName: string }[] = [];

  view: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    const obj = dataContext;
    if (this.checkSignatoryPermission()) {
      return '<button type="button" title="View" class="btn-info px-3"><i class="fa fa-eye" aria-hidden="true""></i></button>';
    } else {
      return null;
    }

  };
  edit: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER) && (dataContext.status === 'APPROVED' || dataContext.status === 'NEW' || dataContext.status === 'MODIFIED' || dataContext.status === 'REJECTED')) {
      return '<button type="button" title="Edit" class="btn-info px-3"><i style="font-size:14px;" class="fa fa-edit pointer btn-info" aria-hidden="true"></i></button>';
    }
    else if (dataContext.status === 'PEND_APPROVE' && (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER))) {
      return '<button type="button" title="Reject" class="btn-warning px-3 pointer"><i style="font-size:14px;" class="fa fa-trash-o" aria-hidden="true"></i></button>';
    }

    else {
      return null;
    }
  };
  update: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // return '<button type="button" class="btn-danger px-3"><i title="NO"  style="font-size:14px;" class="fa fa-timee btn-danger" aria-hidden="true"></i></button>';
    // if (dataContext.status === 'PENDING') {
    debugger
    if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER) && dataContext.status === 'NEW' || dataContext.status === 'MODIFIED') {
      return '<button type="button" title="Submit" class="btn-warning pointer px-3"><i style="font-size:14px;" class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER) && dataContext.status === 'PEND_CANCEL') {
      return '<button type="button" title="Cancel PA" class="btn-danger pointer px-3"><i style="font-size:14px;" class="fa fa-check" aria-hidden="true"></i></button>';
    }
    else if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER) && dataContext.status === 'PEND_APPROVE') {
      return '<button type="button" title="Authorize" class="btn-success pointer px-3"><i style="font-size:14px;" class="fa fa-check " aria-hidden="true"></i></button>';
    }

    else {
      return null;
    }
    // }
    // return;
  };
  cancle: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER) && dataContext.status === 'APPROVED') {
      return '<button type="button" title="Cancel" class="btn-warning px-3"><i style="font-size:14px;" class="fa fa-check-square-o pointer btn-warning" aria-hidden="true"></i></button>';
    }

    else {
      return null;
    }
  };
  delete: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // return '<button type="button" class="btn-danger px-3"><i title="NO"  style="font-size:14px;" class="fa fa-times pointer btn-danger" aria-hidden="true"></i></button>';
    if (dataContext.status === 'NEW') {
      return '<button type="button" title="DELETE" class="btn-danger px-3"><i style="font-size:14px;" class="fa fa-trash pointer btn-danger" aria-hidden="true"></i></button>';
    }
    return;
  };
  signatoryList: any;
  private angularGrid: AngularGridInstance;
  private gridObj: any;
  private dataViewObj: any;
  private paginationService: PaginationService;
  private filterRequestTimer: any;
  pageNumber: number = 1;
  pageSize: number = 20;

  private printText: string;


  private downloadText: string;
  private mtSelected: boolean;
  btnName: string = 'Save';
  btnClick: boolean = false;
  approvalFile: any;
  agreementFile: any;
  type: string = '';
  institutionList: any[] = [];
  selectedInstitutionName: string;
  insType: string = '';
  institutionTypeList: InstitutionType[] = INSTITUTION_TYPE;
  editValue: any;
  total: number;
  // singleInsInfo: any;

  groupList: GroupDeligation[] = GroupDeligation.getGroupList();
  deligationList: GroupDeligation[] = GroupDeligation.getDeligationList();
  selectedInstitution: { institutionId: any; domain: string; };
  email: any;
  documentFiles: any[] = [];
  fileName: any;
  pdfSrc: any;
  allInstitutionList: any = [];
  numberUser: number;
  signatoryConfigList: any;
  displayNameMaxLength: any;
  empIdMaxLength: any;
  designationMaxLength: null;
  approvalMaxLength: any;
  addressMaxLength: any;
  departmentMaxLength: any;
  contactNumberMaxLength: any;
  nidMaxLength: any;
  fileType: string;

  constructor(private fb: FormBuilder,
    private cs: CommonService,
    private signatoryService: SignatoryService,
    private dateConvert: DateConvertService,
    private ds: DomSanitizer,
    public permissionStoreService: PermissioinStoreService) {
    super();
  }


  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    this.prepareGrid();
    // this.loadInstitution();
    this.loadValue();
  }

  ngAfterViewInit(): void {
    this.getWindowSize();
  }
  ngOnDestroy(): void {
    this.angularGrid.destroy;
  }

  loadValue() {
    debugger
    this.loading = true;
    const value = forkJoin([this.buildSignatory(), this.loadInstitution()])
      .subscribe((res: any) => {
        this.allInstitutionList = res[1]?.payload;
        console.log('institution list: ', this.institutionList);
        const sigInfo = res[0];
        if (sigInfo) {
          this.buildSignatureInfo(sigInfo);
        }

      });
  }
  buildSignatureInfo(sigInfo: any) {
    console.log('sigInfo', sigInfo?.payload?.allSignatory);
    
    this.btnName = 'Save';
    this.signatoryList = sigInfo.payload.allSignatory;
    this.total = sigInfo.payload.total;
    if (this.allInstitutionList?.length) {
      for (const sig of this.signatoryList) {
        for (const insInfo of this.allInstitutionList) {
          if (insInfo.institutionId == sig.institutionId) {
            sig.institutionName = insInfo.institutionName;
            // result.push({ ...sig, 'institutionName': insInfo.institutionName });
          }
        }
      }
    }

    this.buildTotalPagination();
    this.loading = false;


  }
  loadInstitution() {
    const payload = {
      // institutionId: this.user?.institutionId,
    }
    return this.cs.execute(ActionType.SELECT, ContentType.Institution, payload);
  }

  buildSignatory() {
    const payload = {
      pageSize: this.pageSize ?? 20,
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
    };

    // this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Signatory, 'SELECT_ALL', payload);
    return this.cs.execute(ActionType.SELECT_ALL, ContentType.Signatory, payload);
  }
  loadSignatory() {
    const payload = {
      pageSize: this.pageSize ?? 20,
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
    };

    this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Signatory, 'SELECT_ALL', payload);
  }
  signatoryForm = this.fb.group({
    signatoryId: Number,
    name: [''],
    // employeeId: ['', [Validators.required]],
    employeeId: [
      '',
      [
        Validators.required,
        // Validators.minLength(10),  // Minimum length of 10 digits
        // Validators.maxLength(10),  // Maximum length of 10 digits
        // Validators.pattern('^[0-9]{10}$')  // Exactly 10 digits, all numeric
      ]
    ],
    designation: [''],
    birthday: [''],
    contactNumber: [''],
    address: [''],
    approval: '',
    department: '',
    pa: [''],
    group: [''],
    deligation: [''],
    institutionId: [''],
    nid: [''],
    rejectCause: [''],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]],
  });

  prepareGrid() {
    this.columnDefinitions = this.signatoryService.getGridColumn();

    const actionColumn: Column[] = [
      {
        id: 'view', name: '', field: 'view',
        formatter: this.view,
        minWidth: 40, width: 50, maxWidth: 100,

        onCellClick: (e, args) => {
          console.log(args);
          if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_VIEWER)) {
            this.editSignatory(args, 'View');
          }
          else {
            return;
          }
        },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false,
      },
      {
        id: 'update', name: '', field: 'update',
        formatter: this.update,
        minWidth: 40, width: 50, maxWidth: 100,
        onCellClick: (e, args) => {
          if (args.dataContext.status === 'PEND_APPROVE' && (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER))) {
            this.approveSignatory(args.dataContext);
          }
          // if (args.dataContext.status === 'NEW' && (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER))) {
          //   this.reqApproveSignatory(args.dataContext);
          // }
          else if (args.dataContext.status === 'PEND_CANCEL' && (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER))) {
            this.authCancleSignatory(args.dataContext);
          }
          else if (args.dataContext.status === 'NEW' || args.dataContext.status === 'MODIFIED'
            && this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER)) {
            this.reqApproveSignatory(args.dataContext);
          }

          else {
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
        id: 'edit', name: 'Action', field: 'edit',
        formatter: this.edit,
        minWidth: 40, width: 50, maxWidth: 100,
        onCellClick: (e, args) => {
          // if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER)) {
          //   this.editSignatory(args, 'Update');
          // }
          // else

          if ((args.dataContext.status === 'APPROVED' || args.dataContext.status === 'NEW' || args.dataContext.status === 'MODIFIED' || args.dataContext.status === 'REJECTED')
            && this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER)) {
            this.editSignatory(args, 'Update');
          }
          else if (args.dataContext.status === 'PEND_APPROVE' && (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_CHECKER))) {
            this.rejectSignatory(args.dataContext);
          }

          else {
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
        id: 'delete', name: '', field: 'delete',
        formatter: this.delete,
        minWidth: 40, width: 50, maxWidth: 100,
        onCellClick: (e, args) => {
          if (args.dataContext.status === 'NEW') {
            this.deleteSignatory(args);
          }
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

    if (this.checkSignatoryPermission()) {
      actionColumn.push(...this.columnDefinitions);
      this.columnDefinitions = actionColumn;
      // this.columnDefinitions = actionColumn.filter(r => r.id !='ok');
    } else if (this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_VIEWER)) {
      this.columnDefinitions = this.columnDefinitions;
    } else {
      this.columnDefinitions = [];
    }
    if (!this.permissionStoreService.hasAnyPermission([this.appPermission.SIGNATORY_MAKER, this.appPermission.SIGNATORY_CHECKER])) {
      this.columnDefinitions = this.columnDefinitions.filter(f => f.id != 'update');
    }
    if (!this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_DELETER)) {
      this.columnDefinitions = this.columnDefinitions.filter(f => f.id != 'delete');
    }


    // actionColumn.push(...this.columnDefinitions);
    // this.columnDefinitions = actionColumn;

    console.log(actionColumn);

  }

  checkSignatoryPermission(): boolean {
    return this.permissionStoreService.hasAnyPermission([this.appPermission.SIGNATORY_MAKER, this.appPermission.SIGNATORY_CHECKER]);
  }


  gridOptions: GridOption = {
    datasetIdPropertyName: 'signatoryId',
    enableAutoResize: false,

    explicitInitialization: true,
    enableFiltering: true,
    enableSorting: true,
    enablePagination: true,
    enableExcelExport: true,
    enableColumnReorder: true,
    enableHeaderButton: true,
    enableEmptyDataWarningMessage: true,
    enableCellMenu: true,
    enableCellNavigation: true,
    forceFitColumns: true, // this one is important        
    enableContextMenu: true,
    enableGridMenu: false,
    enableRowSelection: false,
    enableTextSelectionOnCells: true,
    enableAutoTooltip: true,
    enableAutoSizeColumns: true,
    showCustomFooter: true,
    createFooterRow: true,
    customFooterOptions: {
      leftFooterText: "try it"
    },

    enableCheckboxSelector: false,
    defaultFilter: true,
    // multiSelect: false,
    // editable: true,
    autoEdit: true,
    // enableFiltering: true,
    autoCommitEdit: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
    },
    autoTooltipOptions: {
      enableForCells: true,
      enableForHeaderCells: true,
      maxToolTipLength: 200
    },
    // enablePagination: true,
    pagination: {
      pageNumber: this.pageNumber,
      pageSizes: [20, 25, 50, 75, 100, 150, 500],
      pageSize: this.pageSize,
    },

    contextMenu: {
      autoAdjustDrop: true,
      commandItems: [

        {
          command: 'Cancel',
          iconCssClass: 'fa fa-trash',
          title: 'Cancel Signatory',
          // positionOrder: menuOrder++,
          action: (e, args) => { this.signatoryCancel(e, args) },
          disabled: true,
          itemUsabilityOverride: (args) => {
            debugger
            console.log(args);
            args.grid.getOptions().contextMenu.commandItems.forEach(element => {

              if (element.command == 'Cancel') {
                element.title = (args.dataContext.status == 'APPROVED') ? "Cancel Signatory" : "";
              }
            });
            // return this.checkActiveRole(args.dataContext);
            return true;
          },
          itemVisibilityOverride: (args) => {
            return args.dataContext.status === 'APPROVED' && this.permissionStoreService.hasPermission(this.appPermission.SIGNATORY_MAKER);
          }
        },
      ]
    }
  };


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);

    this.paginationService = this.angularGrid.paginationService;
    this.paginationService.onPaginationChanged.subscribe((paginationData: ServicePagination) => {
      this.handlePaginationChagne(paginationData);
    });
    this.angularGrid.gridStateService.onGridStateChanged.subscribe((change: GridStateChange) => {
      this.handleGridStateChanged(change);
    });
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

      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      // this.searchPayment();
    } else if (change.change.type == GridStateType.rowSelection) {
      this.handleRowSelection(change);
    }
  }

  handleRowSelection(change) {
    const selectedRows = this.dataViewObj.getAllSelectedItems();

    // if (selectedRows.length == 0) {
    //     this.showAuthRejectBtn = false;
    //     return;
    // }

    // const notPending = selectedRows.filter(x => x.status != 'PENDING');

    // if (notPending.length) {
    //     this.showAuthRejectBtn = false;
    //     return;
    // }
    // if (!this.checkUser()) {
    //     this.showAuthRejectBtn = false;
    //     return;
    // }
    // this.showAuthRejectBtn = true;
  }

  onSearchBtnClick(event: any) {
    debugger
    this.pageNumber = 1;
    debugger
    if (event.name && event.name.length < 3) {
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
    this.showProgress = true;
    this.isSearch = true;
    this.loading = true;

    this.cs.sendRequest(this, ActionType.SEARCH_SIGNATORY, ContentType.Signatory, 'SELECT_ALL', payload);

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

  private handlePaginationChagne(paginationData: ServicePagination) {
    console.log(paginationData);
    debugger
    this.pageSize = paginationData.pageSize;
    this.pageNumber = paginationData.pageNumber;
    this.loadSignatory();
  }

  loadInstitutionByType(ref?: string) {
    this.selectedInstitution = null;
    this.signatoryForm.get('institutionId')?.setValue('');
    this.selectedInstitutionName = '';
    debugger
    // this.insType = ref ?? '';
    let payload: any = {
      type: ref ?? '',
    };
    this.loading = true;


    this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Institution, 'SELECT_ALL_INSTITUTION', payload);
  }

  loadSignatoryDocs(signatoryInfo: any) {
    this.loading = true;

    const payload = signatoryInfo;
    this.cs.sendRequest(this, ActionType.BUILD_IMAGE64, ContentType.Signatory, 'BUILD_IMAGE64', payload);
  }

  reqApproveSignatory(dataContext: any) {
    const payload = JSON.parse(JSON.stringify(dataContext));
    debugger
    payload.status = 'PEND_APPROVE';

    this.updateSignatory(payload, 'Submit');
  }
  signatoryCancel(event: any, agrs: any) {
    const payload = JSON.parse(JSON.stringify(agrs.dataContext));
    debugger
    Swal.fire({
      title: 'Question',
      // text: 'Are you want to cancel this PA?',
      text: `Want to Submit?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No ',
    }).then(async (r) => {
      if (r.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Cancel Cause",
          inputPlaceholder: "Type cancellation cause...",
          inputAttributes: {
            "aria-label": "Type cancellation cause"
          },
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to provide a cancellation cause!';
            }
          }
        });
        if (text) {
          payload.status = 'PEND_CANCEL';
          payload.cancelCause = text;
          this.updateSignatory(payload, 'Submit');

        }

      }
    })

    // this.updateSignatory(payload, 'Submit');
  }
  cancleSignatory(payload: any) {
    debugger
    this.updateSignatory(payload, 'Submit');
  }
  approveSignatory(dataContext: any) {
    const payload = JSON.parse(JSON.stringify(dataContext));
    debugger

    if (!this.cs.forceAllow() && payload?.approveBy == this.cs.loadLoginUser()?.userId) {
      Swal.fire({
        title: 'Info',
        icon: 'info',
        text: 'You can not Approve this Signatory.',
      });
      return;
    } else {

      payload.status = 'APPROVED';
      this.updateSignatory(payload, 'Authorize');

    }
  }
  rejectSignatory(dataContext: any) {
    const payload = JSON.parse(JSON.stringify(dataContext));
    debugger

    if (!this.cs.forceAllow() && payload?.approveBy == this.cs.loadLoginUser()?.userId) {
      Swal.fire({
        title: 'Info',
        icon: 'info',
        text: 'You can not Approve this Signatory.',
      });
      return;
    } else {

      Swal.fire({
        title: 'Reject Signature',
        input: 'text',
        inputPlaceholder: 'Enter the rejection cause...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to enter rejection cause!';
          } else if (value.length < 3) {
            return 'Cause must be at least 3 characters long!';
          }
          else if (value.length > 100) {
            return 'Cause must be at least 3 characters long!';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user clicked 'Submit'
          const userInput = result.value;

          payload.status = 'REJECTED';
          payload.rejectCause = userInput;
          this.updateSignatory(payload, 'Authorize');
        }
      });


    }
  }
  authCancleSignatory(dataContext: any) {
    const payload = JSON.parse(JSON.stringify(dataContext));
    debugger

    if (!this.cs.forceAllow() && payload?.approveBy == this.cs.loadLoginUser()?.userId) {
      Swal.fire({
        title: 'Info',
        icon: 'info',
        text: 'You can not Canceled this Signatory.',
      });
      return;
    } else {
      payload.status = 'CANCELED';
      this.updateSignatory(payload, 'Cancel');

    }
  }
  updateSignatory(value: any, action: string) {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      // text: `Are you want to ${action} this PA?`,
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
        let payload: any = {};
        if (value instanceof Array) {
          payload.requestSignatory = value;
        } else {
          payload.requestSignatory = [value];
        }
        this.loading = true;
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.cs.sendRequest(this, ActionType.UPDATE, ContentType.Signatory, 'SAVE', payload);

      } else {
        Swal.fire({
          text: `${action} canceled.`,
          icon: "info",
          showConfirmButton: false,
          timer: 5000,
        });
      }
    });


  }

  otherFile(files: any[], i: number, inputElement: HTMLInputElement) {
    const file = files[0];
    if (file.size > 1 * 1024 * 1024) {
      Swal.fire('File size should not exceed 1 MB');
      this.othersDocs[i].file = null;
      inputElement.value = '';
      return;
    }
    this.othersDocs[i].file = files[0];
  }


  fileInput(files: any, ref: string, inputElement: HTMLInputElement) {
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire('File size should not exceed 10 MB');

      if (ref === 'approval') {
        this.approvalFile = null;
      } else if (ref === 'agreement') {
        this.agreementFile = null;
      }

      inputElement.value = '';
      return;
    }

    debugger
    if (ref === 'approval') {
      this.approvalFile = files[0];
    } else if (ref === 'agreement') {
      this.agreementFile = files[0];
    }
  }

  selectionChange(value: string) {

    this.signatoryForm.reset();
    this.insType = '';
    this.selectedInstitutionName = '';
    debugger
    if (value === 'EXTERNAL_USER') {
      // this.loadInstitution();
      this.selectedInstitution = null;
    }
    else {
      let selectedInstitutionId = this.cs.loadLoginUser()?.institutionId;
      this.signatoryForm.get('institutionId').setValue(selectedInstitutionId ?? null);
      this.selectedInstitution = { institutionId: selectedInstitutionId, domain: app.domain };

    }
  }
  buildEmail(event: any) {
    this.email = event.target.value;
    const eml = `${event.target.value}@${this.selectedInstitution?.domain}`;
    console.log('email is:', eml);
    this.signatoryForm.get('email').setValue(eml);


  }

  dropdownSettingsInstitution: IDropdownSettings = {
    singleSelection: true,
    idField: 'institutionId',
    textField: 'institutionName',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search Institution',
    noDataAvailablePlaceholderText: 'No institution found'
  };
  getInstitutionId(event: any) {
    // this.selectedInstitutionName = event.target.value;
    debugger
    this.selectedInstitutionName = event['institutionName'];
    // this.selectedInstitution = this.institutionList.find(f => f.institutionName.trim() === this.selectedInstitutionName.trim());
    this.selectedInstitution = this.institutionList.find(f => f.institutionId == event['institutionId']);
    const selectedInstitutionId = this.selectedInstitution?.institutionId;
    console.log('selectedInstitutionId', selectedInstitutionId);
    if (selectedInstitutionId) {
      this.signatoryForm.get('institutionId').setValue(selectedInstitutionId ?? null);
    } else {
      this.signatoryForm.get('institutionId').setValue('');

    }
  }


  editSignatory(args: OnEventArgs, btnName?: string) {
    this.btnName = btnName;
    // this.isCollapsed = false;
    debugger
    this.editValue = args.dataContext;
    this.editValue.birthday = this.dateConvert.convertDb2Date(args.dataContext?.birthday);

    this.findInstitutionById(this.editValue?.institutionId ?? '');

  }
  findInstitutionById(insId: any) {
    const payload = {
      institutionId: insId,
    }
    this.loading = true;

    this.cs.sendRequest(this, ActionType.SELECT_1, ContentType.Institution, 'SELECT_1', payload);
  }

  buildEditInfo(insInfo: any) {
    debugger
    console.log('selected column value is ', this.editValue);
    this.signatoryForm.reset();

    this.institutionList = [insInfo];
    this.type = this.editValue?.type;

    // this.setUpdateValue(value);
    // const insInfo = this.institutionList?.find(f => f.institutionId == this.editValue?.institutionId);
    this.selectedInstitutionName = insInfo?.institutionName;
    this.selectInsDrop = [this.selectedInstitutionName];
    this.insType = insInfo?.type;
    const eml = this.editValue?.email?.split('@');
    // this.selectedInstitution.domain = eml[1];
    this.selectedInstitution = { institutionId: insInfo.selectedInstitutionId, domain: eml ? eml[1] : insInfo?.domain };
    // this.selectedInstitution = insInfo;

    this.email = eml ? eml[0] : '';
    // this.editValue.email = this.email;

    debugger
    this.signatoryForm.patchValue(this.editValue);
    this.openPopup();

    // this.signatoryForm.patchValue(value);
    // this.openPopup();
  }

  buildInstitution() {
    this.loading = true;
    return this.cs.execute(ActionType.SELECT_ALL, ContentType.Institution, {});
  }

  deleteSignatory(args: OnEventArgs) {
    debugger

    const payload = {
      requestSignatory: [args.dataContext],
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    console.log('delete value is ', payload);
    Swal.fire({
      text: `Want to Submit?`,
      // title: `Are you want to delete this value?`,
      // showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Confirm",
      // cancelButtonText: `Cancel`,
      // cancelButtonColor: 'danger'
      denyButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true;
        // payload.pageNumber = this.pageNumber;
        // payload.pageSize = this.pageSize;

        this.cs.sendRequest(this, ActionType.DELETE, ContentType.Signatory, 'SELECT_ALL', payload);
      } else {
        Swal.fire({ title: `Changes are not Delete`, timer: 1500, icon: 'info', });
      }
    });


  }
  addOrRemoveOtherDocuments(action: string) {
    if (action === 'add') {
      this.othersDocs.push({ file: null, fileName: '' });
    } else if (action === 'remove') {
      this.othersDocs.pop();
    }
  }

  saveSignatory(action: string = 'Save') {
    debugger
    this.btnClick = true;
    const payload = this.signatoryForm.value;
    let validDocs;
    if (this.othersDocs.length > 0) {
      validDocs = this.othersDocs.filter(f => (!f.file || !f.fileName));
    }
    if (!this.checkFormVlaue(this.signatoryForm)) {
      Swal.fire('Please fill up all required field.');
      return;
    }
    // if (this.btnName === 'Save' && !this.approvalFile) {
    //   Swal.fire('Approval File is required.');
    //   return;
    // }
    // if (this.btnName === 'Save' && !this.agreementFile) {
    //   Swal.fire('Agreement File is required.');
    //   return;
    // }

    if (validDocs?.length > 0) {
      Swal.fire('Please fill all the Other Documents information.');
      return;
    }

    // if (this.type == 'EXTERNAL_USER' && !payload.pa) {
    //   Swal.fire('Please Enter The PA.');
    //   return;
    // }


    console.log('signatory form value is: ', payload);

    let formData = new FormData();
    if (this.othersDocs && this.othersDocs?.length) {
      this.othersDocs.forEach(f => {
        const fl = f.file.name.split('.');
        formData.append('files', f.file, `${f.fileName}.${fl[fl.length - 1]}`);
        // formData.append('fileName', f.fileName);
      });
    }
    formData.append('status',
      (this.btnName === 'Save' && action === 'Save') ? 'NEW' :
        (this.btnName === 'Save' && action === 'Save & Submit') ? 'PEND_APPROVE' :
          (this.btnName === 'Update' && action === 'Save') ? 'MODIFIED' :
            'PEND_APPROVE'
    );

    // formData.append('status', (this.btnName != 'Update' && action === 'Save') ? 'NEW' : (this.btnName === 'Update' && action === 'Save') ? 'MODIFIED' : 'PEND_APPROVE');
    // formData.append('status', action === 'Save' ? 'NEW' : 'PEND_APPROVE');
    debugger
    this.showNotifivation(formData, action);
  }

  saveAndSubmitSignatory() {
    debugger
    this.saveSignatory('Save & Sumit');
    // const payload = this.signatoryForm.value;

    // if (!this.checkFormVlaue(this.signatoryForm)) {
    //   Swal.fire('Please fill all the required value to the form.');
    //   return;
    // }
    // // if (this.btnName === 'Save' && !this.approvalFile) {
    // //   Swal.fire('Approval File is required.');
    // //   return;
    // // }
    // // if (this.btnName === 'Save' && !this.agreementFile) {
    // //   Swal.fire('Agreement File is required.');
    // //   return;
    // // }
    // let formData = new FormData();
    // formData.append('status', 'PEND_APPROVE');
    // this.showNotifivation(formData, 'Save & Sumit');

  }

  showNotifivation(formData: FormData, ref: string) {
    let buttonText = ref === "Save & Sumit" ? "Save & Submit" : ref;

    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: `Want to Submit?`,
      // text: `Are you want to ${buttonText} this PA?`,
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
        this.buildSaveRequest(formData);

      } else {
        return;
      }
    });
  }

  buildSaveRequest(formData: FormData) {

    formData.append('type', this.type!);
    formData.append('employeeId', checkNullValue(this.signatoryForm.get('employeeId').value));
    formData.append('institutionId', checkNullValue(this.signatoryForm.get('institutionId').value));
    formData.append('name', checkNullValue(this.signatoryForm.get('name').value));
    formData.append('designation', checkNullValue(this.signatoryForm.get('designation').value));
    formData.append('approval', checkNullValue(this.signatoryForm.get('approval').value));
    formData.append('address', checkNullValue(this.signatoryForm.get('address').value));
    formData.append('email', checkNullValue(this.signatoryForm.get('email').value));
    formData.append('department', checkNullValue(this.signatoryForm.get('department').value));
    formData.append('group', checkNullValue(this.signatoryForm.get('group').value));
    formData.append('deligation', checkNullValue(this.signatoryForm.get('deligation').value));
    formData.append('birthday', checkNullValue(this.signatoryForm.get('birthday').value));
    formData.append('contactNumber', checkNullValue(this.signatoryForm.get('contactNumber').value));
    formData.append('nid', checkNullValue(this.signatoryForm.get('nid').value));

    if (this.btnName === 'Save') {
      // formData.append('employeeId', checkNullValue(this.signatoryForm.get('employeeId').value));
      formData.append('pa', checkNullValue(this.signatoryForm.get('pa').value));
    } else {
      formData.append('signatoryId', checkNullValue(this.signatoryForm.get('signatoryId').value));
      formData.append('pa', checkNullValue(this.signatoryForm.get('pa').value));
    }
    // formData.append('entity', this.signatoryForm.value);
    if (this.approvalFile) {
      formData.append('approvalFile', this.approvalFile);
    }
    if (this.agreementFile) {
      formData.append('agreementFile', this.agreementFile);
    }
    formData.append('pageNumber', this.pageNumber ? this.pageNumber + '' : '');
    formData.append('pageSize', this.pageSize ? this.pageSize + '' : '');

    debugger
    this.sendSaveRequest(formData);
  }

  sendSaveRequest(formData: FormData) {
    const uploadProgress$ = new Subject<number>();
    let swalInstance: any;

    this.cs.filePostBySecure('/save/signatory', formData)
      .pipe(
        finalize(() => {
          uploadProgress$.complete();
          if (swalInstance) {
            swalInstance.close();
            swalInstance = null;
          }
        })
      )
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((event.loaded / event.total) * 100);
            uploadProgress$.next(percentDone); // Emitting progress percentage
          } else if (event.type === HttpEventType.Response) {
            // Handle successful response
            console.log('File uploaded successfully:', event.body);
            const res = event.body;
            if (res.requestSignatory?.length > 0) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 5000
              }).then(() => {
                console.log('signatory ', res.allSignatory);
                
                const payload = {
                  payload: res,
                };
                this.buildSignatureInfo(payload);
              });
            }
          }
        },
        (error) => {
          if (Swal.isVisible()) {
            Swal.close();
          }
          // Handle error response
          console.error('Error uploading file:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: error?.error || 'An unexpected error occurred.',
            confirmButtonText: 'OK',
            didOpen: () => {
              Swal.hideLoading();
            },
          }).then(() => {
            if (swalInstance) {
              swalInstance.close(); // Ensure Swal is closed on error
              swalInstance = null;  // Clear the reference
            }
          });
          this.btnName = 'Save';
        }
      );

    this.closeModal();

    uploadProgress$.subscribe(progress => {
      if (!swalInstance) {
        swalInstance = Swal.fire({
          title: 'Uploading file',
          html: `Progress: <b></b> %`,
          allowOutsideClick: false,
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      }
      if (swalInstance) {
        swalInstance.update({
          html: `Progress: <b>${progress}</b> %`,
        });
      }
    });
  }

  checkFormVlaue(value: FormGroup): boolean {
    return value.valid;
  }
  addSignatory() {
    this.btnName = 'Save';
    this.openPopup();
  }

  clear() {
    this.btnClick = false;
    this.type = '';
    this.signatoryForm.reset();
    // this.btnName = 'Save';
    this.approvalFile = null;
    this.agreementFile = null;
    this.selectedInstitutionName = '';
    this.insType = '';
    this.email = '';
    this.othersDocs.length = 0;
    this.clearf();
  }

  clearf() {
    this.fileName = null;
    this.pdfSrc = null;
  }

  // viewDocEx: string[] = ['.pdf', '.PDF'];
  viewDocEx: string[] = ['.pdf', '.jpg', '.png', '.jpeg', '.gif'];
//   downloadDocument(file: any, ref?: string) {
//     const payload = JSON.parse(JSON.stringify(file));
//     payload.modDate = null;
//     payload.createDate = null;
//     this.fileName = file.fileName;

//     this.cs.fileDownload('/file/download', payload).subscribe({
//       next: (res: any) => {
//         const blob = new Blob([res], { type: 'application/octet-stream' });
//         const fn = this.fileName.slice(this.fileName.lastIndexOf('.')).toLowerCase();
//         // Use lastIndexOf here to match the button condition
//         if (ref === 'view' && this.viewDocEx.includes(fn)) {
//           this.fileType = fn === '.pdf' ? 'application/pdf' : 
//                          ['.png', '.jpg', '.jpeg', '.gif'].includes(fn) ? 'image/jpeg' : "";
//           this.blob2File(blob, this.fileType);
//           this.openPopupView();
//         } else {
//           this.downloadFile(blob);
//         }
//       },
//       error(err: any) {
//         console.log('err', err);
//         Swal.fire('Sorry... Failed to getting Document.')
//       },
//     });
// }

  downloadDocument(file: any, ref?: string) {
    const payload = JSON.parse(JSON.stringify(file));
    payload.modDate = null;
    payload.createDate = null;
    this.fileName = file.fileName;
    debugger

    this.cs.fileDownload('/file/download', payload).subscribe({
      next: (res: any) => {
        console.log('getting response', res);

        const blob = new Blob([res], { type: 'application/octet-stream' });
        const fn = this.fileName.slice(this.fileName.lastIndexOf('.')).toLowerCase();
        // if (ref === 'view' && this.viewDocEx.includes(this.fileName.slice(this.fileName.indexOf('.')))) {
        //   this.fileType = fn === '.pdf' ? 'application/pdf' : fn === '.png' || fn === '.jpg' || fn === '.jpeg' || fn === '.gif' ? 'image/jpeg' : "";
          if (ref === 'view' && this.viewDocEx.includes(fn)) {  // <-- Changed from this.fileName.slice(this.fileName.indexOf('.'))
          this.fileType = fn === '.pdf' ? 'application/pdf' : 
                         ['.png', '.jpg', '.jpeg', '.gif'].includes(fn) ? 'image/jpeg' : ""; 
        // this.pdfSrc = blob;
          this.blob2File(blob, this.fileType);
          this.openPopupView();

        } else {
          this.downloadFile(blob);
        }

      },
      error(err: any) {
        console.log('err', err);
        Swal.fire('Sorry... Failed to getting Document.')
      },
    });
  }
  //new
  blob2File(blob: Blob, type: any) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onload = () => {
      const base64File = reader.result as string;
      const byteCharacters = atob(base64File.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const newBlob = new Blob([byteArray], { type: type });

      const url = URL.createObjectURL(newBlob) + '#toolbar=1&download=1';
      this.pdfSrc = this.ds.bypassSecurityTrustResourceUrl(url);
    };
  }

  //old

  // blob2File(blob: Blob, type: any) {
  //   const f: File = new File([blob], this.fileName, { type: type });
  //   const reader = new FileReader();

  //   reader.onload = (res) => {
  //     // If you want to display it in an iframe, use createObjectURL
  //     const blob = new Blob([res.target.result], { type: f.type });
  //     const url = URL.createObjectURL(blob);

  //     // Assuming pdfSrc is the variable holding the URL to display the PDF
  //     this.pdfSrc = this.ds.bypassSecurityTrustResourceUrl(url);

  //     // Optional: Revoke the Object URL after using it to free up memory
  //     reader.onloadend = () => {
  //       URL.revokeObjectURL(url);
  //     };
  //   };
  //   reader.readAsArrayBuffer(f);
  // }
  downloadFile(blob: Blob) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }


  onResponse(service: Service, req: any, res: any) {
    // this.isCollapsed = true;
    // this.closeModal();
    this.loading = false;
    this.showProgress = false;

    this.btnClick = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'SELECT_ALL') {
      this.isSearch = false;
      this.loading = false;
      this.closeModal();
      console.log('Signatory list is, ', res.payload);

      if (res.payload.requestSignatory?.length > 0) {
        // this.clear();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 5000
        }).then(r => {
          this.buildSignatureInfo(res);
          // this.signatoryList = res.payload.allSignatory;
          // this.total = res.payload.total;
        });
      } else {
        this.buildSignatureInfo(res);
        // this.signatoryList = res.payload.allSignatory;
        // this.total = res.payload.total;
      }
      // this.buildTotalPagination();

    }

    else if (res.header.referance == 'SELECT_ALL_INSTITUTION') {
      this.institutionList = res.payload;
      if (this.institutionList?.length <= 0) {
        Swal.fire({
          icon: 'info',
          title: 'Institution Not Found.',
          text: 'Please Add Institution First.',
          color: '#df4000',
          background: '#a4fd4a',
          iconColor: '#f0f0f0'
        });
      }
    }
    else if (res.header.referance == 'SELECT_1') {
      // this.singleInsInfo = res.payload;
      if (!res.payload) {
        Swal.fire({
          icon: 'info',
          title: 'OPSSSSSS',
          text: 'Required Institution Information Not Found.',
          color: '#df4000',
          background: '#a4fd4a',
          iconColor: '#f0f0f0'
        });
      } else {
        this.buildEditInfo(res.payload);
        this.loadSignatoryDocs(this.editValue);
      }
    } else if (res.header.referance === 'BUILD_IMAGE64') {

      this.documentFiles = res.payload;
    }
    else if (res.header.referance === 'SAVE') {
      console.log('Signatory list is, ', res.payload);
      this.buildSignatureInfo(res);
      // this.signatoryList = res.payload.allSignatory;
      // this.total = res.payload.total;
      // setTimeout(() => {
      //   if (this.paginationService) {
      //     this.paginationService.updateTotalItems(this.total);
      //   }
      // }, 100);

    }
    else if (res.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', res);
      console.log('Reference:', res.header.referance);
      debugger;
      this.signatoryConfigList = res.payload;

      const maxLengthMapping = {
        name2: 'displayNameMaxLength',
        designation: 'designationMaxLength',
        empId: 'empIdMaxLength',
        approval: 'approvalMaxLength',
        address: 'addressMaxLength',
        department: 'departmentMaxLength',
        phone: 'contactNumberMaxLength',
        nid: 'nidMaxLength'
      };

      this.signatoryConfigList.forEach(config => {
        const prop = maxLengthMapping[config.value5];
        if (prop) {
          this[prop] = config.value1;
          console.log(`Set ${prop} to:`, config.value1);
        }
      });

      [
        'name', 'employeeId', 'designation', 'approval',
        'address', 'department', 'phone', 'nid'
      ].forEach(field => this.signatoryForm.get(field)?.updateValueAndValidity());
    }

  }
  buildTotalPagination() {
    setTimeout(() => {
      if (this.paginationService) {
        this.paginationService.updateTotalItems(this.total);
      }
    }, 100);
  }
  onError(service: Service, req: any, res: any) {
    // this.isCollapsed = true;
    this.btnClick = false;
    this.loading = false;

    console.log('error');
    ;
  }

  tooltip = 'CLOSE';
  @ViewChild('pop')
  private popModal: ElementRef;

  openPopup() {
    debugger
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal('show');
  }

  closeModal() {
    this.documentFiles.length = 0;
    debugger
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal('hide');
    this.clear();
  }


  @ViewChild('popview')
  private popModalView: ElementRef;
  // openPopupView() {
  //   const modalElement = this.popModalView.nativeElement;
  //   ($(modalElement) as any).modal('show');
  // }
  openPopupView() {
    const modalElement = this.popModalView.nativeElement;
    ($(modalElement) as any).modal({
      backdrop: 'static', 
      keyboard: false     
    });
    ($(modalElement) as any).modal('show');
  }
  closeFileModal() {
    debugger
    const modalElement = this.popModalView.nativeElement;
    ($(modalElement) as any).modal('hide');
    this.clearf();
  }


  height: number;
  width: number;

  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.75;
    this.width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById('sigGridId');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }
  }
  limitInput(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;

    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'SIGNATORY_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }


}
