import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { AppRole } from 'src/app/softcafe/common/AppRole';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { Toast } from 'src/app/softcafe/common/Toast';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent extends Softcafe implements OnInit, Service, AfterViewInit {
  userAdminMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_MAKER];
  userAdminChekerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_CHECKER];
  userAdminViewerRoles = [AppRole.SUPER_ADMIN, AppRole.USER_ADMINISTRATION_VIEWER];

  actionColumnWidth = 15;
  showGrid = false
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  displayStyle = "none"
  clicked = false
  showProgress = false
  isApprovedFlag = false;
  appPermission = AppPermission;

  branchList = [];

  showBranchAddbtn = false

  branchForm = this.fb.group({
    branchId: [null],
    cbsBranchId: [null],
    branchName: ['', Validators.required],
    adCode: [null],
    routingNumber: [null],
    headOffice: [null],
    status: [null]
  });
  branchConfigList: any;
  branchNameMaxLength: any;
  cbsBranchIdMaxLength: any;
  routingNumberMaxLength: any;
  adCodeMaxLength: any;
  btnRef: string;
  isRequestDelete: boolean = false;
  pageSize: number = 20;
  pageNumber: number = 1;
  approveValue: any;
  saveBtn: string = 'Save';


  constructor(
    private cs: CommonService,
    public permissionStore: PermissioinStoreService,
    public fb: FormBuilder) {
    super();

  }

  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    if (this.permissionStore.hasPermission(this.appPermission.SAVE_BRANCH)) {
      this.showBranchAddbtn = true
    }
    this.prepareGrid();
    this.loadbranch()

  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'BRANCH_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }
  ngAfterViewInit(): void {
    this.showGrid = true
  }

  loadbranch() {
    // debugger
    const payload = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    }
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.Branch, 'SELECT', payload);
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.LegalEntity, 'SELECT', payload);
  }

  openPopup(actionNormalize) {

    this.isApprovedFlag = false;

    this.displayStyle = "block"
  }

  closePopup() {
    this.isView = false;
    this.saveBtn = 'Save';
    this.displayStyle = "none";
    this.branchForm.reset();
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);
    this.angularGrid.paginationService.onPaginationChanged.subscribe(page => {
      this.pageNumber = page.pageNumber;
      this.pageSize = page.pageSize;
      this.loadbranch();
    });
  }
  branchName
  public actionNormalize: string = "";
  onSaveBtnClick(btnRef: string) {

    if (this.showProgress) {
      return
    }

    this.btnRef = btnRef;

    /*  if(!this.permissionStore.isBranchMaker()){
       Toast.show("Permission denied");
       return;
     } */
    this.clicked = true

    debugger

    var payload = this.branchForm.value;
    if (payload.branchId == null) {
      this.actionNormalize = "NEW";
    } else {
      this.actionNormalize = "MODIFIED";
    }

    payload.headOffice = payload.headOffice ? 1 : 0
    payload.status = this.actionNormalize
    debugger
    payload.pageNumber = this.pageNumber;
    payload.pageSize = this.pageSize;
    this.cs.sendRequest(this, ActionType.SAVE, ContentType.Branch, 'onSaveBtnClick', payload);
    // this.cs.sendRequest(this, ActionType.SAVE, ContentType.LegalEntity, 'onSaveBtnClick', payload);
    this.showProgress = true
  }


  onApprovedBtnClick(btnRef: string) {
    if (this.showProgress) {
      return
    }
    Swal.fire({
      title: 'Want to Submit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.btnRef = btnRef;
        this.clicked = true

        debugger
        var payload = btnRef ? this.branchForm.value : this.approveValue;
        payload.headOffice = payload.headOffice ? 1 : 0
        payload.status = "APPROVED";
        payload.pageNumber = this.pageNumber;
        payload.pageSize = this.pageSize;
        this.cs.sendRequest(this, ActionType.SAVE, ContentType.Branch, 'onSaveBtnClick', payload);
        // this.cs.sendRequest(this, ActionType.SAVE, ContentType.LegalEntity, 'onSaveBtnClick', payload);
        this.showProgress = true

      }
    });

  }

  onDelete(e, args) {
    debugger
    if (!this.permissionStore.hasPermission(this.appPermission.DELETE_BRANCH)) {
      Toast.show("Permission denied");
      return;
    }
    // if(args.dataContext?.status == 'PEND_DELETE'){
    //   return;
    // }
    var item = this.gridObj.getDataItem(args.row);
    Swal.fire({
      title: 'Want to Submit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        var payload = item;
        if (args.dataContext?.status == 'PEND_DELETE') {
          payload.headOffice = payload.headOffice ? 1 : 0
          payload.status = "APPROVED";
          this.cs.sendRequest(this, ActionType.SAVE, ContentType.Branch, 'onSaveBtnClick', payload);
        } else {
          this.cs.sendRequest(this, ActionType.DELETE, ContentType.Branch, 'onDeleteBtnClick', payload);
        }
        // this.cs.sendRequest(this, ActionType.DELETE, ContentType.LegalEntity, 'onDeleteBtnClick', payload);
      }
    });
  }

  onNameChanged(e, args) {
    // var item = this.gridObj.getDataItem(args.row);
    // var payload = item;
    // this.cs.sendRequest(this, ActionType.SAVE, ContentType.LegalEntity, 'onSaveBtnClick', payload);

  }

  onAddBtnClick() {

    Swal.fire({

    }).then((result) => {

    })

  }

  onEdit(e, args) {
    debugger
    // if(args.dataContext.status !="APPROVED"){
    //   this.isApprovedFlag=true;
    //   this.actionNormalize=args.dataContext.status;
    // }

    // this.branchForm.patchValue(args.dataContext);
    // this.displayStyle = "block"
    this.onView(args, false);
  }
  showApproveBtn = false;
  isView = false;

  onView(args, isView: boolean = true) {
    this.isView = isView;
    this.saveBtn = 'Update';
    debugger
    if (args.dataContext.status != "APPROVED") {
      if (args.dataContext?.status == 'PEND_DELETE') {
        this.isRequestDelete = true;
      } else {
        this.isRequestDelete = false;
      }
      this.isApprovedFlag = true;
      this.actionNormalize = args.dataContext.status;

    }
    else if (args.dataContext.status == 'APPROVED') {
      this.isRequestDelete = false;
      this.showApproveBtn = true
    }
    else {
      this.isRequestDelete = false;
      this.showApproveBtn = false
    }
    // this.isView = true;
    this.branchForm.patchValue(args.dataContext);
    this.displayStyle = "block"
  }

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="view"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.status != 'PEND_DELETE') {
      return '<i title="Delete"  style="font-size:14px; color: red;"  class="fa fa-trash pointer" aria-hidden="true"></i>'
    }
    else if (dataContext?.status == 'PEND_DELETE') {
      return '<i title="Approve delete"  style="font-size:14px; color: red;"  class="fa fa-times pointer" aria-hidden="true"></i>'
    }
    return '';
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.status == 'PEND_DELETE') {
      return '';
    }
    return '<i title="edit"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>'
  };
  approveIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.status == 'APPROVED') {
      return '';
    }
    // else if (dataContext?.status == 'PEND_DELETE') {
    //   return `<button type="button" title="Delete" class="btn-danger pointer">
    //             <i style="font-size:14px;"  class="fa fa-times" aria-hidden="true"></i>
    //           </button>`;
    // }
    else if (['NEW', 'MODIFIED'].includes(dataContext?.status)) {
      return `<button type="button" title="Approve" class="btn-primary pointer">
                <i style="font-size:14px;"  class="fa fa-check-square-o" aria-hidden="true"></i>
              </button>`;
    }
    return '';
  };

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    var columns = [
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
        id: 'view', name: '', field: 'view', formatter: this.viewIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Update User",
        onCellClick: (e, args) => { this.onView(args) },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },
      {
        id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
        onCellClick: (e, args) => {
          if (args.dataContext?.status !== 'PEND_DELETE') {
            this.onEdit(e, args);
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
        id: 'approve', name: '', field: 'approve',
        formatter: this.approveIcon, minWidth: 35, width: this.actionColumnWidth, maxWidth: 50,
        onCellClick: (e, args) => {
          if (['NEW', 'MODIFIED'].includes(args.dataContext?.status)) {
            this.onGridApprovedBtnClick(args);
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
        id: 'branchName', name: 'Name', type: FieldType.text,
        field: 'branchName', sortable: true,
        filterable: isFilterable,
        filter: {
          model: Filters.inputText
        },
        onCellChange: (e, args) => { this.onNameChanged(e, args) },
      },
      {
        id: 'cbsBranchId', name: 'CBS Branch Id', field: 'cbsBranchId', sortable: true, filterable: isFilterable,
        filter: {
          model: Filters.inputText
        },
      },
      {
        id: 'routingNumber', name: 'Routing Number', field: 'routingNumber', sortable: true, filterable: isFilterable,
        filter: {
          model: Filters.inputText
        },
      },
      {
        id: 'adCode', name: 'AD Code', field: 'adCode', sortable: true, filterable: isFilterable,
        filter: {
          model: Filters.inputText
        },
      }, {
        id: 'status', name: 'Status', field: 'status', sortable: true, filterable: isFilterable,
        filter: {
          model: Filters.inputText
        },formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.status),
      }



    ];

    debugger

    if (!this.permissionStore.hasPermission(this.appPermission.DELETE_BRANCH)) {
      columns = columns.filter(x => x.id != 'delete');
    }
    if (!this.permissionStore.hasPermission(this.appPermission.SAVE_BRANCH)) {
      columns = columns.filter(x => x.id != 'edit');
    }

    if (!this.permissionStore.hasPermission(this.appPermission.APPROVE_BRANCH)) {
      // columns = columns.filter(x => x.id != 'view');
      columns = columns.filter(x => x.id != 'approve');
    }

    this.columnDefinitions = columns;

    this.gridOptions = {
      datasetIdPropertyName: "branchId",
      enableAutoResize: true,
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
      enableGridMenu: false,
      forceFitColumns: true, // this one is important        
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      enablePagination: true,
      pagination: {
        pageNumber: this.pageNumber,
        pageSizes: [20, 50, 100, 500],
        pageSize: this.pageSize
      },
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 200

      }, contextMenu: {
        hideCloseButton: false,
        hideCopyCellValueCommand: true,
        commandItems: [

        ]
      },
    };

  }
  onGridApprovedBtnClick(args: any) {
    this.approveValue = args.dataContext;
    this.onApprovedBtnClick('');
  }

  buildTotalItem(total: any) {
    if (this.angularGrid) {
      setTimeout(() => {
        this.angularGrid.paginationService.totalItems = total;
      }, 200);
    }
  }

  onResponse(service: Service, req: any, response: any) {
    debugger
    this.clicked = false;
    this.showProgress = false;
    this.saveBtn = 'Save';
    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response));
      return;
    }
    if (response.header.referance == 'SELECT') {
      this.branchList = response.payload.content;
      console.log('branch list', this.branchList);
      
      this.buildTotalItem(response.payload.total);
    }
    else if (response.header.referance == 'onDeleteBtnClick') {
      this.branchList = response.payload;
      this.loadbranch();
      Toast.show('Successfully delete branch');
    }
    else if (response.header.referance == 'onSaveBtnClick') {
      this.branchList = response.payload.content;
      this.buildTotalItem(response.payload.total);
      this.branchForm.reset();
      this.approveValue = '';
      this.closePopup();
      this.loadbranch();


      Toast.show('Successfully save branch');

    }
    else if (response.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', response);
      console.log('Reference:', response.header.referance);
      debugger;
      this.branchConfigList = response.payload;

      const maxLengthMapping = {
        branchName: 'branchNameMaxLength',
        cbsBranchId: 'cbsBranchIdMaxLength',
        routingNumber: 'routingNumberMaxLength',
        adCode: 'adCodeMaxLength',

      };

      this.branchConfigList.forEach(config => {
        const prop = maxLengthMapping[config.value5];
        if (prop) {
          this[prop] = config.value1;
          console.log(`Set ${prop} to:`, config.value1);
        }
      });

      Object.keys(maxLengthMapping).forEach(field => {
        if (!this[field]) {
          console.warn(`${field} is required.`);

        }
      });
    }

  }

  onError(service: Service, req: any, response: any) {
    //this.userList = data;
    // this.dataset = this.userList;
    //console.log('error');
  }
  hasRole(role) {
    return this.cs.hasAnyRole(role);
  }

}
