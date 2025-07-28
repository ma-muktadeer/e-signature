import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularGridInstance, Column, FieldType, Filters, Formatters, GridOption, MenuCommandItem } from 'angular-slickgrid';
import { BranchService } from 'src/app/service/branch.service';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { UserService } from '../../admin/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-excp-handel',
  templateUrl: './excp-handel.component.html',
  styleUrls: ['./excp-handel.component.scss']
})
export class ExcpHandelComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  actionColumnWidth = 10;


  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;

  @ViewChild("btnUserDelete", { read: ElementRef }) btnUserDelete: ElementRef;

  columns: Array<any>;
  manageRoleBtnDisabled: boolean;;
  updateUserBtnDisabled: boolean;

  businessExceptionList: Array<any> = [];

  selectedUserList: Array<any>;
  selectedUser: any;
  contextMenuUser: any;
 public saveOrUpdate:string="";
  

  customerEmailConfigForm = this.fb.group({ 
    custMailId:[null],
    custMailVer:[null],
    active:[null],
    modifyBy:[null],
    createBy:[null],
    modifyDate:[null],
    custName:[null],
    custIdentifier:[null],
    email:[null],
    branchMail:[null],
    branchBic:[null],
    custInfo:[null],
    branchId:[null]

  })

  public custIdentifier=[
    {name:"CUSTOMER" ,value:"CUSTOMER"},
    {name:"BENIFICIERY", value:"BENIFICIERY"}
  ]

  public statusList=[
    {name:"Active" ,value:1},
    {name:"Inactive", value:0}
  ]

  constructor(private router: Router,
    private cs: CommonService,
    private userService: UserService,
    public branchService: BranchService,
    private fb:FormBuilder
  ) {
    super();
    this.prepareGrid();

  }

  ngOnInit() {
    this.manageRoleBtnDisabled = true;
    this.updateUserBtnDisabled = true;
    this.saveOrUpdate="Save";
    var payload = {};
    this.gridOptions = this.buildGridOptions()
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.BusinessException, 'select', payload);
  }

  showGrid = false
  ngAfterViewInit(): void {
      this.showGrid = true;
  }

  onContextMenuAction(event, actionItem) {

  }

  onItemDblClick(item) {
    this.router.navigate(['/user/profile']);
    this.userService.changeCurrentUser(item);
  }

  onEditCustomer(e, args) {
    debugger

    this.displayStyle = "block";
    var item = this.gridObj.getDataItem(args.row);

    var assignValue={
      custMailId:item.custMailId,
      branchId:item.branchId,
      custIdentifier:item.custIdentifier,
      custName:item.custName,
      email:item.email,
      branchMail:item.branchMail,
      active:item.active
    }
   this.customerEmailConfigForm.patchValue(assignValue);


  }

  toggleActivation(e, arge) {
    var payload = arge.dataContext;
    payload.allowLogin = payload.allowLogin == 0 ? 1 : 0;
    this.cs.sendRequest(this, ActionType.TOGGLE_ACTIVATION, ContentType.User, 'activeToggleUser', payload);

  }

  selectUserWithButton(data) {
    this.selectedUser = data;
  }

 /*  manageRole(e, args) {
    var item = this.gridObj.getDataItem(args.row);
    this.manageUserRole(item);
  }

  manageUserRole(user) {
    this.userService.changeCurrentUser(user);
    this.router.navigate(['/admin/manage-role']);
  } */

  onDelete(e, args) {
    var item = this.gridObj.getDataItem(args.row);
    Swal.fire({
      text: `Want to Submit?`,
      // title: 'Are you sure want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var payload = item;
        this.cs.sendRequest(this, ActionType.DELETE, ContentType.User, 'onDeleteBtnClick', payload);
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


  }
  updateItem(upItem) {
    this.angularGrid.gridService.updateItem(upItem);
  }

  onResponse(service: Service, req: any, response: any) {
    if (response.header.referance == 'select') {
      this.businessExceptionList = response.payload;
      this.dataset = this.businessExceptionList;
     
    }
    
    else if (response.header.referance == 'onDeleteBtnClick') {
      this.businessExceptionList = response.payload;
      this.dataset = this.businessExceptionList;
      Swal.fire({ title: "Successfully delete user.", toast: true, timer: 5000 });
    }
    else if (response.header.referance == 'activeToggleUser') {
      var user = response.payload;
      this.updateItem(user);
      Swal.fire({ title: "User active status changed.", toast: true, timer: 5000 });
    }else if (response.header.referance == 'NEW') {
      this.dataset=response.payload;
      this.closePopup();
     
    }


    

  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
     /* {
        id: 'delete', name: '', field: 'delete', formatter: Formatters.deleteIcon,
        minWidth: 30, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Delete User",
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
        id: 'edit', name: '', field: 'edit', formatter: Formatters.editIcon, minWidth: 20, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Update User",
        onCellClick: (e, args) => { this.onEditCustomer(e, args) },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },*/
      {
        id: 'exType', name: 'Type', field: 'exType',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'exGroup', name: 'Group', field: 'exGroup',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'f50', name: 'f50', field: 'f50',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'f59', name: 'f59', field: 'f59',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'extra', name: 'Extra', field: 'extra',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
      }
    ];

    this.dataset = this.businessExceptionList;
  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "businessExcpId",
      enableFiltering: true,
      enableSorting: true,
      enablePagination: true,
      enableExcelExport: true,
      pagination: {
        pageNumber: 1,
        pageSizes: [20, 50, 80, 150],
        pageSize: 20
      },
      enableColumnReorder: true,
      enableHeaderButton: true,
      enableEmptyDataWarningMessage: true,
      enableCellMenu: true,
      enableCellNavigation: true,
      forceFitColumns: true, // this one is important        
      enableContextMenu: true,
      enableGridMenu: true,
      enableRowSelection: true,
      enableTextSelectionOnCells: true,
      enableAutoTooltip: true,
      enableAutoSizeColumns: true,
      showCustomFooter: true,
      createFooterRow: true,
      customFooterOptions: {
        leftFooterText: "trye it"
      },
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 200
      },
      /* contextMenu: {
        hideCloseButton: false,
        commandItems: [
          {
            command: 'Active_Status',
            iconCssClass: 'fa fa-user',
            title: 'Active/Inactive user',
            positionOrder: menuOrder++,
            action: (e, args) => { this.toggleActivation(e, args) },
            disabled: false,
            itemUsabilityOverride: (args) => {
              console.log(args);
              args.grid.getOptions().contextMenu.commandItems.forEach(element => {
                if (element.command == 'Active_Status') {
                  element.title = args.dataContext.allowLogin == 1 ? "Inactive User" : "Active User"
                }
              });
              return true;
            },
          },
        ]
      }, */
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

  onSearch(){

  }


  displayStyle = "none";
  
  openPopup() {
    debugger
    this.displayStyle = "block";
  }


  closePopup() {
    this.displayStyle = "none";
    var payload={
    custMailId:null,
    custMailVer:null,
    active:null,
    modifyBy:null,
    createBy:null,
    modifyDate:null,
    custName:null,
    custIdentifier:null,
    email:null,
    branchMail:null,
    branchBic:null,
    custInfo:null,
    branchId:null

    }

    this.customerEmailConfigForm.patchValue(payload);
  }


  onUpdateOrAddCustomerSetup(){

    var payload=this.customerEmailConfigForm.value;
    
    if(payload.branchId==null || payload.branchId==undefined){
      Swal.fire({ title: "Branch Is Required.", toast: true, timer: 5000 });
      return;
    }

    this.cs.sendRequest(this,ActionType.NEW,ContentType.CustomerMailConfig,"NEW",payload);


  }

}
