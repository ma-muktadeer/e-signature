import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, MenuCommandItem } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { MailTmpPopComponent } from '../mail-tmp-pop/mail-tmp-pop.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-mail-tmp',
  templateUrl: './mail-tmp.component.html',
  styleUrls: ['./mail-tmp.component.scss']
})
export class MailTmpComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  loading: boolean = true;
  actionColumnWidth = 40;

  showAddbtn = false;


  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  public appPermission = AppPermission


  columns: Array<any>;
  manageRoleBtnDisabled: boolean;
  isRequestView: boolean = false;
  ;
  updateUserBtnDisabled: boolean;

  // customerConfigList: Array<any> = [];

  selectedUserList: Array<any>;
  selectedUser: any;
  contextMenuUser: any;
  public saveOrUpdate: string = "";

  isViewMode = false;
  showApproveBtn = false;
  spinnerApproveBtn = false;
  spinnerSaveBtn = false;
  disabledSaveBtn = false;


  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<button type="button" class="btn btn-info btn-sm pointer"><i title="View" class="fa fa-eye pointer" aria-hidden="true"></i></button>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_DELETER)  && !dataContext?.updateStatus?.includes('PEND_')) {
      return '<button type="button" class="btn btn-danger btn-sm pointer"><i title="Delete" class="fa fa-trash" aria-hidden="true"></i></button>';
    } else {
      return '';
    }
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_MAKER)) {
      return '<button type="button" class="btn btn-secondary btn-sm pointer"><i title="Edit" class="fa fa-edit" aria-hidden="true"></i></button>';
    }
    return null;
  };
  approveIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_APPROVER)) {
      return '<button type="button" class="btn btn-primary btn-sm pointer"><i title="Approve" class="fa fa-check-square-o" aria-hidden="true"></i></button>'
    }
    return null;
  };
  authorizeIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_CHECKER)) {
      return '<button type="button" class="btn btn-success btn-sm pointer"><i title="Authorize" class="fa fa-check" aria-hidden="true"></i></button>'
    }
    return null;
  };
  requestViewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_APPROVER)
      && dataContext?.updateStatus === 'PEND_MODIFIED') {
      return '<button type="button" class="btn btn-dark btn-sm pointer"><i title="View Request" class="fa fa-eye" aria-hidden="true"></i></button>'
    }
    else if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_CHECKER)
      && dataContext?.updateStatus === 'PEND_APPROVE') {
      return '<button type="button" class="btn btn-dark btn-sm pointer"><i title="View Request" class="fa fa-eye" aria-hidden="true"></i></button>'
    }
    return null;
  };
  innerHtmlBody: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="edit" style="font-size:14px;">' + dataContext.body + '</i>'
  };
  innerHtmlSubject: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="edit" style="font-size:14px;">' + dataContext.subject + '</i>'
  };
  statusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.updateStatus?.includes('PEND_MODIFIED')) {
      return `<button type="button" class="btn btn-warning btn-sm pointer"><i title="MODIFIED" style="font-size:14px;"> ${blockToCamel(dataContext.updateStatus)} </i></button>`
    }
    else if (dataContext?.updateStatus?.includes('PEND_DELETE')) {
      return `<button type="button" class="btn btn-warning btn-sm pointer"><i title="MODIFIED" style="font-size:14px;"> ${blockToCamel(dataContext.updateStatus)} </i></button>`
    }
    else if (dataContext?.updateStatus?.includes('PEND_APPROVE')) {
      return '<button type="button" class="btn btn-info btn-sm pointer"><i title="APPROVE" style="font-size:14px;">' + blockToCamel(dataContext.updateStatus) + '</i></button>'
    }
    else {
      return blockToCamel(dataContext.status);
    }
  };

  constructor(private router: Router,
    private cs: CommonService,
    public permissioinStoreService: PermissioinStoreService,
    private modaleService: NgbModal,
  ) {
    super();
    this.prepareGrid();

  }

  ngOnInit() {
    debugger
    this.showAddbtn = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.MAIL_TEMPLATE_MAKER)
    this.gridOptions = this.buildGridOptions()
    this.loadMails();
  }

  showGrid = false
  ngAfterViewInit(): void {
    this.showGrid = true;
    this.getWindowSize()
  }

  loadMails() {
    debugger
    var payload = {};
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.MailTemplete, 'SELECT', payload);
    this.loading = true;
  }


  onContextMenuAction(event, actionItem) {

  }


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;


  }
 isFilterable = environment.enableFiltering;
  colDef = [
    {
      id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon,
      minWidth: 20, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Delete User",
      onCellClick: (e, args) => {
        if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_DELETER) && !args.dataContext?.updateStatus?.includes('PEND_')) {
          this.onPendDelete(e, args)
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
      id: 'view', name: '', field: 'view', formatter: this.viewIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => { this.onView(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50, toolTip: "Update Template",
      onCellClick: (e, args) => {
        if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_MAKER)) {
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
      id: 'approve', name: '', field: 'approve', formatter: this.approveIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => {
        if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_APPROVER)) {
          if (args.dataContext.status === 'NEW' || args.dataContext.updateStatus === 'PEND_MODIFIED') {
            this.onApprove(e, args);
          }
          else {
            this.openNotification(args.dataContext);
          }
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
      id: 'authorize', name: '', field: 'authorize', formatter: this.authorizeIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => {
        debugger
        if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_CHECKER)) {
          if (args.dataContext.status === 'PEND_APPROVE' || args.dataContext.updateStatus === 'PEND_APPROVE' || args.dataContext?.updateStatus === 'PEND_DELETE') {
            this.onAuthroze(e, args);
          }
          else {
            this.openNotification(args.dataContext);
          }
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
      id: 'requestView', name: '', field: 'requestView', formatter: this.requestViewIcon, minWidth: 25, width: this.actionColumnWidth, maxWidth: 50,
      onCellClick: (e, args) => {
        if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_APPROVER)
          && args.dataContext?.updateStatus === 'PEND_MODIFIED') {
          debugger
          this.onReqView(e, args);
          // this.onView(e, args);
          // this.onAuthroze(e, args);
        } else if (this.permissioinStoreService.hasPermission(this.appPermission.MAIL_TEMPLATE_CHECKER)
          && (args.dataContext?.updateStatus === 'PEND_APPROVE' || args.dataContext?.updateStatus === 'PEND_DELETE')) {
          // this.onView(e, args);
          this.onReqView(e, args);
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
      id: 'subject', name: 'Subject', field: 'subject', formatter: this.innerHtmlSubject,
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
    },
    {
      id: 'body', name: 'Body', field: 'body', formatter: this.innerHtmlBody,
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
    },
    {
      id: 'type', name: 'Type', field: 'type', formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.type),
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
    },
    {
      id: 'group', name: 'Group', field: 'group', formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => blockToCamel(dataContext?.group),
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
    },
    {
      id: 'status', name: 'Status', field: 'status',
      formatter: this.statusFormatter,
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
    }
  ];

  prepareGrid() {

    const isTemplateMaker = this.permissioinStoreService.hasAnyPermission([this.appPermission.MAIL_TEMPLATE_MAKER, this.appPermission.MAIL_TEMPLATE_DELETER]);
    const isTemplateChecker = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.MAIL_TEMPLATE_CHECKER);
    const isTemplateApprover = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.MAIL_TEMPLATE_APPROVER);

    this.colDef = this.colDef.filter(f => {
      if (!isTemplateMaker && (f.id === 'edit' || f.id === 'delete')) {
        return false;
      }
      if (!isTemplateApprover && (f.id === 'approve')) {
        return false;
      }
      if (!isTemplateChecker && f.id === 'authorize') {
        return false;
      }
      return true;
    })


    this.columnDefinitions = this.colDef;

    // this.dataset = this.customerConfigList;
  }

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "mailTempId",
      enableFiltering: true,
      enableAutoResize: false,
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
        leftFooterText: "trye it"
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

  onEdit(e, args) {
    debugger
    this.isRequestView = true;
    this.openPopup(args.dataContext);
  }
  onApprove(e: any, args: any) {
    const value = args.dataContext;
    this.build4SendRequest(value, 'PEND_APPROVE');
  }
  onAuthroze(e: any, args: any) {
    debugger
    const value = args.dataContext;
    this.build4SendRequest(value, args.dataContext?.updateStatus === 'PEND_DELETE' ? 'DELETED' : 'APPROVED');
  }

  onView(e, args) {
    debugger

    this.isViewMode = true;
    // this.isRequestView = false;
    this.openPopup(args.dataContext);

  }
  onReqView(e, args) {
    debugger

    this.isViewMode = true;
    this.isRequestView = true;
    // this.onView(e, args);
    this.openPopup(args.dataContext);

  }

  openNotification(dataContext: any) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Status',
      text: `${dataContext.status} is not valid Status for this action.`,
      // text: dataContext.status,
      // timer: 1000,
    });
  }

  onDelete(payload) {
    // var item = this.gridObj.getDataItem(args.row);

    // const item = payload;
    // Swal.fire({
    //   title: 'Are you sure want to delete this user?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then((result) => {
    //   if (result.value) {
    //     var payload = item;

    this.cs.sendRequest(this, ActionType.DELETE, ContentType.MailTemplete, 'DELETE', payload);
    //   }
    // });
  }

  onPendDelete(e, args) {
    // var item = this.gridObj.getDataItem(args.row);

    const item = args.dataContext;
    Swal.fire({
      title: 'Delete',
      text: `Want to Submit?`,
      // title: 'Are you sure want to delete this template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var payload = item;

        this.cs.sendRequest(this, ActionType.PEND_DELETE, ContentType.MailTemplete, 'DELETE', payload);
      }
    });
  }

  build4SendRequest(value: any, status: string) {
    debugger
    var payload = {
      mailTempId: value.mailTempId,
      subject: value.subject,
      body: value.body,
      group: value.group,
      type: value.type,
      status: status,
    }
    // this.openAlert(payload, status === 'PEND_APPROVE' ? 'Approve' : 'DELETED' ? 'Delete' : 'Authorize');
    this.openAlert(
      payload, 
      status === 'PEND_APPROVE' ? 'Approve' : 
      (status === 'DELETED' ? 'Delete' : 
      (status === 'APPROVED' ? 'Authorize' : 'Authorize'))
  );
  
  }


  openAlert(payload: any, action: string) {
    debugger
    Swal.fire({
      title: action,
      icon: 'question',
      text: `Want to Submit?`,
      // titleText: `Are you want to ${action} this Mail Template?`,
      confirmButtonText: "Confirm",
      showConfirmButton: true,
      showCancelButton: true,
      showDenyButton: false,
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
        this.spinnerSaveBtn = true;
        if (payload.status === 'DELETED') {
          this.onDelete(payload);
        } else {
          this.cs.sendRequest(this, ActionType.SAVE, ContentType.MailTemplete, 'NEW', payload);
        }

      } else {
        // Swal.fire({
        //   text: `Mail Template ${action} Cancelled.`,
        //   timer: 1000,
        // })
      }
    })
  }

  // buildDataset(payload: any) {
  //   debugger
  //   this.dataset = payload;
  //   this.dataset.forEach((f: any) => {
  //     f.status = f?.updateStatus ? f.updateStatus.replace(/_/g, ' ') : f.status;
  //   });
  // }

  onResponse(service: Service, req: any, response: any) {
    debugger
    this.spinnerApproveBtn = false
    this.spinnerSaveBtn = false
    this.disabledSaveBtn = false
    if (response.header.referance == 'SELECT') {
      console.log(response.payload)
      // this.buildDataset(response.payload);
      this.dataset = response.payload;
      this.loading = false;

    }
    else if (response.header.referance == 'onDeleteBtnClick') {
      Swal.fire({ title: "Successfully delete user.", toast: true, timer: 5000 });
    }
    else if (response.header.referance == 'Approved') {
      Swal.fire({ title: "Mail Successfully Approved.", toast: true, timer: 5000 });
      // this.closePopup();
      this.loadMails();
    }

    else if (response.header.referance == 'NEW') {
      Swal.fire({ title: "Mail Successfully Save.", toast: true, timer: 5000 });
      console.log(response.payload);
      this.loadMails();
      // this.closePopup();

    } else if (response.header.referance == 'DELETE') {
      Swal.fire({ title: "Mail Successfully Delete.", toast: true, timer: 5000 })
        .then(t => this.dataset = response.payload);
    }
  }


  onError(service: Service, req: any, response: any) {
    console.log('error', response);
  }



  // displayStyle = "none";
  @Input() private mailTmp = MailTmpPopComponent;
  private componentRef: NgbModalRef;

  openPopup(exitMailTemInfo?: any) {
    debugger
    this.componentRef = this.modaleService.open(this.mailTmp, { backdrop: 'static', size: 'xl' });
    this.componentRef.componentInstance.exitMailTemInfo = exitMailTemInfo;
    this.componentRef.componentInstance.isViewMode = this.isViewMode;
    this.componentRef.componentInstance.isRequestView = this.isRequestView;

    this.componentRef.result.then(res => {
      if (res instanceof Array) {
        this.dataset = res;
        // this.buildDataset(res);
      }
      this.isViewMode = false;

      this.isViewMode = false;
      this.isRequestView = false;
    });
  }


  height: number;
  width: number;

  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.8;
    this.width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById('mlGrid');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }
  }


}

