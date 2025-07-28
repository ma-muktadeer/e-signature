import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, GridStateChange, GridStateType, PaginationService, ServicePagination } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';

import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { RequestPopupComponent } from 'src/app/shard-module/request-popup/request-popup.component';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-external-request',
  templateUrl: './external-request.component.html',
  styleUrls: ['./external-request.component.scss']
})
export class ExternalRequestComponent extends Softcafe implements OnInit, Service, OnDestroy {

  dataList: any = []
  allList: any = []
  // public requestForm: FormGroup | any;

  actionColumnWidth = 15;

  showGrid = true;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  institutionList: any = []
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  information: any;



  appPermission = AppPermission;
  statusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (this.isSuperAdmin || this.permissioinStoreService.hasAnyPermission([this.appPermission.REQUEST_VIEWER, this.appPermission.REQUEST_MAKER, this.appPermission.REQUEST_CHECKER])) {
      if (dataContext.requestStatus === 'COMPLETED') {
        return `<button class = "btn-success btn-block">` + blockToCamel(dataContext.requestStatus) + '</button>'
      }
      else if (dataContext.requestStatus === 'PEND_APPROVED') {
        return `<button class = "btn-warning btn-block">` + blockToCamel(dataContext.requestStatus) + '</button>'
      }
      return `<span>` + dataContext.requestStatus ? blockToCamel(dataContext.requestStatus) : '' + '</span>';
    }
    else {
      return '<span>' + dataContext.requestStatus ? blockToCamel(dataContext.requestStatus) : '' + '</span>';
    }
  }
  requrstFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.requestType) {
      return `<span>${blockToCamel(dataContext.requestType)}</span>`
    }
  }
  nameFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return `<div class="d-flex justify-content-start align-items-center user-name">
										<div class="avatar-wrapper">
										   <div class="avatar me-2"><img src="${dataContext.userImage ? dataContext.userImage : 'assets/images/pro/1.png'}" alt="Avatar" class="rounded-circle img"></div>
										</div>
										<div class="d-flex flex-column"><span class="emp_name text-truncate">${dataContext.requesterName}</span></div>
									 </div>`;
    //  <small class="emp_post text-truncate text-muted">Paralegal</small>
  }
  makerFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext.requestStatus === 'NEW' && (this.isSuperAdmin
      || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_APPROVER))) {
      return '<button type="button" style="color: white;" class="btn-warning pointer"><i title="Request for Approve" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }
    else if (dataContext.requestStatus === 'PEND_APPROVED' && (this.isSuperAdmin
      || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_CHECKER))) {
      return '<button type="button" style="color: white;" class="btn-success pointer"><i title="Approve Request" class="fa fa-check text-red" aria-hidden="true"></i></button>';
    }
    else {
      return null;
    }
  }
  deleteFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext.requestStatus === 'NEW' && (this.isSuperAdmin
      || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_APPROVER))) {
      return '<button title="Delete" type="button" style="color: white;" class="btn-danger pointer"><i class="fa fa-trash text-red" aria-hidden="true"></i></button>';
    }
    else {
      return null;
    }
  }
  rejectFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext.requestStatus === 'PEND_APPROVED' && this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_CHECKER)) {
      return '<button title="Reject" type="button" style="color: white;" class="btn-danger pointer"><i class="fa fa-times text-red" aria-hidden="true"></i></button>';
    }
    else {
      return null;
    }
  }
  viewFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    return '<button type="button" style="color: white;" class="btn-info pointer"><i title="View" class="fa fa-eye text-red" aria-hidden="true"></i></button>';
  }

  dateFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return dataContext.completeDate ? dataContext.completeDate.substring(0, 10) : null;
  }


  typeList: any[] = [];
  pa: string;
  name: string;
  showProgress: boolean = false;
  click: boolean = false;
  isSuperAdmin: boolean;
  ref: string = 'add';
  paginationService: PaginationService;
  filterRequestTimer: any;
  pageSize: number = 20;
  pageNumber: number = 1;
  total: number = 0;
  userRequestType: string = null;
  linkType: string = null;
  selectedInstitutionName: any;
  loginUser: any;
  loading: boolean = false;;


  constructor(private cs: CommonService,
    public permissioinStoreService: PermissioinStoreService,
    private modalService: NgbModal
  ) {
    super();
    this.prepareGrid();
    this.loginUser = this.cs.loadLoginUser();
    this.isSuperAdmin = this.loginUser?.roleList.find((f: any) => f.roleName === 'SUPER_ADMIN');
  }


  ngOnInit(): void {
    debugger
    this.gridOptions = this.buildGridOptions();
    // this.loadInstitution();
    // this.loadRequest();
    this.loadRequest(1, this.pageSize);

    this.getWindowSize();

  }
  ngOnDestroy(): void {
    this.angularGrid.destroy;
  }
  // loadValue() {
  //   debugger
  //   const value = forkJoin([ this.loadRequest()])
  //   .subscribe((res: any) => {
  //     this.buildValue(res[0]?.payload);
  //   })
  // }

  // buildValue(list: any) {
  //   list.forEach(e => {
  //     e.institutionName = this.institutionList.find(i => i.institutionId === e.institutionId)?.name;
  //   });
  //   this.allList = list;
  // }

  prepareGrid() {
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      {
        id: 'requesterName', name: 'Institution Request', field: 'requesterName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        formatter: this.nameFormatter,
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 200,
      },
      {
        id: 'name', name: 'Name of Officials', field: 'name',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 150,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 200,
      },
      {
        id: 'pa', name: 'Request PA Number', field: 'pa',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 150,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 150,
      },
      {
        id: 'requestType', name: 'Reason', field: 'requestType',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 200,
        formatter: this.requrstFormatter,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 200,
      },
      {
        id: 'requestTime', name: 'Request Time', field: 'requestTime',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 250,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 220,
      },
      {
        id: 'requestStatus', name: 'Status', field: 'requestStatus',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        formatter: this.statusFormatter,
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 160,

      },
      {
        id: 'completeBy', name: 'Complete By', field: 'completeBy',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },

        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 140,
      },
      {
        id: 'completeDate', name: 'Complete Date', field: 'completeDate',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        formatter: this.dateFormatter,

        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 140,
      },
      {
        id: 'email', name: 'Email', field: 'email',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 220,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 220,
      },
      {
        id: 'requesterEmail', name: 'Requester Email', field: 'requesterEmail',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 220,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 220,
      },
      {
        id: 'designation', name: 'Designation', field: 'designation',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 120,
      },
      {
        id: 'department', name: 'Department', field: 'department',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 120,
      },

      {
        id: 'institutionName', name: 'Institution Name', field: 'institutionName',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 150,
      },
      {
        id: 'description', name: 'Description', field: 'description',
        sortable: true, type: FieldType.text,
        filterable: isFilterable, filter: { model: Filters.inputText },
        // maxWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false,
        width: 450,
      },
    ];

    let actionClm: Column[] = [
      {
        id: 'view', name: '', field: 'view',

        formatter: this.viewFormatter,
        minWidth: 35, maxWidth: 100,
        onCellClick: (e, args) => {
          this.information = args.dataContext;
          this.openRequestComponent('view');
        },
      },
      {
        id: 'action', name: 'Action', field: 'action',

        formatter: this.makerFormatter,
        minWidth: 80,
        onCellClick: (e, args) => {
          if (args.dataContext.requestStatus === 'NEW' && (this.isSuperAdmin
            || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_APPROVER))) {
            this.makerRequest(args.dataContext);

          } else if (args.dataContext.requestStatus === 'PEND_APPROVED' && (this.isSuperAdmin
            || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_CHECKER))) {
            this.authRequest(args.dataContext);
          }
          else {
            () => {
              Swal.fire('No Action Needed.');
            }
          }
        },
      },
      {
        id: 'delete', name: '', field: 'delete',

        formatter: this.deleteFormatter,
        minWidth: 35, maxWidth: 100,

        onCellClick: (e, args) => {
          if (args.dataContext.requestStatus === 'NEW' && (this.isSuperAdmin
            || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_CHECKER))) {
            this.deleteRequest(args.dataContext);
          } else {
            () => {
              console.log('no action');
            };
          }
        },
      },
      {
        id: 'reject', name: '', field: 'reject',

        formatter: this.rejectFormatter,
        minWidth: 35, maxWidth: 100,

        onCellClick: (e, args) => {
          if (args.dataContext.requestStatus === 'PEND_APPROVED' && (this.isSuperAdmin
            || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_APPROVER))) {
            this.rejectRequest(args.dataContext);
          } else {
            () => {
              console.log('no action');
            };
          }
        },
      },

    ];

    if (this.isSuperAdmin
      || this.permissioinStoreService.hasAnyPermission([this.appPermission.REQUEST_CHECKER, this.appPermission.REQUEST_APPROVER])) {
      actionClm.push(...this.columnDefinitions);
    }
    else {
      actionClm = this.columnDefinitions;
    }
    this.columnDefinitions = actionClm;

  }


  buildGridOptions() {
    var option: GridOption = {
      datasetIdPropertyName: "externalUserRequestId",
      rowHeight: 65,
      enableAutoResize: false,
      explicitInitialization: true,
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
      forceFitColumns: true,// this one is important
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
        pageNumber: this.pageNumber,
        pageSizes: [5, 8, 10, 20, 25, 50, 75, 100, 150, 500],
        pageSize: this.pageSize,
        totalItems: this.total,
      },
    }
    return option;
  }



  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;


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

      // this.pageNumber = pageNumber;
      // this.pageSize = pageSize;
      // this.searchPayment();
      // this.handlePaginationChagne(pageNumber, pageSize);
    } else if (change.change.type == GridStateType.rowSelection) {
      // this.handleRowSelection(change);
    }
  }
  handlePaginationChagne(paginationData: ServicePagination) {
    console.log(paginationData);
    const { pageNumber, pageSize } = paginationData;
    this.loadRequest(pageNumber, pageSize);

  }

  // loadInstitution() {
  //   debugger
  //   const payload = {}
  //   return this.cs.execute(ActionType.SELECT_ALL, ContentType.Institution, payload)
  //   // this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Institution, 'select', payload)
  // }



  checkParmission(permissioinList: AppPermission[]): boolean {

    return this.permissioinStoreService.hasAnyPermission(permissioinList);
  }

  rejectRequest(dataContext: any) {
    this.updateRequest(dataContext, 'REJECT');
  }

  makerRequest(dataContext: any) {
    this.updateRequest(dataContext, 'APPROVE');
  }

  deleteRequest(dataContext: any): void {
    this.updateRequest(dataContext, 'DELETE');
  }


  authRequest(dataContext: any) {
    this.updateRequest(dataContext, 'COMPLETE');
  }

  updateRequest(dataContext: any, ref: string): void {
    console.log('dataContext: ', dataContext);
    debugger;

    Swal.fire({
      // title: `Are you really want to ${ref == 'APPROVE' ? 'Request for Approve' : blockToCamel(ref)} this request?`,
      text: `Want to Submit?`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
    }).then(async (result: { isConfirmed: boolean; isDenied: boolean }) => {
      if (result.isConfirmed) {

        const payload: any = {
          status: ref === 'COMPLETE' ? 'COMPLETED' : ref === 'APPROVE' ? 'PEND_APPROVED' : ref === 'REJECT' ? 'REJECTED' : dataContext.requestStatus,
          requestId: dataContext.externalUserRequestId ?? dataContext.requestId,
          // completeDate: date,
          requesterEmail: dataContext.requesterEmail,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          institutionId: this.cs.loadLoginUser()?.institutionId,
        }

        if (ref === 'COMPLETE') {
          var { value: date } = await Swal.fire({
            title: "Pick a date",
            input: "date",
            validationMessage: 'Invalid Date',
            didOpen: () => {
              const td = (new Date());
              const today = new Date(td.setDate(td.getDate() + 1)).toISOString();
              const t = new Date(td.setDate(td.getDate() - 6)).toISOString();
              Swal.getInput().min = t.split("T")[0];
              Swal.getInput().max = today.split("T")[0];
            }
          });
          if (date) {

            this.loading = true;
            this.showProgress = true;
            payload.completeDate = date;

            // this.cs.sendRequest(this, ActionType.UPDATE, ContentType.Request, 'SELECT_BY', payload);

            this.sendRequest(ActionType.UPDATE, ContentType.Request, 'SELECT_BY', payload);

          } else {
            Swal.fire('Date can not be empty.');
          }
        }
        else if (ref === 'APPROVE') {
          this.sendRequest(ActionType.UPDATE, ContentType.Request, 'SELECT_BY', payload);
        }
        else if (ref === 'DELETE') {
          this.sendRequest(ActionType.DELETE, ContentType.Request, 'SELECT_BY', payload);
        }
        else if (ref === 'REJECT') {

          const { value: text } = await Swal.fire({
            input: "textarea",
            inputLabel: "Rejection Cause",
            inputPlaceholder: "Type reection cause here...",
            inputAttributes: {
              "aria-label": "Type reection cause here"
            },
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "You need to write rejection cause!.";
              }
            }
          });
          if (text) {
            payload.rejectCause = text;
            this.sendRequest(ActionType.REJECT, ContentType.Request, 'SELECT_BY', payload);
          }

        }
        else {
          Swal.fire('Invalid Request.');
        }
      } else if (result.isDenied) {
        // Handle denial case
      }
    });
  }

  sendRequest(actionType: ActionType, contentType: ContentType, ref: string, payload: any) {
    this.cs.sendRequest(this, actionType, contentType, ref, payload)
  }

  loadRequest(pageNumber: number, pageSize: number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    const payload = {
      institutionId: this.loginUser?.institutionId,
      pageNumber: pageNumber != 0 ? pageNumber : 1,
      pageSize: pageSize,
    }

    this.loading = true;
    // return this.cs.execute(ActionType.SELECT_ALL, ContentType.Request, payload)
    debugger
    if (this.loginUser.loginName === 'softcafe' || this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_ADMIN)) {
      this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Request, 'SELECT_BY_ALL', payload);
    } else if (this.checkParmition([this.appPermission.REQUEST_VIEWER])) {
      this.cs.sendRequest(this, ActionType.SELECT_BY_USER, ContentType.Request, 'SELECT_BY_ALL', payload);
    }
  }
  checkParmition(permissionList: AppPermission[]): any {
    return this.permissioinStoreService.hasAnyPermission(permissionList)
  }

  // clear1() {
  //   this.updateValue = null;
  //   this.click = false;
  //   this.requestForm.reset();
  //   this.btnName = 'Save';
  // }
  setPanination() {
    setTimeout(() => {
      if (this.paginationService) {
        this.paginationService.updateTotalItems(this.total);
      }
    }, 100);
  }
  block2Camel = blockToCamel;
  onResponse(service: Service, req: any, res: any) {

    this.showProgress = false;
    this.loading = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res)).then(() => this.loadRequest(this.pageNumber, this.pageSize));
    }
    else if (res.header.referance == 'select') {
      this.institutionList = res.payload;
    }
    // else if (res.header.referance == 'save') {
    //   debugger
    //   if (res.payload) {
    //     this.saveResponse(res.payload);
    //   }

    // }
    // else if (res.header.referance === 'SEARCH_PA') {
    //   this.paList = res.payload;
    //   console.log('all pa list is: ', this.paList);

    // }
    // else if (res.header.referance === 'SEARCH_NAME') {
    //   this.nameList = res.payload;
    //   console.log('all name list is: ', this.nameList);

    // }
    else if (res.header.referance == 'SELECT_BY_ALL') {

      // this.allList = res.payload
      this.allList = res.payload['content'];
      this.total = res.payload['total'];
      console.log('all list ', this.allList);

      this.setPanination();

    }
    else if (res.header.referance == 'SELECT_BY') {

      Swal.fire('Update done').then(() => {
        // this.allList = res.payload
        this.allList = res.payload['content'];
        this.total = res.payload['total'];
        console.log('all list ', this.allList);

        this.setPanination();
      });

    }
  }


  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.loading = false;
    throw new Error('Method not implemented.');
  }

  openPop(ref: string) {
    this.openRequestComponent(ref);
  }

  @Input()
  private requestTamp = RequestPopupComponent;
  openRequestComponent(ref?: string) {
    debugger
    const mRef = this.modalService.open(this.requestTamp, { size: 'lg', backdrop: 'static' });
    mRef.componentInstance.ref = ref;
    mRef.componentInstance.linkInformation = this.information;
    mRef.result.then((res: any) => {
      this.information = null;
      if (res && res?.content instanceof Array) {
        this.allList = res?.content;
        this.total = res?.total;
        this.setPanination();
      }
    });
  }

  height: number;
  width: number;
  @HostListener('window:resize', ['$event'])
  getWindowSize() {
    this.height = window.innerHeight * 0.8;
    debugger
    this.width = document.getElementById('gw')?.offsetWidth;
    let grd = document.getElementById('requestGrid');
    if (grd) {
      grd.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }
  }

}
