import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-security-question-answer',
  templateUrl: './security-question-answer.component.html',
  styleUrls: ['./security-question-answer.component.scss']
})
export class SecurityQuestionAnswerComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  private angularGrid: AngularGridInstance;
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
  question: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    const res = this.questionList?.find((r: any) => {
      return r.securityQuestionId == dataContext.value5;
    });
    dataContext.configVer = res?.securityQuestion;
    return dataContext.configVer;
  };

  questionAnsList: any;
  questionList: any;
  securityQuestionId: any = null;
  securityQuestionAnswer: any;
  configVer: any;
  btnName: string;
  btnClick: boolean = false;
  showProgress: boolean = false;
  configId: any;
  configGroup: string = 'QUESTION';
  configSubGroup: string = 'QUESTION_ANS';
  showGrid = false;

  appPermission = AppPermission;
  questionConfigList: any;
  constructor(
    private modalService: BsModalService,
    public permissionStoreService: PermissioinStoreService,
    private cs: CommonService,
  ) {
    super();
    this.prepareGrid();
  }
  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    this.loadSecurityQuestion();
    this.loadAnswer();
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
    datasetIdPropertyName: 'configId',
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
        id: 'configVer',
        name: 'Security Question',
        field: 'configVer',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { 
          model: Filters.inputText, 
          params: { useFormatterOutputToFilter: true } // Enable filtering based on formatted output
        },
        formatter: this.question,
      },
      
      {
        id: 'value1',
        name: 'Security Question Ans',
        field: 'value1',
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
          this.openAddQuestinAnsPopup('Update', args.dataContext);
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
          if (this.permissionStoreService.hasPermission(this.appPermission.ADD_SECURITY_QUESTION_ANS)) {
            this.deleteSequrityQuesAns('Delete', args.dataContext);
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


  loadSecurityQuestion() {
    const payload = {};
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.SecurityQuestion, 'SELECT', payload);
  }

  resetValue() {
    this.configId = null;
    this.securityQuestionAnswer = null;
    this.securityQuestionId = null;
    this.btnClick = false;
    this.btnName = null;
    this.showProgress = false;
    this.configVer = null;
  }

  loadAnswer() {
    const payload = {
      configGroup: this.configGroup,
      configSubGroup: this.configSubGroup,
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_ANS, ContentType.SConfiguration, 'SELECT_ALL_ANS', payload);
  }


  saveQuestionAns() {
    debugger
    this.btnClick = true;
    if (!this.securityQuestionId || !this.securityQuestionAnswer) {
      return;
    }
    const payload = {
      configId: this.configId,
      securityQuestionId: this.securityQuestionId,
      value1: this.securityQuestionAnswer,
      configGroup: this.configGroup,
      configSubGroup: this.configSubGroup,
    }
    this.showProgress = true;

    this.cs.sendRequest(this, ActionType.SAVE_QUESTION_ANS, ContentType.SConfiguration, 'SAVE_QUESTION_ANS', payload);
  }

  deleteSequrityQuesAns(btnName?: string, data?: any) {
    this.btnName = btnName;
    const payload = {
      securityQuestionId: data.securityQuestionId,
      configId: data.configId,
    }
    Swal.fire({
      title: 'Want to Submit?',
      // title: 'Are you want to delete Secuerity Question Answer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.DELETE, ContentType.SConfiguration, 'SAVE_QUESTION_ANS', payload);
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
    else if (response.header.referance == 'SELECT_ALL_ANS') {
      this.questionAnsList = response.payload;
      console.log('security question liat', this.questionAnsList);
    }
    else if (response.header.referance == 'SAVE_QUESTION_ANS') {
      const res = response.payload;
      if (res) {
        Swal.fire(`Answer ${this.btnName} successful.`).then(r => {
          if(this.btnName != 'Delete'){
            this.closePopup();
          }
          this.loadAnswer();
        });
      } else {
        Swal.fire(`Answer not ${this.btnName}. Please try anain.`)
      }
    }
    else if (response.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', response);
      console.log('Reference:', response.header.referance);
      debugger;
      this.questionConfigList = response.payload;
    
      const maxLengthMapping = {
        securityQuestionAnswer: 'securityQuestionAnswerMaxLength',
   
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
  @ViewChild('template') component: any;
  modalRef: BsModalRef;
  tooltip: string = 'Close';
  openAddQuestinAnsPopup(btnName?: string, data?: any) {

    if (data) {
      console.log(data);
      this.configId = data.configId;
      this.configVer = data.configVer;
      this.securityQuestionId = data.securityQuestionId;
      this.securityQuestionAnswer = data.value1;
    }
    this.btnName = btnName;
    debugger
    this.modalRef = this.modalService.show(this.component, {
      animated: true,
      backdrop: 'static',
      class: 'modal-lg'
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
