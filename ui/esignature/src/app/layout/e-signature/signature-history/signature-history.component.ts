import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, Column, FieldType, Filters, Formatter, GridOption } from 'angular-slickgrid';
import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ViewComponent } from 'src/app/image-view/view/view.component';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare global {
  interface Window {
    openSignature: (row: number) => void;
  }
}
@Component({
  selector: 'app-signature-history',
  templateUrl: './signature-history.component.html',
  styleUrls: ['./signature-history.component.scss']
})
export class SignatureHistoryComponent extends Softcafe implements Service, OnInit, OnDestroy {

  loaderConfig: any = {
    loader: 'twirl', // full list of loaders is provided below
    position: 'right', // options: 'right', 'center', 'left'
    color: 'white',
    background: '#fff',
    padding: '10px', // any supported format
    height: .6, // number relative to input height like 0.9 or 0.25
    opacity: 1,
    speed: 1000, // in milliseconds
    padButton: true, // adds padding to buttons

    // In case any property is not specified, default options are used.
  }

  @Input()
  imageViewTemplate = ViewComponent;

  blockToCamel = blockToCamel;
  columnsDef: Column[];
  // imgFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
  //   return `<img class="col" style="height: 80px; width: 300px;" src ="${dataContext?.base64Image}"></img>`;
  imgFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return `<img class="col" style="height: 80px; width: 300px; cursor: pointer;" src="${dataContext?.base64Image}" onclick="openSignature(${row})"></img>`;
  };



  statusFormater: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if (dataContext?.status === 'APPROVE_DELETE') {
      return `<button class="status-cell btn-danger">Delete</button>`;
    } else if (dataContext?.status === 'PEND_APPROVE') {
      return `<button class="status-cell btn-warning">Waiting for Approve</button>`;
    } else if (dataContext?.isSignatoryActive == 1 && dataContext?.isMainSignature == 1) {
      if(dataContext?.signatureStatus != 'ACTIVE'){
         
        return `<button class="status-cell btn-primary"> ${blockToCamel(dataContext?.signatureStatus)} Master Signature</button>`;
      }
      return `<button class="status-cell btn-primary">Master Signature</button>`;
    }
    return `<button class="status-cell btn-success">${this.blockToCamel(dataContext?.status)}</button>`;
  };
  angularGrid: AngularGridInstance;
  gridObj: any;
  dataViewObj: any;
  height: number = 360;

  gridOptions: GridOption = {
    datasetIdPropertyName: 'signatureInfoId',

    rowHeight: 100,

    enableAutoResize: false,
    explicitInitialization: true,
    enableSorting: true,
    enableRowSelection: true,
    enableCellNavigation: true,
    defaultFilter: true,

    enableFiltering: true,
    autoCommitEdit: true,
    forceFitColumns: true,
  }
  signatureList: any;
  loading: boolean;
  pa: any;
  paList: any;
  showProgress: boolean;
  searchBy: string;
  paName: any;
  employeeId: any;


  public getGridColumn() {
    const isFilterable = environment.enableFiltering;
    const columns: Column[] = [
      {
        id: 'pa',
        name: 'PA',
        field: 'pa',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },

        // width: 120,
        maxWidth: 100,
        // minWidth: 120,
        // resizable: false,
        // focusable: false,
        // selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'name',
        name: 'Name',
        field: 'name',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },


        // width: 160,
        // maxWidth: 160,
        // minWidth: 160,
        // resizable: false,
        // focusable: false,
        // selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'institutionName',
        name: 'Institution Name',
        field: 'institutionName',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        minWidth:150,
        filter: { model: Filters.inputText },
        // width: 160,
        // maxWidth: 160,
        // minWidth: 160,
        // resizable: false,
        // focusable: false,
        // selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        // width: 220,
        // maxWidth: 220,
        minWidth: 170,
        // resizable: false,
        // focusable: false,
        // selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'signatureCreateDate',
        name: 'Signature Create Date',
        field: 'signatureCreateDate',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        minWidth:150,
        filter: { model: Filters.inputText },
        // width: 220,
        // maxWidth: 220,
        // minWidth: 220,
        // resizable: false,
        // focusable: false,
        // selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'status',
        name: 'Status',
        field: 'status',
        sortable: true,
        filterable: isFilterable,
        type: FieldType.text,
        formatter: this.statusFormater,
        cssClass: 'status_field',
        // width: 220,
        minWidth: 190,
        // minWidth: 220,


      },
      {
        id: 'img',
        name: 'Signature Image',
        field: 'img',
        sortable: true,
        type: FieldType.text,
        formatter: this.imgFormatter,
        width: 300,
        maxWidth: 300,
        minWidth: 300,
      },


    ];
    return columns;
  }

  appPermission = AppPermission;

  constructor(private cs: CommonService,
    public permissionService: PermissioinStoreService,
    private cd: ChangeDetectorRef,
    private ngModel: NgbModal
  ) {
    super();
  }


  ngOnInit(): void {
    this.columnsDef = this.getGridColumn();
    this.getScreenSize();
    window.openSignature = this.openSignature.bind(this);
  }


  ngOnDestroy(): void {
    if (this.angularGrid) {
      this.angularGrid.destroy();
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // this.getScreenSize();

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

  }

  searchByPa = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length === 1 || (term.length > 1 && !this.paList?.length)) {
          return timer(1000).pipe(
            switchMap(() => this.searchPa(term) || of([])) // Delayed execution
          );
        }
        else if (this.paList.length) {
          return of(this.buildPaHead(term)); // Immediate execution
        } else {
          return of([]);
        }
      })
    );
  searchPa(e): any {

    this.showProgress = true;
    this.searchBy = 'pa';
    debugger
    console.log('enter Pa is: ', e);
    const payload = {
      pa: e,
      name: e,
    }
    // this.cs.sendRequest(this, ActionType.SEARCH_PA_NAME, ContentType.Signatory, 'SEARCH_PA', payload);
    this.cs.sendRequest(this, ActionType.SEARCH_PA_NAME_HISTOTY, ContentType.SignatureInfo, 'SEARCH_PA', payload);

    return of([]);
  }
  selectedPa(item: any) {
    debugger
    const sV = item.item?.split('(');
    const selectedPa = sV[0];
    const e = sV[1]?.split('-')[1];
    const selectedEmp = e?.substring(0, e?.length - 1).trim();
    // const selectedPa = item.item?.split('(')[0];
    // const selectedEmp = item.item?.split('-')[0];
    // const selectedPa = item.item;☻
    console.log('selected name is: ', selectedPa);
    this.pa = selectedPa;
    this.employeeId = selectedEmp;
    this.searchSignature();
  }
  searchSignature() {
    if (this.showProgress) {
      return;
    }
    else {
      this.showProgress = true;
    }
    debugger
    const payload = {
      pa: this.pa,
      employeeId: this.employeeId,
    };
    this.searchBy = 'btn';

    this.cs.sendRequest(this, ActionType.SEARCH_HISTORY, ContentType.SignatureInfo, 'SEARCH_HISTORY', payload);
  }
  buildPaHead(term: string): string[] {
    debugger
    return this.paList
      ?.filter(f =>
      (f.pa?.toLowerCase().includes(term.toLowerCase()) ||
        f.name?.toLowerCase().includes(term.toLowerCase()))
      )
      ?.slice(0, 10)
      ?.map(m => `${m.pa}( ${m.name}-${m.employeeId} )`)
      ?? [];
    // return this.paList?.filter(f => f.pa?.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10)
    //   ?.map(m => m.pa);
  }
  onResponse(service: Service, req: any, res: any) {
  
    this.employeeId = '';
    debugger
    this.showProgress = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'SEARCH_HISTORY') {
      
      this.signatureList = res.payload;
      console.log('all signature is, ', this.signatureList);
      if(!this.signatureList?.length){
        Swal.fire('Signature history is not found.');
      }
      this.cd.detectChanges();

    }
    else if (res.header.referance === 'SEARCH_PA') {
      this.showProgress = false;
      this.paList = res.payload;
      console.log('all pa list is: ', this.paList);

    }
  }
  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.pa = '';
    this.employeeId = '';
    throw new Error('Method not implemented.');
  }

  width: number;
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.height = window.innerHeight * 0.7;
    this.width = document.getElementById('temp')?.offsetWidth;
    let gr = document.getElementById('signatureGridHistory');
    debugger
    if (gr) {
      gr.style.width = this.width + 'px';
      this.angularGrid.slickGrid.resizeCanvas();
    }

  }




  openSignatureView(signatureInfo: any, imageSrc: string) {
    debugger
    if (signatureInfo) {
      let res = this.ngModel.open(this.imageViewTemplate, { size: 'xl', backdrop: 'static' });
      res.componentInstance.isView = true;
      res.componentInstance.isPublic = false;
      res.componentInstance.imageSrc = imageSrc;
      res.componentInstance.signatureInfo = signatureInfo;
    } else {
      return;
    }
  }


  openSignature(row: number) {
    const item = this.dataViewObj.getItem(row);
    this.openSignatureView(item, item?.base64Image);
  }
}
