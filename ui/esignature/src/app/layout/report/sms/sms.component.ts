import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, Formatters, GridOption, MenuCommandItem } from 'angular-slickgrid';
import { Subject } from 'rxjs';
import { BranchService } from 'src/app/service/branch.service';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  actionColumnWidth = 10;


  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  smsList: Array<any> = [];
  spinnerSearchBtn = false
  disabledSearchBtn = false

  public branchControl: FormControl = new FormControl();
  public branchFilterCtrl: FormControl = new FormControl();
  // public branchList = [];
  public filterBranchList = [];
  private _onDestroy = new Subject<void>();
  
  disableBranch = false;
  showSearchProgress = false
  mtList = [];

  constructor(public cs : CommonService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public branchService: BranchService,
    ) { super();}

    searchForm = this.fb.group({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date()),
      outbound: [null],
      branchId: [null],
      f20: [null],
      msgType: [null],
    })

  ngOnInit(): void {
    debugger
    this.prepareGrid();
    this.gridOptions = this.buildGridOptions();
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.SmsTracker, 'select', {});

    // var payload = {}
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.Branch, 'selectBranch', payload);

    const date = new Date()
    const year = date.getFullYear()

    let month: number | string = date.getMonth() + 1
    let day: number | string = date.getDate()

    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day

    const today = `${year}-${month}-${day}`

    // if (this.branchService.branchList.length == 0) {
    //   this.branchService.loadnBranch();
    // }

    // this.branchService.branchLoadChanged.subscribe((v) => {
    //   this.branchList = v;
    //   this.filterBranchList = this.branchList;
    // });

    var p = {
      outbound: 1,
      fromDate : today,
      toDate : today
    }
    this.searchForm.patchValue(p);
    // this.branchList = this.branchService.branchList;
    // this.filterBranchList = this.branchList;
    // if (!this.branchService.isHeadOfficeUser()) {
    //   this.disableBranch = true
    // }
    var v = {
      branchId: this.cs.loadLoginUser().branchId
    }
    this.searchForm.patchValue(v);

    this.branchFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRecord();
      });
  }

  onSearch() {
    if (this.spinnerSearchBtn) {
      return
    }
   var payload = this.searchForm.value;

   payload.f20 = payload.f20 ? payload.f20 : null;
   payload.msgType = payload.msgType ? payload.msgType : null;
   payload.formatDate =  payload.formatDate ?  payload.formatDate : null
   payload.toDate =  payload.toDate ?  payload.toDate : null

    this.cs.sendRequest(this, ActionType.SEARCH, ContentType.SmsTracker, 'search', payload);
    this.spinnerSearchBtn = true
    this.disabledSearchBtn = true
  }

  private filterRecord() {
    // if (!this.branchList) {
    //   return;
    // }

    // let search = this.branchFilterCtrl.value;
    // if (!search) {
    //   this.filterBranchList = this.branchList;
    //   return;
    // } else {
    //   this.filterBranchList = this.branchList.filter(branch => branch.brunchName.toUpperCase().indexOf(search.toUpperCase()) > -1);
    // }
  }

  onReset() {

    const date = new Date()
    const year = date.getFullYear()

    let month: number | string = date.getMonth() + 1
    let day: number | string = date.getDate()

    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day

    const today = `${year}-${month}-${day}`

    // var fromDate = this.searchForm.value.fromDate;
    // var toDate = this.searchForm.value.toDate;
    this.searchForm.reset();
 
    var patch = {
   
      outbound: 1,
      fromDate : today,
      toDate : today
    }
    this.searchForm.patchValue(patch);


  }


  showGrid = false
  ngAfterViewInit(): void {
      this.showGrid = true;
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);


  }
  viewDisplayStyle = "none"
  onViewClick(e, args) {
    debugger
    this.viewDisplayStyle = "block"
    var payload = args.dataContext
    this.cs.sendRequest(this, ActionType.RAW_MESSAGE, ContentType.SmsTracker, 'RAW_MESSAGE', payload);

  }
  onClose(){
    this.viewDisplayStyle = "none"
  }
  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="View"  style="font-size:14px;" class="fa fa-eye pointer" aria-hidden="true"></i>'
  };
  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
    

      // {
      //   id: 'smsId', name: 'Sms Id', field: 'smsId',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, filter: { model: Filters.inputText, },
      // },
      
      // {
      //   id: 'paymentId', name: 'Payment Id', field: 'paymentId',
      //   sortable: true, type: FieldType.text,
      //   filterable: true, filter: { model: Filters.inputText, },
      // },
      {
        id: 'view', name: '', field: 'view', formatter: this.viewIcon,
        minWidth: 30, width: this.actionColumnWidth, maxWidth: 50, toolTip: "View User",
        onCellClick: (e, args) => { this.onViewClick(e, args) },
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        excludeFromExport: true,
        resizable: false,
        focusable: false,
        selectable: false
      },
      {
        id: 'msg', name: 'Message', field: 'msg',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      {
        id: 'type', name: 'Type', field: 'type',
        sortable: true, type: FieldType.number,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'msisdn', name: 'msisdn', field: 'msisdn',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'entryTime', name: 'Entry Time', field: 'entryTime',
        sortable: true, type: FieldType.number,
        filterable: isFilterable, filter: { model: Filters.inputText, },
        minWidth: 150
      },
      {
        id: 'status', name: 'Status', field: 'status',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      {
        id: 'f20', name: 'F20', field: 'f20',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },

      {
        id: 'msgType', name: 'Msg Type', field: 'msgType',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },

      {
        id: 'benName', name: 'Beneficiary Name', field: 'benName',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      {
        id: 'msgDate', name: 'Msg Date', field: 'msgDate',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 200
      },
      {
        id: 'decAmount', name: 'Amount', field: 'decAmount',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },

      {
        id: 'currency', name: 'Currency', field: 'currency',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      {
        id: 'receiverBic', name: 'Receiver Bic', field: 'receiverBic',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      {
        id: 'senderBic', name: 'Sender Bic', field: 'senderBic',
        sortable: true, type: FieldType.date,
        filterable: isFilterable, filter: { model: Filters.inputText },
        minWidth: 150
      },
      // {
      //   id: 'f20', name: 'F20', field: 'f20',
      //   sortable: true, type: FieldType.date,
      //   filterable: true, filter: { model: Filters.inputText },
      // },

      
    ];

    this.dataset = this.smsList;
  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "smsId",
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
msg
  onResponse(service: Service, req: any, res: any) {
    this.spinnerSearchBtn = false
    this.disabledSearchBtn = false
debugger
    // if (res.header.referance == 'selectBranch') {
    //   if (res.payload.length > 0) {
    //     this.branchList = res.payload;
    //     this.branchList.forEach(i => {
    //       i['id'] = i.userId;
    //     });
    //   }
    //   else {
    //   }
    // }
     if (res.header.referance == 'search') {
      console.log("search", res.payload)
      this.showSearchProgress = false;
      console.log("Data count ", res.payload.length);
      this.dataset = res.payload;
     
    }
   else if (res.header.referance == "select") {

      console.log(res.payload);
      // this.smsList =res.payload;
      // this.dataset = res.payload;
    
    }
    else if (res.header.referance == 'RAW_MESSAGE') {
      console.log(res.payload);
      this.msg = res.payload.msg
    }
    else if (res.header.referance == "NEW") {

      console.log(res.payload);
      Swal.fire({ title: "Successfully saved.", toast: true, timer: 5000 });
     

    }else if(res.header.referance == "DELETE"){

      Swal.fire({ title: "Successfully DELETE.", toast: true, timer: 5000 });
  

    }
  }

  onError(service: Service, req: any, res: any) {
    console.log(res)
    throw new Error(res);
  }
}
