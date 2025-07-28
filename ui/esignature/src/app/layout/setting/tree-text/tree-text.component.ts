import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption } from 'angular-slickgrid';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tree-text',
  templateUrl: './tree-text.component.html',
  styleUrls: ['./tree-text.component.scss']
})
export class TreeTextComponent extends Softcafe implements OnInit, Service {


  @Input() popUpComponent = PopUpComponent;

  actionColumnWidth: number = 10;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  showGrid: boolean = true;
  modalRef: NgbModalRef;
  freetextList: any;

  constructor(private modal: NgbModal, private cs: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.gridOptions = this.buildGridOptions();
    this.prepareGrid();
    this.loadFreeText();

  }

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="view"  style="font-size:14px;"  class="fa fa-eye pointer" aria-hidden="true"></i>'
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="edit"  style="font-size:14px;"  class="fa fa-edit pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="delete"  style="font-size:14px;"  class="fa fa-trash pointer" aria-hidden="true"></i>'
  };
  innerHtmlBody: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    return '<i title="edit"  style="font-size:14px;">' + dataContext.body + '</i>'
  };
  innerHtmlSubject: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {

    return '<i title="edit"  style="font-size:14px;">' + dataContext.subject + '</i>'
  };

isFilterable = environment.enableFiltering;
  colDef = [
    {
      id: 'delete',
      name: '',
      field: 'delete',
      formatter: this.deleteIcon,
      minWidth: 20,
      width: this.actionColumnWidth,
      maxWidth: 50,
      toolTip: "Delete User",
      // onCellClick: (e, args) => { this.onDelete(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'view',
      name: '',
      field: 'view',
      formatter: this.viewIcon,
      minWidth: 25,
      width: this.actionColumnWidth,
      maxWidth: 50,
      toolTip: "Update User",
      // onCellClick: (e, args) => { this.onView(e, args) },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'edit',
      name: '',
      field: 'edit',
      formatter: this.editIcon,
      minWidth: 25,
      width: this.actionColumnWidth,
      maxWidth: 50,
      toolTip: "Update User",
      onCellClick: (e, args) => {
        this.onEdit(e, args)
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
      id: 'subject',
      name: 'Subject',
      field: '',
      formatter: this.innerHtmlSubject,
      sortable: true,
      type: FieldType.text,
      filterable: this.isFilterable,
      filter: { model: Filters.inputText, },
    },
    {
      id: 'body', name: 'Body', field: '', formatter: this.innerHtmlBody,
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
    },
    {
      id: 'type', name: 'Type', field: 'type',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText, },
    },
    {
      id: 'textGroup', name: 'Group', field: 'textGroup',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
    },
    {
      id: 'status', name: 'Status', field: 'status',
      sortable: true, type: FieldType.text,
      filterable: this.isFilterable, filter: { model: Filters.inputText },
    }
  ];

  buildGridOptions() {
    var menuOrder = 60;
    var option: GridOption = {
      datasetIdPropertyName: "freeTextId",
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

        commandItems:
          [
            // 'divider',
            // { divider: true, command: '', positionOrder: 60 },
            {
              command: 'Approve', title: 'Approve Free Text', positionOrder: 61, iconCssClass: 'fa fa-check-square-o bg-rad',
              // you can use the "action" callback and/or use "onCommand" callback from the grid options, they both have the same arguments
              action: (e, args) => {
                console.log(args.dataContext, args);
                this.requestForApprove(args.dataContext);
              },
              itemUsabilityOverride: (args) => {
                return args.dataContext!.status == 'PENDING';
              },
              itemVisibilityOverride: (args) => {
                return this.checkUserRole();//check the user role
              },
              disabled: !this.checkUserRole(),
              // divider: 'true',
            },
            'divider',
            { divider: true, command: '', positionOrder: 60 },
            { command: 'help', title: 'HELP', iconCssClass: 'fa fa-question-circle', positionOrder: 62 }
          ],
        onOptionSelected: (e, args) => {

          const dataContext = args && args.dataContext;
          debugger
          console.log('data context ', dataContext);

          if (dataContext && dataContext.hasOwnProperty('priority')) {
            dataContext.priority = args.item.option;
            this.angularGrid.gridService.updateItem(dataContext);
          }
        },
      },
      presets: {},
      enableHeaderMenu: true,
      // headerMenu: {
      //   hideFreezeColumnsCommand: false
      // },
      headerMenu: {
        autoAlign: true,
        autoAlignOffset: 12,
        minWidth: 140,
        iconClearFilterCommand: 'fa fa-filter text-danger',
        iconClearSortCommand: 'fa fa-unsorted',
        iconFreezeColumns: 'fa fa-thumb-tack',
        iconSortAscCommand: 'fa fa-sort-amount-asc',
        iconSortDescCommand: 'fa fa-sort-amount-desc',
        iconColumnHideCommand: 'fa fa-times',
        iconColumnResizeByContentCommand: 'fa fa-arrows-h',
        hideColumnResizeByContentCommand: false,
        hideColumnHideCommand: false,
        hideClearFilterCommand: false,
        hideClearSortCommand: false,
        hideFreezeColumnsCommand: true, // opt-in command
        hideSortCommands: false
      },
      headerRowHeight: 40,
      multiColumnSort: true,
      numberedMultiColumnSort: true,
      tristateMultiColumnSort: false,
      sortColNumberInSeparateSpan: true,
      suppressActiveCellChangeOnEdit: false,

      columnPicker: {
        onColumnsChanged: (e, args) => {
          console.log(args);

        }
      },
      gridMenu: {
        hideClearFrozenColumnsCommand: false,
        hideExportCsvCommand: false,
        customItems: [
        ],


      }
    }
    return option;
  }
  requestForApprove(dataContext: any) {

    const payload = dataContext;

    this.cs.sendRequest(this, ActionType.APPROVE, ContentType.FreeText, 'SELECT_ALL', payload);
  }


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);
  }

  prepareGrid() {

    // if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.DELETE_MAIL_TEMPLATE)
    // ) {
    //   this.colDef = this.colDef.filter(x => x.id != 'delete');
    // }
    // if (!this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.SAVE_MAIL_TEMPLATE)
    // ) {
    //   this.colDef = this.colDef.filter(x => x.id != 'edit');
    // }

    this.columnDefinitions = this.colDef;

    // this.dataset = this.customerConfigList;
  }


  checkUserRole(): boolean {//this mathod check active user role
    return true;
  }

  onEdit(e: any, args: any) {
    const payload = args.dataContext;
    this.openPopup(payload);
  }


  openPopup(data?: any) {
    debugger
    this.modalRef = this.modal.open(this.popUpComponent, { size: <any>'xl' });
    this.modalRef.componentInstance.data = data ?? 'hi its me free text';
    this.modalRef.result.then(result => {
      this.freetextList = result.freetextList ?? this.freetextList;
    });
  }

  loadFreeText() {
    const payload = {};
    this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.FreeText, 'SELECT_ALL', payload);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!res.header.referance) {
      throw new Error('Method not implemented.');
    }
    else if (res.header.referance == 'SELECT_ALL') {
      this.freetextList = res.payload;
      console.log(this.freetextList);

    }
  }


  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
