import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, MenuCommandItem, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { BranchService } from 'src/app/service/branch.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends Softcafe implements OnInit, Service, AfterViewInit, OnDestroy, AfterContentChecked, OnChanges {
  


  @Input()
  isSameComp: boolean = true;
  isShowPenduser: boolean = false;

  @Input()
  userPaylodList: any;

  userList: Array<any> = [];

  actionColumnWidth = 10;
  showGrid = false;
  public paginationService: PaginationService;

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  requestFrom: string;
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

  @ViewChild("btnUserDelete", { read: ElementRef }) btnUserDelete: ElementRef;

  columns: Array<any>;
  manageRoleBtnDisabled: boolean;
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number;
  // institutionList: any[] = [];
  @Input('institutionList')
  public institutionList: any = [];

  @Input('allowInstitutionSearch')
  public allowInstitutionSearch: boolean = true;
  institutionName: any;
  institutionId: any = null;
  isShow: any;
  loginName: String;
  fullName: String;
  email: String = null;
  branchList: any;

  // paginationService: any;
  ;
  updateUserBtnDisabled: boolean;
  public appPermission = AppPermission


  selectedUserList: Array<any>;
  selectedUser: any;
  contextMenuUser: any;
  loading: boolean = true;



  constructor(private router: Router,
    private cs: CommonService,
    private userService: UserService,
    private branchService: BranchService,
    public permissioinStoreService: PermissioinStoreService,
    private cdf: ChangeDetectorRef,
    private route: ActivatedRoute,

  ) {
    super();
    this.prepareGrid();
    debugger
    this.requestFrom = route.snapshot.url[0]['path'];
    this.isShowPenduser = this.requestFrom == 'user-pend-list';
  }

  ngOnInit() {
    this.userService.isView = false;
    this.manageRoleBtnDisabled = true;
    this.updateUserBtnDisabled = true;
    this.gridOptions = this.buildGridOptions()
    this.loadInstitution();
    this.getWindowSize();
    // if (this.institutionList.length <= 0 && this.allowInstitutionSearch) {
    //   this.loadValue();
    // }
    // if(!this.isSameComp){
    //   this.add2Grid(this.userPaylodList);
    // }
    this.loadbranch();
  }

  loadbranch() {
    var payload1 = {};
    if (this.branchList?.length) {
      return;
    }
    this.cs.sendRequestPublic(this, ActionType.SELECT_ALL, ContentType.Branch, "BRUNCH_LIST_DROP_DOWN", payload1);

  }

  ngOnDestroy(): void {
    this.angularGrid.destroy;
  }
  ngOnChanges(changes: SimpleChanges): void {
    debugger
    if (changes.userPaylodList) {
      this.add2Grid(changes.userPaylodList.currentValue);
    }
  }

  // loadValue() {

  //   const value = forkJoin([this.loadInstitution()])
  //     .subscribe((res: any) => {
  //       this.institutionList = res[0]?.payload;
  //       debugger
  //       if (this.permissioinStoreService.hasPermission(this.appPermission.HR_ROLE) && !this.cs.forceAllow()) {
  //         this.institutionList = this.institutionList.filter(m => m.institutionName.toUpperCase().includes('PRIME BANK'));
  //       }
  //       console.log('institution list: ', this.institutionList);

  //     });
  // }


  loadInstitution(pagination?: ServicePagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    this.loading = true;
    // this.showProgress=true;
    const payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
    };
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.Institution, 'SELECT_ALL', payload);
  }

  loadUser(pagination?: ServicePagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    if (this.fullName && this.fullName.length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Full Name must be at least 3 characters long.',
        confirmButtonText: 'OK',
      });
      return;
    }
    var payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
      loginName: this.loginName,
      fullName: this.fullName,
      email: this.email,
      institutionId: this.institutionId,

      userType: this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER)
        && this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? '' :
        this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER) ? 'EXTERNAL_USER' :
          this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? 'INTERNAL_USER' : '',
    };
    this.showProgress = true;
    this.loading = true;
    debugger

    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.User, 'select', payload);
  }

  loadPendUser(pagination?: ServicePagination) {
    this.pageNumber = pagination?.pageNumber ?? this.pageNumber;
    this.pageSize = pagination?.pageSize ?? this.pageSize;
    if (this.fullName && this.fullName.length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Full Name must be at least 3 characters long.',
        confirmButtonText: 'OK',
      });
      return;
    }
    var payload = {
      pageNumber: this.pageNumber != 0 ? this.pageNumber : 1,
      pageSize: this.pageSize,
      loginName: this.loginName,
      fullName: this.fullName,
      email: this.email,
      institutionId: this.institutionId,

      userType: this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER)
        && this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? '' :
        this.permissioinStoreService.hasPermission(this.appPermission.EXTERNAL_SAVE_USER) ? 'EXTERNAL_USER' :
          this.permissioinStoreService.hasPermission(this.appPermission.INTERNAL_SAVE_USER) ? 'INTERNAL_USER' : '',
    };
    this.showProgress = true;
    this.loading = true;
    debugger
    this.cs.sendRequestAdmin(this, ActionType.SELECT_PEND_USER, ContentType.User, 'select', payload);
  }
  search() {

    this.institutionName = this.institutionList?.find(f => f.institutionId == this.institutionId)?.institutionName;
    const payload = {
      showProgress: true,

      institutionName: this.institutionName,
    };


    // setTimeout(() => {
    //   this.showProgress = false;
    // }, 1500); 
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showGrid = true;
   
    },0)
  
    this.cdf.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdf.detectChanges();
  }

  onContextMenuAction(event, actionItem) {

  }
  onNewUser() {
    this.router.navigate(['/user/profile']);
  }

  onItemDblClick(item) {
    this.router.navigate(['/user/profile']);
    this.userService.changeCurrentUser(item);
  }

  onEditUser(e, args) {
    var item = this.gridObj.getDataItem(args.row);
    this.userService.changeCurrentUser(item);
    this.router.navigate(['/user/profile']);
  }


  // toggleActivation(e, arge) {

  //   console.log(arge.dataContext.allowLogin);
  //   var payload = arge.dataContext;
  //   payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
  //   debugger
  //   this.loading = true;

  //   this.cs.sendRequestAdmin(this, ActionType.TOGGLE_ACTIVATION, ContentType.User, 'activeToggleUser', payload);

  // }
  changeUserPassword(e, arge) {

    console.log(arge.dataContext.allowLogin);
    var payload = arge.dataContext;
    payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
    debugger
    this.loading = true;

    this.cs.sendRequestAdmin(this, ActionType.RESET_PASSWORD, ContentType.User, 'RESET_PASSWORD', payload);

  }

  selectUserWithButton(data) {
    this.selectedUser = data;
  }

  manageRole(e, args) {
    var item = this.gridObj.getDataItem(args.row);
    this.manageUserRole(item);
  }

  manageUserRole(user) {
    this.userService.changeCurrentUser(user);
    this.router.navigate(['/admin/manage-role']);
  }

  approveUser(e: any, args: any) {
    debugger
    console.log('selected user information :', args.dataContext);

    Swal.fire({
      // title: "Are you want to approve?",
      title: "Want to Submit?",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let payload = JSON.parse(JSON.stringify(args.dataContext));
        payload.allowLogin = args.dataContext.allowLogin == 'No' ? 0 : 1;
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.loading = true;

        this.cs.sendRequest(this, ActionType.APPROVE, ContentType.User, 'select_app', payload);
      } else {
        Swal.fire({
          title: "Changes are not approved",
          icon: 'info',
          timer: 5000,
        });
      }
    });


  }
  submitUser(e: any, args: any) {
    debugger
    console.log('selected user information :', args.dataContext);

    Swal.fire({
      // title: "Are you want to submit?",
      title: "Want to Submit?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let payload = JSON.parse(JSON.stringify(args.dataContext));
        payload.allowLogin = args.dataContext.allowLogin == 'No' ? 0 : 1;
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.loading = true;

        this.cs.sendRequest(this, ActionType.SUBMIT, ContentType.User, 'select_app', payload);
      } else {
        Swal.fire({
          title: "Changes are not submit",
          icon: 'info',
          timer: 5000,
        });
      }
    });


  }

  onDelete(e, args) {
    debugger
    var payload = this.gridObj.getDataItem(args.row);

    Swal.fire({
      title: 'Want to Submit?',
      // title: 'Are you sure want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        payload.userId = payload.userId
        payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
        this.loading = true;

        this.cs.sendRequestAdmin(this, ActionType.DELETE, ContentType.User, 'onDeleteBtnClick', payload);
      }
    });
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);
    this.paginationService = angularGrid.paginationService;

    this.paginationService.onPaginationChanged.subscribe((pagination: ServicePagination) => {
      this.handlePaginationChange(pagination);
    });
    // this.dataViewObj.onPaginationChanged?.subscribe((e, dataView, grid)=>{
    //   // this.handlePaginationChange()
    //   debugger
    // })

  }
  handlePaginationChange(pagination: ServicePagination): void {

    console.log('pagination chenched', pagination);
    if (!this.isShowPenduser) {
      this.loadUser(pagination);
    } else {
      this.loadPendUser(pagination);
    }
    this.gridObj.invalidate();
    this.gridObj.render();

  }

  loadUserList() {
    if (!this.isShowPenduser) {
      this.loadUser();
    } else {
      this.loadPendUser();
    }
  }


  updateItem(upItem) {
    upItem.allowLogin = upItem.allowLogin == 1 ? 'Yes' : 'No';
    upItem.branchName = this.branchList?.find(s => s.branchId == upItem.branchId)?.branchName || upItem.extBranchName;
    upItem.institutionName = this.institutionList?.find(i => i.institutionId == upItem.institutionId)?.institutionName;
    this.angularGrid.gridService.updateItem(upItem);
  }

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="view"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="delete"  style="font-size:14px;"  class="fa fa-trash pointer" aria-hidden="true"></i>'
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if(!(dataContext.userStatus as string)?.includes('PEND_')){
      return '<i title="edit"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>'
    }
    return '';
  };
  roleManage: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="role manage"  style="font-size:14px;"  class="fa fa-cogs pointer" aria-hidden="true"></i>'
  };
  approveBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasAnyPermission([AppPermission.USER_APPROVER])) {
      return '<button type="button" title="Approve" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else {
      return;
    }
  };
  branchFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    debugger
    return dataContext?.branchId ? this.branchList?.find(s => s.branchId == dataContext.branchId)?.branchName : dataContext?.extBranchName;
    // if(typeof value === 'string'){
    //   return value;
    // }else{
    //   return this.branchList?.some(s => s.branchId == value);
    // }
  };
  approveUserBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    let title = this.checkStatus(dataContext.userStatus, dataContext.allowLogin);
    if (this.checkUserActionVisibility(dataContext) && title === 'Approve Inactive User') {
      return '<button type="button" title="Approve Inactive User" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else if (this.checkUserActionVisibility(dataContext) && title === 'Inactive User') {
      return '<button type="button" title="Inactive User" class="btn-warning pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else if (this.checkUserActionVisibility(dataContext) && title === 'Approve Active User') {
      return '<button type="button" title="Approve Active User" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';

    }
    else if (this.checkUserActionVisibility(dataContext) && title === 'Active User') {
      return '<button type="button" title="Active User" class="btn-info pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    // if (dataContext.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasAnyPermission([AppPermission.USER_APPROVER])) {
    //   return '<button type="button" title="Approve" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    // }
    else {
      return;
    }
  };
  rejectUserBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    if (['PEND_ACTIVE', 'PEND_APPROVE', 'PEND_INACTIVE', 'PEND_CLOSE'].includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)) {
      return '<button type="button" title="Reject" class="btn-warning pointer"><i class="fa fa-trash" aria-hidden="true"></i></button>';
    }
    else {
      return '';
    }
  };
  closeUserBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // if (!['PEND_ACTIVE', 'PEND_APPROVE', 'PEND_INACTIVE', 'PEND_DELETE'].includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(this.appPermission.USER_MAKER)) {
    if (['ACTIVE', 'INACTIVE'].includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(this.appPermission.USER_MAKER) ) {
      return '<button type="button" title="Close User" class="btn-warning pointer"><i class="fa fa-window-close" aria-hidden="true"></i></button>';
    }
    else if (dataContext.userStatus == 'PEND_CLOSE' && this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)) {
      return '<button type="button" title="Approve Close User" class="btn-success pointer"><i class="fa fa-window-close" aria-hidden="true"></i></button>';
    }
    else {
      return ;
    }
  };
  makerBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.makerAction.includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(AppPermission.USER_MAKER)) {
      return '<button type="button" class="btn-primary pointer"><i title="Submit" class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    }
    else {
      return;
    }
  };

  makerAction: string[] = ['NEW', 'MODIFIED',]
  isFilterable = environment.enableFiltering;
  colDef = [
    {
      id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon,
      minWidth: 20, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Delete User",
      onCellClick: (e, args) => { this.onDelete(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 20, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { 
        if(!(args.dataContext.userStatus as string)?.includes('PEND_')){
          this.onEditUser(e, args);
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
      id: 'view', name: '', field: 'view', formatter: this.viewIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { this.onViewUser(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    // {
    //   id: 'role', name: '', field: 'role', formatter: this.roleManage,
    //   minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
    //   toolTip: "Manage Role",
    //   cssClass: "manage-role-icon",
    //   onCellClick: (e, args) => { this.manageRole(e, args) },
    //   excludeFromColumnPicker: true,
    //   excludeFromGridMenu: true,
    //   excludeFromHeaderMenu: true,
    //   excludeFromExport: true,
    //   resizable: false,
    //   focusable: false,
    //   selectable: false
    // },
    {
      id: 'submit', name: '', field: 'submit', formatter: this.makerBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      toolTip: "Submit User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        if (this.makerAction.includes(args.dataContext?.userStatus)) {
          this.submitUser(e, args);
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
      id: 'approve', name: '', field: 'approve', formatter: this.approveBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      toolTip: "Approve User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        if (args.dataContext?.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)) {
          this.approveUser(e, args);
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
      id: 'approveUser', name: '', field: 'approveUser', formatter: this.approveUserBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      // toolTip: "Approve User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        // if (args.dataContext?.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)) {
        //   this.approveUser(e, args);
        // }
        if (this.checkUserActionVisibility(args.dataContext)) {
          this.toggleActivation(e, args);
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
      id: 'rejectUser', name: '', field: 'rejectUser', formatter: this.rejectUserBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      onCellClick: (e, args) => {
        if (['PEND_ACTIVE', 'PEND_APPROVE', 'PEND_INACTIVE', 'PEND_CLOSE'].includes(args.dataContext.userStatus)) {
          this.rejectUser(e, args);
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
      id: 'closeUser', name: '', field: 'closeUser', 
      formatter: this.closeUserBtn,
      minWidth: 20, width: this.actionColumnWidth + 25, maxWidth: 50,
      onCellClick: (e, args) => {
        if ((['ACTIVE', 'INACTIVE'].includes(args.dataContext.userStatus) && this.permissioinStoreService.hasPermission(this.appPermission.USER_MAKER))
          || ('PEND_CLOSE' == args.dataContext.userStatus && this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER))) {
          this.closeUser(e, args);
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
      id: 'remarks', name: 'Remarks', field: 'remarks',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
      minWidth: 250,
    },
  ];

  prepareGrid() {

    if (this.cs.forceAllow()) {
      this.columnDefinitions = this.colDef;
    }
    else {
      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.DELETE_USER)) {
        this.colDef = this.colDef.filter(x => x.id != 'delete');
      }

      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_MAKER)) {
        this.colDef = this.colDef.filter(x => x.id != 'edit');
        this.colDef = this.colDef.filter(x => x.id != 'submit');
        // this.colDef = this.colDef.filter(x => x.id != 'rejectUser');
      }

      if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_APPROVER)) {
        this.colDef = this.colDef.filter(x => x.id != 'view');
        this.colDef = this.colDef.filter(x => x.id != 'rejectUser');
      }
      
      if(!this.permissioinStoreService.hasAnyPermission([this.appPermission.USER_MAKER, this.appPermission.USER_APPROVER])){
        this.colDef = this.colDef.filter(x => x.id != 'closeUser');
      }
    }

    this.columnDefinitions = this.colDef;

    this.dataset = this.userList;
  }
  onViewUser(e, args) {
    var item = this.gridObj.getDataItem(args.row);
    this.userService.changeCurrentUser(item);
    this.userService.isView = true;
    this.router.navigate(['/user/profile']);
  }

  // checkActiveRole(data) {
  //   return this.permissioinStoreService.hasAnyPermission([this.appPermission.USER_MAKER, this.appPermission.USER_APPROVER])
  //     && (this.cs.forceAllow() || data.userModId != this.cs.getUserId());
  // }
  checkActiveRole(data) {
    return this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)
      && (this.cs.forceAllow() || data.creatorId || data.userModId != this.cs.getUserId());
  }

  checkUserActionVisibility(data) {
    return this.checkActiveRole(data) && (data?.userStatus === 'ACTIVE' || data?.userStatus === 'PEND_ACTIVE' || data?.userStatus === 'INACTIVE' || data?.userStatus === 'PEND_INACTIVE');
  }
  checkPasswordAdminRole(data) {
    return this.permissioinStoreService.hasPermission(this.appPermission.PASSWORD_ADMIN)
      && (this.cs.forceAllow() || data.creatorId != this.cs.getUserId());
  }
  checkPasswordAdminVisibility(data) {
    return this.checkPasswordAdminRole(data) && data.userType === 'External User';
  }

  buildGridOptions() {
    var menuOrder = 60;
    var pageSizes = [50, 100, 200, 500, 5000];
    var pageSize = this.pageSize;
    if (this.requestFrom === 'role') {
      debugger
      pageSizes = [100];
      pageSize = 100;
    }
    var option: GridOption = {
      datasetIdPropertyName: "userId",
      enableAutoResize: false,
      explicitInitialization: true,
      enableFiltering: true,
      enableSorting: true,
      enablePagination: true,
      enableExcelExport: true,
      pagination: {
        pageNumber: this.pageNumber,
        pageSizes: pageSizes,
        pageSize: pageSize,
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
      contextMenu: {
        hideCloseButton: false,
        hideCopyCellValueCommand: true,
        commandItems: [
          {
            command: 'Active_Status',
            iconCssClass: 'fa fa-user',
            title: 'Active/Inactive user',
            positionOrder: menuOrder++,
            action: (e, args) => { this.toggleActivation(e, args) },
            disabled: false,
            itemUsabilityOverride: (args) => {
              debugger

              console.log(args);
              args.grid.getOptions().contextMenu.commandItems.forEach(element => {
                if (element.command == 'Active_Status') {
                  element.title = this.checkStatus(args.dataContext.userStatus, args.dataContext.allowLogin);

                  // (args.dataContext.userStatus == 'ACTIVE' && args.dataContext.allowLogin == 'No') ? "Inactive User" : (args.dataContext.userStatus == 'PEND_INACTIVE' && args.dataContext.allowLogin == 'No')
                  //   ? "Approve Inactive User" : (args.dataContext.userStatus == 'INACTIVE' && args.dataContext.allowLogin == 'No') ? "Active User" : (args.dataContext.userStatus == 'PEND_ACTIVE' && args.dataContext.allowLogin == 'No') ?
                  //     "Approve Active User" : "";
                  // element.title = args.dataContext.userStatus == 'APPROVED' ? "Inactive User" : "Active User"

                }
              });
              return this.checkActiveRole(args.dataContext);
              // return true;
            },
            itemVisibilityOverride: (args) => {

              return this.checkUserActionVisibility(args.dataContext);
            }
          },
          {
            command: 'Password_Admin',
            iconCssClass: 'fa fa-key',
            title: 'Change Password',
            positionOrder: menuOrder++,
            action: (e, args) => { this.changeUserPassword(e, args) },
            disabled: false,
            itemUsabilityOverride: (args) => {
              debugger
              console.log(args);
              args.grid.getOptions().contextMenu.commandItems.forEach(element => {
                if (element.command == 'Password_Admin') {
                  element.title = args.dataContext.userType == 'External User' ? "Change Password" : " "
                }
              });
              return this.checkPasswordAdminRole(args.dataContext);
              // return true;
            },
            itemVisibilityOverride: (args) => this.checkPasswordAdminVisibility(args.dataContext),
          },
          // {
          //   command: 'Manage_Role',
          //   iconCssClass: 'fa fa-cogs',
          //   title: 'Manage Role',
          //   positionOrder: menuOrder++,
          //   action: (e, args) => { this.manageUserRole(args.dataContext) },
          //   disabled: false
          // },
        ]
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

  toggleActivation(e, arge) {
    console.log(arge.dataContext.allowLogin);
    var payload = arge.dataContext;
    const status = this.checkStatus(arge.dataContext.userStatus, arge.dataContext.allowLogin);
    payload.userStatus = status == 'Approve Inactive User'
      ? 'INACTIVE' : status == 'Inactive User'
        ? 'PEND_INACTIVE' : status == 'Approve Active User'
          ? 'ACTIVE' : 'PEND_ACTIVE';
    // payload.userStatus === 'ACTIVE'
    //   ? 'PEND_INACTIVE' : payload.userStatus === 'PEND_INACTIVE'
    //     ? 'INACTIVE' : payload.userStatus === 'INACTIVE' ? 'PEND_ACTIVE'
    //       : payload.userStatus === 'PEND_ACTIVE' ? 'ACTIVE' : payload.userStatus;
    payload.allowLogin = payload.allowLogin == 'No' ? 0 : 1;
    debugger
    Swal.fire({
      icon: 'question',
      // title: `Are you want to ${status}?`,
      title: `Want to Submit?`,
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: 'No',
    }).then((r) => {
      if (r.isConfirmed) {
        this.loading = true;
        this.cs.sendRequestAdmin(this, ActionType.USER_ACTIVATION, ContentType.User, 'activeToggleUser', payload);
      }
    })

  }

  rejectUser(e: any, args: any) {
    if(!this.permissioinStoreService.hasPermission(this.appPermission.USER_APPROVER)){
      return;
    }
    let payload: any = {
      userId: args.dataContext.userId,
    };
    Swal.fire({
      title: 'Reject User',
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
        else if (value.length > 255) {
          return 'Cause must not exceed 256 characters!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicked 'Submit'
        const userInput = result.value;

        payload.userStatus = 'REJECTED';
        payload.rejectCause = userInput;
        this.cs.sendRequest(this, ActionType.USER_REGECT, ContentType.User, 'activeToggleUser', payload);
      }
    });
  }

  closeUser(e: any, args: any) {
    if (!this.permissioinStoreService.hasAnyPermission([this.appPermission.USER_MAKER, this.appPermission.USER_APPROVER])) {
      return;
    }
    let payload: any = {
      userId: args.dataContext.userId,
    };
    Swal.fire({
      icon: 'info',
      title: 'Close User',
      text: 'Are you want to close this user?',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {

        payload.userStatus = this.permissioinStoreService.hasPermission(this.appPermission.USER_MAKER) && args.dataContext.userStatus != 'PEND_CLOSE' ? 'PEND_CLOSE' : 'CLOSED';

        this.cs.sendRequest(this, ActionType.USER_CLOSE, ContentType.User, 'activeToggleUser', payload);
      }
    });
  }
  checkStatus(userStatus: string, allowLogin: string): string {
    let status = '';
    if (allowLogin == 'Yes') {
      if (userStatus == 'PEND_INACTIVE') {
        status = 'Approve Inactive User';
      }
      else {
        status = 'Inactive User'
      }
    } else if (allowLogin == 'No') {
      if (userStatus == 'PEND_ACTIVE') {
        status = 'Approve Active User';
      }
      else {
        status = 'Active User'
      }
    }
    return status;
    // return (userStatus == 'ACTIVE' && allowLogin == 'Yes') ? "Inactive User"
    //   : (userStatus == 'PEND_INACTIVE' && allowLogin == 'Yes')
    //     ? "Approve Inactive User" : (userStatus == 'INACTIVE' && allowLogin == 'No')
    //       ? "Active User" : (userStatus == 'PEND_ACTIVE' && allowLogin == 'No')
    //         ? "Approve Active User" : "";
  }


  // allowManageUserRole(){
  //   if (this.cs.forceAllow()) {
  //     return true;
  //   }
  //   if (this.cs.hasAnyRole(this.userService.userAdminMakerRoles)) {
  //     return true;
  //   }

  //   return false;
  // }

  handleRefresh() {
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

  buildUserDataset() {
    this.userList.forEach(e => {
      e.allowLogin = e.allowLogin == 1 ? 'Yes' : 'No';
    });
    this.dataset = this.userList;
    console.log('user list ', this.dataset);

    setTimeout(() => {
      if (this.paginationService) {
        this.paginationService.updateTotalItems(this.total);
      }
    }, 100);

    this.cdf.detectChanges();
  }

  add2Grid(payload) {
    this.userList = payload.content;
    this.total = payload.total;
    console.log('Total records:', this.total);
    if (this.gridObj) {
      const options = this.gridObj.getOptions();
      options.pagination.pageSizes = [50, 100, 200, 300, 500, this.total];
      this.gridObj.setOptions(options);
    }

    // this.paginationService.totalItems = this.total;
    // this.paginationService.updateTotalItems(this.total);
    // (this.paginationService as any)._totalItems = 100;

    // if(this.branchService.branchList.length == 0){
    //   this.cs.post(this, ActionType.BRUNCH_LIST, ContentType.DataConfig, "BRUNCH_LIST_DROP_DOWN", {})
    //   .then((res: any) => {

    //     //var data = JSON.parse(res);

    //     this.branchService.branchList = res.payload;
    //     this.userList.forEach(i => {
    //       i.branchName = this.branchService.getBranchName(i.branchId);
    //       i.allowLogin = i.allowLogin == 1 ? 'Yes' : 'No';
    //     });
    //     this.dataset = this.userList;
    //   });
    // }
    // else{
    //   this.userList.forEach(i => {
    //     i.branchName = this.branchService.getBranchName(i.branchId);
    //     i.allowLogin = i.allowLogin == 1 ? 'Yes' : 'No';
    //   });
    //   this.dataset = this.userList;
    // }

    //for testing because branch is not here;;;;;;
    this.buildUserDataset();
    // this.userList.forEach(e => {
    //   e.allowLogin = e.allowLogin == 1 ? 'Yes' : 'No';
    // });
    // this.dataset = this.userList;

    // console.log('user list ', this.dataset);
    this.cdf.detectChanges();
  }

  dropdownSettings = {
    allowSearchFilter: true,
    singleSelection: true,
    idField: 'institutionId',
    textField: 'institutionName',
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search Institution',
    noDataAvailablePlaceholderText: 'No data found'
  };

  deselect(event: any) {
    this.institutionId = null;
  }

  selectedInstitution = [];

  onInstitutionSelect(item: any) {
    this.institutionId = item.institutionId;
  }
 
  onResponse(service: Service, req: any, response: any) {
    this.loading = false;
    // this.showProgress = false;

    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response));
      return;
    }
    debugger
    if (response.header.referance == 'select') {
      // if (response.payload.content.length > 0) {
      let payload = response.payload;
      this.add2Grid(payload);
      this.showProgress = false;


      // }
    }
    else if (response.header.referance == 'BRUNCH_LIST_DROP_DOWN') {

      this.branchList = response.payload;
      console.log('branch list', this.branchList);
    }
    else if (response.header.referance == 'select_app') {
      // this.userList = response.payload;
      // this.dataset = this.userList;

      this.userList = response.payload.content;
      this.total = response.payload.total;

      Swal.fire({ title: "User successfully approved.", toast: true, timer: 5000 }).then(r =>
        this.buildUserDataset());
    }
    else if (response.header.referance == 'RESET_PASSWORD') {
      // this.userList = response.payload;
      // this.dataset = this.userList;
      if (response.payload) {

        Swal.fire({ title: `Default password send successfull to ${response.payload.email}.`, toast: true, timer: 5000 });
      }


      // this.buildUserDataset());
    }
    else if (response.header.referance == 'onDeleteBtnClick') {
      this.userList = response.payload;
      this.dataset = this.userList;
      // this.loadUser();
      if (!this.isShowPenduser) {
        this.loadUser();
      } else {
        this.loadPendUser();
      }
      Swal.fire({ title: "Successfully delete user.", toast: true, timer: 5000 });
    }
    else if (response.header.referance == 'activeToggleUser') {
      debugger
      var user = response.payload;
      this.updateItem(user);
      // Swal.fire({ title: "User active status changed.", toast: true, timer: 5000 });
      Swal.fire({ title: `User active status changed: ${blockToCamel(user.userStatus)}`,  timer: 5000 });
    }
    else if (response.header.referance == 'SELECT_ALL') {
      debugger
      this.institutionList = response.payload;
      if (this.isSameComp && !this.isShowPenduser) {
        this.loadUser();
      } else if (this.isShowPenduser) {
        this.loadPendUser();
      }
    }
   

  }

  onError(service: Service, req: any, response: any) {
    this.loading = false;
    this.showProgress = false;

    console.log('error');
  }

  @Input()
  height: number;

  width: number;

  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    debugger
    if (!this.height) {
      this.height = window.innerHeight * 0.7;
    }
    this.width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById('userGridId');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid?.slickGrid?.resizeCanvas();
    }
  }

}
