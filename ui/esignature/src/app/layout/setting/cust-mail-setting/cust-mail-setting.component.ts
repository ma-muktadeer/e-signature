import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, Formatters, GridOption, MenuCommandItem } from 'angular-slickgrid';
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
  selector: 'app-cust-mail-setting',
  templateUrl: './cust-mail-setting.component.html',
  styleUrls: ['./cust-mail-setting.component.scss']
})
export class CustMailSettingComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  actionColumnWidth = 10;

  public multiBankName;

  multiBankNameList = [];
  public customerDetailsId = 0;

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

  customerConfigList: Array<any> = [];

  selectedUserList: Array<any>;
  selectedUser: any;
  contextMenuUser: any;
  public saveOrUpdate: string = "";
  public addOrUpdateNameVariante: string = "Add Name Variant";
  public saveOrUpdateFlag: string = "Save";


  customerEmailConfigForm = this.fb.group({
    custMailId: [null],
    custMailVer: [null],
    active: 1,
    modifyBy: [null],
    createBy: this.cs.getUserId(),
    modifyDate: [null],
    custName: [null],
    custIdentifier: [null],
    email: [null],
    branchMail: [null],
    branchBic: [null],
    custInfo: [null],
    branchId: [null],
    seqSl: [null]

  })


  customerEmailConfigDetailsForm: FormGroup | any;

  public custIdentifier = [
    { name: "CUSTOMER", value: "CUSTOMER" },
    { name: "BENIFICIERY", value: "BENIFICIERY" }
  ]

  public statusList = [
    { name: "Active", value: 1 },
    { name: "Inactive", value: 0 }
  ]

  constructor(private router: Router,
    private cs: CommonService,
    private userService: UserService,
    public branchService: BranchService,
    private fb: FormBuilder
  ) {
    super();
    this.customerEmailConfigDetailsForm = this.fb.group({
      custMailId: [null],
      customerDetailsId: [null],
      active: 1,
      modifyBy: [null],
      createBy: [null],
      modifyDate: [null],
      custName: [null],
      seqSl: [null]

    })


  }


  ngOnInit() {
    this.manageRoleBtnDisabled = true;
    this.updateUserBtnDisabled = true;
    this.saveOrUpdate = "Save";



  }

  loadCustMailConfigList() {
    var payload = {};
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.CustomerMailConfig, 'select', payload);
  }

  showGrid = false
  ngAfterViewInit(): void {
    this.showGrid = true;
    this.gridOptions = this.buildGridOptions()
    this.prepareGrid();
    this.loadCustMailConfigList();
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

    var assignValue = {
      custMailId: item.custMailId,
      branchId: item.branchId,
      custIdentifier: item.custIdentifier,
      custName: item.custName,
      email: item.email,
      branchMail: item.branchMail,
      active: item.active
    }
    this.multiBankNameList = item.custMailConfigDetails;
    if (!this.multiBankNameList) {
      this.multiBankNameList = []
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
        this.cs.sendRequest(this, ActionType.DELETE, ContentType.CustomerMailConfig, 'DELETE_CUST_MAIL_CONFIG', payload);
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


  onLoadCustDetailsList(masterTableRow) {
    debugger
    var payload = {
      custMailId: masterTableRow.custMailId
    }

    this.cs.sendRequest(this, ActionType.SELECT, ContentType.CustomerMailConfigDetails, 'SELECT_DETAILS', payload);

  }

  onUpdateOrAddCustomerDetailsSetup() {

    debugger
    var payload = this.customerEmailConfigDetailsForm.value;

    if (payload.custMailId == null || payload.custMailId == undefined || payload.custName == undefined || payload.custName == null) {
      Swal.fire({ title: "Customer Is Required.", toast: true, timer: 5000 });
      return;
    }

    this.cs.sendRequest(this, ActionType.NEW, ContentType.CustomerMailConfigDetails, "NEW_CUSTOMER_DETAILS", payload);


  }

  onResponse(service: Service, req: any, response: any) {
    console.log(response)
    if (response.header.referance == 'select') {
      this.clicked = false
      this.showProgress = false
      if (response.payload.length > 0) {
        this.customerConfigList = response.payload;
        if (this.branchService.branchList.length == 0) {
          this.cs.post(this, ActionType.BRUNCH_LIST, ContentType.DataConfig, "BRUNCH_LIST_DROP_DOWN", {})
            .then((res: any) => {

              //var data = JSON.parse(res);

              this.branchService.branchList = res.payload;
              this.customerConfigList.forEach(i => {
                i.branchName = this.branchService.getBranchName(i.branchId);
              });
              this.dataset = this.customerConfigList;
            });
        }
        else {
          this.customerConfigList.forEach(i => {
            i.branchName = this.branchService.getBranchName(i.branchId);
          });
          this.dataset = this.customerConfigList;
        }


      }
    }
    else if (response.header.referance == 'onDeleteBtnClick') {
      this.customerConfigList = response.payload;
      this.dataset = this.customerConfigList;
      Swal.fire({ title: "Successfully deleted.", toast: true, timer: 5000 });
    }
    else if (response.header.referance == 'activeToggleUser') {
      var user = response.payload;
      this.updateItem(user);
      Swal.fire({ title: "User active status changed.", toast: true, timer: 5000 });
    } else if (response.header.referance == 'NEW') {
      this.dataset = response.payload;
      this.closePopup();

    } else if (response.header.referance == 'SELECT_DETAILS') {
      debugger
      this.custDetailsList = response.payload;
      var payload = {
        custMailId: this.custDetailsList[0].custMailId,
        seqSl: this.custDetailsList[0].seqSl
      }

      this.customerEmailConfigDetailsForm.patchValue(payload);

      this.openPopup4CustDetailsList();


    } else if (response.header.referance == 'NEW_CUSTOMER_DETAILS') {
      debugger
      this.custDetailsList = response.payload;
      var payload2 = {
        custMailId: this.custDetailsList[0].custMailId,
        seqSl: this.custDetailsList[0].seqSl

      }

      this.customerEmailConfigDetailsForm.patchValue(payload2);
      this.closePopup4DetailsEntryFrom();

    } else if (response.header.referance == 'DELETE_MULTI_BANK_NAME') {
      console.log("Delete Multi Bank Name")
      this.multiBankNameList = this.multiBankNameList.filter(e => e.custName != response.payload);
      this.loadCustMailConfigList();

    } else if (response.header.referance == 'DELETE_CUST_MAIL_CONFIG') {
      console.log("Delete cust Mail config : " + response.payload)

      Swal.fire({ title: "Successfully deleted.", toast: true, timer: 5000 });

      this.customerConfigList = response.payload;
      if (this.branchService.branchList.length == 0) {
        this.cs.post(this, ActionType.BRUNCH_LIST, ContentType.DataConfig, "BRUNCH_LIST_DROP_DOWN", {})
          .then((res: any) => {

            //var data = JSON.parse(res);

            this.branchService.branchList = res.payload;
            this.customerConfigList.forEach(i => {
              i.branchName = this.branchService.getBranchName(i.branchId);
            });
            this.dataset = this.customerConfigList;
          });
      }
      else {
        this.customerConfigList.forEach(i => {
          i.branchName = this.branchService.getBranchName(i.branchId);
        });
        this.dataset = this.customerConfigList;
      }
    } else if (response.header.referance == "UPDATE_MULTI_BANK_NAME") {
      Swal.fire({ title: "Successfully Updated.", toast: true, timer: 5000 });

      this.multiBankNameList = response.payload;
    }

  }

  public custDetailsList = [];
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      {
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
      },
      {
        id: 'custName', name: 'Cust. Name', field: 'custName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'email', name: 'Cust. Email', field: 'email',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'branchName', name: 'Branch', field: 'branchName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'branchMail', name: 'Branch Mail', field: 'branchMail',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
      },
      {
        id: 'isActive', name: 'Status', field: 'isActive',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.active == 1 ? "Active" : "Inactive" }
      }
    ];

    this.dataset = this.customerConfigList;
  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "custMailId",
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
      contextMenu: {
        hideCloseButton: false,
        commandItems: [
          {
            command: 'Cust_Details',
            iconCssClass: 'fa fa-list',
            title: 'Cust. Details',
            positionOrder: menuOrder++,
            action: (e, args) => { this.onLoadCustDetailsList(args.dataContext) },
            disabled: false
          },
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

  onSearch() {

  }


  displayStyle = "none";
  displayStyle4CustDetails = "none";
  displayStyle4CustomerDetailsEntry = "none";


  openPopup4DetailsEntryFrom(isUpdate) {
    debugger
    this.displayStyle4CustomerDetailsEntry = "block";
    if (isUpdate != null) {
      var payload = {
        custMailId: isUpdate.custMailId,
        custName: isUpdate.custName,
        customerDetailsId: isUpdate.customerDetailsId

      }

      this.customerEmailConfigDetailsForm.patchValue(payload);
      this.addOrUpdateNameVariante = "Update Name Variant";
      this.saveOrUpdateFlag = "Update";

    } else {
      var payload2 = {
        custName: null,
        customerDetailsId: null

      }

      this.customerEmailConfigDetailsForm.patchValue(payload2);
      this.addOrUpdateNameVariante = "Add Name Variant";
      this.saveOrUpdateFlag = "Save";
    }
  }

  closePopup4DetailsEntryFrom() {
    this.displayStyle4CustomerDetailsEntry = "none";
  }

  openPopup() {
    debugger
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
    var payload = {
      custMailId: null,
      custMailVer: null,
      active: null,
      modifyBy: null,
      createBy: null,
      modifyDate: null,
      custName: null,
      custIdentifier: null,
      email: null,
      branchMail: null,
      branchBic: null,
      custInfo: null,
      branchId: null

    }

    this.multiBankNameList = [];
    this.customerEmailConfigForm.patchValue(payload);
  }

  openPopup4CustDetailsList() {
    debugger
    this.displayStyle4CustDetails = "block";
  }
  closePopup4CustDetailsList() {
    this.displayStyle4CustDetails = "none";
    var payload = {
      custMailId: null,
      custMailVer: null,
      active: null,
      modifyBy: null,
      createBy: null,
      modifyDate: null,
      custName: null,
      custIdentifier: null,
      email: null,
      branchMail: null,
      branchBic: null,
      custInfo: null,
      branchId: null

    }

    //this.customerEmailConfigForm.patchValue(payload);
  }


  clicked = false
  showProgress = false
  onUpdateOrAddCustomerSetup() {
    debugger
    console.log(this.multiBankNameList)
    var payload = this.customerEmailConfigForm.value;
    payload['custMailConfigDetails'] = this.multiBankNameList
    console.log(payload)

    if (payload.branchId == null || payload.branchId == undefined) {
      Swal.fire({ title: "Branch Is Required.", toast: true, timer: 5000 });
      return;
    }
    this.clicked = true
    this.showProgress = true
    this.cs.sendRequest(this, ActionType.NEW, ContentType.CustomerMailConfig, "NEW", payload);


  }

  displayMultiBankName = 'none';
  openPopupMultiBankName() {
    this.displayMultiBankName = 'block'
  }
  closePopupMultiBankName() {
    this.displayMultiBankName = 'none';
    this.multiBankName = null;
  }


  onSaveMultiBankName() {
    debugger
    console.log(this.multiBankName)


    var isExist = this.multiBankNameList.find(e => e == this.multiBankName);

    if (isExist != this.multiBankName && this.cn != this.multiBankName) {

      if (this.customerDetailsId > 0) {
        debugger
        var refId = this.updateMultiBankNameList[0].custMailId
        var payload = {
          custMailConfigDetails: [{
            customerDetailsId: this.customerDetailsId,
            custMailId: refId,
            custName: this.multiBankName
          }]
        }
        console.log(payload)

        this.cs.sendRequest(this, ActionType.UPDATE_MULTI_BANK_NAME, ContentType.CustomerMailConfig, "UPDATE_MULTI_BANK_NAME", payload);
      } else {
        this.multiBankNameList.push({
          custName: this.multiBankName
        })
      }

    }
    console.log(this.multiBankNameList)
    this.closePopupMultiBankName();
  }
  public cn = null;
  onSelect() {
    this.cn = this.customerEmailConfigForm.value.custName;
  }

  updateMultiBankNameList = [];
  onMultiBankNameEdit(data) {
    debugger
    console.log(data)
    this.customerDetailsId = data.customerDetailsId;
    this.updateMultiBankNameList.push(data);

    this.displayMultiBankName = 'block';
    this.multiBankName = data.custName;
  }

  onMultiBankNameDelete(data) {
    console.log(data)
    var cn = this.customerEmailConfigForm.value;
    debugger
    if (cn.custMailId > 0) {
      var payload = {
        custMailId: cn.custMailId,
        custName: data.custName
      }
      console.log(payload)
      Swal.fire({
        text: `Want to Submit?`,
        // title: 'Are you sure want to delete this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.cs.sendRequest(this, ActionType.DELETE_MULTI_BANK_NAME, ContentType.CustomerMailConfig, "DELETE_MULTI_BANK_NAME", payload);
        }
      });
    } else {

      this.multiBankNameList = this.multiBankNameList.filter(e => e.custName != data.custName);
      console.log(this.multiBankNameList.length)
    }



  }

}
