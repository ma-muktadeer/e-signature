import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption, GridStateChange, GridStateType, PaginationService, ServicePagination } from 'angular-slickgrid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  updateQuestion: NgbModalRef;
  private angularGrid: AngularGridInstance;
  questionList: any;

  private gridObj: any;
  private dataViewObj: any;
  private paginationService: PaginationService;
  private filterRequestTimer: any;
  pageNumber: Number;
  pageSize: Number;


  private printText: string;
  private downloadText: string;
  private mtSelected: boolean;

  columnDefinitions: Column[] = [];
  securityQuestion: string;
  showProgress: boolean = false;
  btnName: string = 'Save';
  btnClick: boolean = false;
  securityQuestionId: any;


  edit: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="EDIT"  style="font-size:14px;" class="fa fa-edit pointer btn-outline-dark" aria-hidden="true"></i>';
  };

  delete: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    // return '<button type="button" class="btn-danger px-3"><i title="NO"  style="font-size:14px;" class="fa fa-times pointer btn-danger" aria-hidden="true"></i></button>';
    // if (dataContext.status === 'PENDING') {
    return '<i title="DELETE"  style="font-size:14px; " class="fa fa-trash pointer btn-outline-danger" aria-hidden="true"></i>';
    // }
    // return;
  };
  showGrid: boolean = false;

  appPermission = AppPermission;
  questionConfigList: any;
  questionForm: any;
  constructor(
    private modalService: BsModalService,
    public permissionStoreService: PermissioinStoreService,
    private cs: CommonService) {
    super();
  }


  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    this.prepareGrid();
    this.loadSecurityQuestion();
  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'QUESTION_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }

  ngAfterViewInit(): void {
    this.showGrid = true;
  }

  gridOptions: GridOption = {
    datasetIdPropertyName: 'securityQuestionId',
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
      pageNumber: 1,
      pageSizes: [25, 50, 75, 100, 150, 500],
      pageSize: 25
    },
  };
  prepareGrid() {
    // this.columnDefinitions = this.signatureService.getGridColumn();
    const isFilterable = environment.enableFiltering;
    this.columnDefinitions = [
      {
        id: 'securityQuestion',
        name: 'Security Question',
        field: 'securityQuestion',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        // width: 420,
        // maxWidth: 420,
        // minWidth: 420,
        // params: { useFormatterOuputToFilter: true },
        // formatter: this.directionFormatter,
      },

    ]

    const actionColumn: Column[] = [

      {
        id: 'edit', name: 'Action', field: 'edit',
        formatter: this.edit,
        minWidth: 60, width: 60, maxWidth: 100,
        onCellClick: (e, args) => {
          if (this.permissionStoreService.hasPermission(this.appPermission.ADD_SECURITY_QUESTION)) {
            this.openAddQuestinPopup('Update', args.dataContext);
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
      {
        id: 'delete', name: '', field: 'delete',
        formatter: this.delete,
        minWidth: 40, width: 50, maxWidth: 100,
        onCellClick: (e, args) => {
          if (this.permissionStoreService.hasPermission(this.appPermission.ADD_SECURITY_QUESTION)) {
            // this.openAddQuestinPopup('Delete', args.dataContext);
            this.deleteSequrity('Delete', args.dataContext);
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

    // if (this.cs.hasAnyRole([AppRole.LOAN_AUTHORIZER, AppRole.SUPER_ADMIN])) {
    //     actionColumn.push(...this.columnDefinitions);
    //     this.columnDefinitions = actionColumn;
    //     // this.columnDefinitions = actionColumn.filter(r => r.id !='ok');
    // } else if (this.cs.hasAnyRole([AppRole.CIB_VIEWER])) {
    //     this.columnDefinitions = this.columnDefinitions;
    // }

    actionColumn.push(...this.columnDefinitions);
    this.columnDefinitions = actionColumn;

    console.log(actionColumn);

  }
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
  private handlePaginationChagne(paginationData: ServicePagination) {
    console.log(paginationData);
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

  resetValue() {
    this.securityQuestion = null;
    this.securityQuestionId = null;
    this.btnClick = false;
    this.btnName = null;
    this.showProgress = false;
  }

  loadSecurityQuestion() {
    const payload = {};
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.SecurityQuestion, 'SELECT', payload);
  }

  saveQuestion() {
    debugger
    this.btnClick = true;
    if (!this.securityQuestion) {
      return;
    }
    const payload = {
      securityQuestionId: this.securityQuestionId,
      securityQuestion: this.securityQuestion,
    }
    this.showProgress = true;

    this.cs.sendRequest(this, ActionType.SAVE, ContentType.SecurityQuestion, 'SAVE', payload);
  }

  deleteSequrity(btnName?: string, data?: any) {
    this.btnName = btnName;
    const payload = {
      securityQuestionId: data.securityQuestionId,
    }
    Swal.fire({
      // icon: 'question',
      // title: 'Are you want to delete Secuerity Question?',
      // showConfirmButton: true,
      // confirmButtonText: 'Yes',
      // cancelButtonText: 'No'
      // title: 'Are you want to delete Secuerity Question?',
      title: 'Want to Submit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.DELETE, ContentType.SecurityQuestion, 'SAVE', payload);
      }
    })

  }


  onResponse(service: Service, req: any, response: any) {
    debugger
    if (!super.isOK(response)) {
      //alert(super.getErrorMsg(response));
      Swal.fire(super.getErrorMsg(response));
      return;
    }
    else if (response.header.referance == 'SELECT') {
      this.questionList = response.payload.allQuestion;
      console.log('security question liat', this.questionList);
    }
    else if (response.header.referance == 'SAVE') {
      const saveOrUpdateQuestion = response.payload?.saveOrUpdateQuestion;
      if (saveOrUpdateQuestion) {
        Swal.fire({
          icon: 'success',
          titleText: `Question ${this.btnName} success.`,
          timer: 5000,
        }).then(r => {
          this.closePopup();
        });
      } else {
        Swal.fire({
          icon: 'success',
          titleText: `Question not ${this.btnName}. Please try again.`,
          timer: 5000,
        });
      }
      this.questionList = response.payload.allQuestion;
      console.log('security question liat', this.questionList);
    }

    else if (response.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', response);
      console.log('Reference:', response.header.referance);
      debugger;
      this.questionConfigList = response.payload;
    
      const maxLengthMapping = {
        securityQuestion: 'securityQuestionMaxLength',
       
      };
    
      this.questionConfigList.forEach(config => {
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
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }



  /// popup section
  tooltip: string = 'Close';
  @ViewChild('template') component: any;
  modalRef: BsModalRef;
  openAddQuestinPopup(btnName?: string, data?: any) {
    this.btnName = btnName;
    if (data) {
      this.securityQuestion = data.securityQuestion;
      this.securityQuestionId = data.securityQuestionId;
    }
    debugger
    this.modalRef = this.modalService.show(this.component, {
      animated: true,
      backdrop: 'static',
      class: 'modal-md'
    });

    // this.updateSignature.componentInstance.signatureValue = this.signatureList[0];

    //     this.updateSignature.result.then(result => {
    //         console.log(result);

    //     });
  }

  closePopup() {
    this.modalRef.hide();
    this.resetValue();
  }


}
