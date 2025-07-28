import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { checkNullValue } from 'src/app/service/BlockToCamel';
import { FileDownloaderService } from 'src/app/service/file-downloader.service';
import { DownloadInfoComponent } from 'src/app/shard-module/download-info/download-info.component';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { INSTITUTION_TYPE, InstitutionType } from '../../admin/moder/institution_type';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-signature-download',
  templateUrl: './signature-download.component.html',
  styleUrls: ['./signature-download.component.scss']
})
export class SignatureDownloadComponent extends Softcafe implements Service, OnInit {
  bankType: any = '';
  institutionId: null;
  selectedInstitutionName: string;
  institutionList: any;

  insType: string = '';

  institutionTypeList: InstitutionType[] = INSTITUTION_TYPE;
  employeeId: any;
  paList: any[] = [];
  showProgress: boolean;
  searchBy: string;
  bownloadBtnClick: boolean = false;
  progress: number = 1;
  signatureInfo: any;
  name: any;

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
  nameList: any;
  pa: string;
  downloadType: any = '';
  isDownload: boolean = false;
  loading: boolean = false;

  constructor(private cs: CommonService,
    public fileDown: FileDownloaderService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  selectionChange(value: string) {
    debugger
    if (value === 'EXTERNAL_USER') {
      // this.loadInstitution();
      this.institutionId = null;
    }
    else {
      let selectedInstitutionId = this.cs.loadLoginUser()?.institutionId;
      this.institutionId = selectedInstitutionId;
    }
  }
  searchByPaEmp = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      map(term => term.length < 1 ? this.paList.length = 0 : (term.length >= 2 && this.paList?.length == 0) ? this.searchPaOrEmpId(term)
        : this.buildPaEmpHead(term)
      )
    );
  searchPaOrEmpId(e) {
    debugger
    this.showProgress = true;
    this.searchBy = 'pa';
    this.searchBy = 'employeeId';
    debugger
    console.log('enter Pa is: ', e);
    const payload = {
      pa: e,
      employeeId: e,
      institutionId: this.institutionId,
    }

    this.cs.sendRequest(this, ActionType.SEARCH_PA_EMP, ContentType.SignatureInfo, 'SEARCH_PA', payload);
  }

  buildPaEmpHead(term: string): string[] {
    debugger
    return this.paList
      ?.filter(f =>
        f.pa?.toLowerCase().includes(term.toLowerCase()) ||
        f.employeeId?.toLowerCase().includes(term.toLowerCase())
      )
      ?.slice(0, 10)
      ?.map(m => {
        if (m.pa?.toLowerCase().includes(term.toLowerCase())) {
          return `${m.employeeId}( ${m.pa} )`;
        } else if (m.employeeId?.toLowerCase().includes(term.toLowerCase())) {
          return m.employeeId;
        }
        return '';
      })
      ?? [];
  }

  selectedEmployeeId(item: any) {
    debugger;
     let selectedEmployeeId;
    if(item.item.includes('(')){
      selectedEmployeeId = item.item.split('(')[0];
    }else{
      selectedEmployeeId = item.item;
    }
    console.log('selected employee ID is: ', selectedEmployeeId);
    this.employeeId = selectedEmployeeId;
    this.searchExternalSignature();
  }

  searchByName = (name$: Observable<string>) =>
    name$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      switchMap(
        term => {
          if (term === '') {
            return of([]);
          } else {
            if (term.length > 1 && term.length === 2) {
              return this.searchName(term) || of([]);
            } else if (term.length > 2 && this.nameList?.length) {
              return of(this.buildNameHead(term));
            } else {
              return of([]);
            }
          }
        }
      )
    );


  buildNameHead(term: string): string[] {

    return this.nameList?.filter(f => f.name.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10)
      ?.map(m => {
        if (this.bankType === 'INTERNAL_USER') {
          return `${m.name} (${m.pa})`;
        }
        else if (this.bankType === 'EXTERNAL_USER') {
          return `${m.name} (${m.employeeId})`;
        }

      })

  }

  searchName(name: string): any {
    this.showProgress = true;
    this.searchBy = 'name';
    debugger
    console.log('name : ', name);
    const payload = {
      name: name,
      ownInstitution: this.bankType === 'INTERNAL_USER' ? 1 : 0,
      institutionId: this.bankType === 'INTERNAL_USER' ? null : this.institutionId,

    }

    this.cs.sendRequest(this, ActionType.SEARCH_NAME, ContentType.SignatureInfo, 'SEARCH_NAME', payload);
    return of([]);
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

  buildPaHead(term: string): string[] {
    return this.paList?.filter(f => f.pa?.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10)
      ?.map(m => m.pa);
  }

  selectedPa(item: any) {
    debugger
    const selectedPa = item.item;
    console.log('selected name is: ', selectedPa);
    this.name = null;
    this.pa = selectedPa;
    this.searchSignature();
  }

  searchPa(e): any {
    this.showProgress = true;
    this.searchBy = 'pa';
    debugger
    console.log('enter Pa is: ', e);
    const payload = {
      pa: e,
      ownInstitution: 1,
    }

    this.cs.sendRequest(this, ActionType.SEARCH_PA, ContentType.SignatureInfo, 'SEARCH_PA', payload);
    return of([]);
  }
  selectedName(item: any) {
    const selectedName: string = item.item;
    const identifier = selectedName.substring(selectedName.indexOf('(') + 1, selectedName.length - 1);
    console.log('selected name is: ', selectedName);

    if (this.bankType === 'INTERNAL_USER') {
      this.pa = identifier;
      this.name = selectedName;
      this.searchSignature();
    } else if (this.bankType === 'EXTERNAL_USER') {
      this.employeeId = identifier;
      this.name = selectedName;
      this.searchExternalSignature();
    }
  }

  searchSignature() {
    if (this.showProgress) {
      return;
    }
    else {
      this.showProgress = true;
    }
    debugger
    // this.imageSrc = null;
    this.signatureInfo = null;
    const payload = {
      pa: this.pa,
      name: this.name,
      ownInstitution: 1,
    };
    // this.viewConfigValue.length = 0;
    this.searchBy = 'btn';
    // this.loading = true;

    this.cs.sendRequest(this, ActionType.SEARCH, ContentType.SignatureInfo, 'SEARCH2', payload);
  }
  searchExternalSignature() {
    debugger
    if (this.showProgress) {
      return;
    }
    else {
      this.showProgress = true;
    }
    debugger
    this.signatureInfo = null;
    const payload = {
      employeeId: this.employeeId,
      name: this.name,
      ownInstitution: 0,
      institutionId: this.institutionId,
    };
    // this.viewConfigValue.length = 0;
    this.searchBy = 'btn';
    // this.loading = true;

    this.cs.sendRequest(this, ActionType.SEARCH2, ContentType.SignatureInfo, 'SEARCH2', payload);
  }

  @Input()
  private downloadComponet = DownloadInfoComponent;
  downloadFullOpen() {
    this.openPopup(true);
  }
  openPopup(isFull: boolean = false) {
    const comRef = this.modalService.open(this.downloadComponet, { size: 'lg', backdrop: 'static' });
    comRef.result.then(res => {
      debugger
      const payload = res;
      if (typeof payload === 'string' || payload instanceof String) {
        return;
      }
      this.downloadSignature(isFull, payload);
    });

  }

  // downloadFull() {
  //   this.searchBy = 'full';

  //   this.downloadSignature(true);
  // }

  downloadSignature(isFull: boolean, payload: any) {
    debugger
    if (this.bownloadBtnClick) {
      return;
    }

    if (!isFull && !this.signatureInfo && !this.signatureInfo.pa) {
      return;
    }
    let formData = new FormData();
    formData.append('documentDate', checkNullValue(payload.documentDate));
    formData.append('institutionName', payload.institutionName ?? '');
    formData.append('referralNumber', payload.referralNumber ?? '');
    formData.append('remark', payload.remark ?? '');
    if (payload.file) {
      const f = payload.file;
      if (Array.isArray(f)) {
        f.forEach(e => {
          formData.append('file', e);
        });
      } else {
        formData.append('file', f);
      }
    }
    if (this.signatureInfo) {
      formData.append('signatoryId', this.signatureInfo.signatoryId ?? '')
      formData.append('signatureId', this.signatureInfo.signatureId ?? '')
      formData.append('institutionId', this.signatureInfo.institutionId ?? '')
    }
    if (isFull) {
      formData.append('downloadType', 'FULL');
    } else {
      formData.append('downloadType', 'SINGLE');
    }
    this.progress = 0;
    let fileName = 'esig.jar';

    const signatureId = this.signatureInfo?.signatureId ?? '';
    const userId = this.cs.loadLoginUser()?.userId;
    this.showProgress = true;
    this.bownloadBtnClick = true;
    this.fileDown.downloadSignature(`download/signature?signatureId=${signatureId}&userId=${userId}`, formData).subscribe(
      {
        next: (event: any) => {
          
          if (event.type === HttpEventType.ResponseHeader) {
            const contentDisposition = event.headers.get('content-disposition');
            if (contentDisposition) {
              const matches = contentDisposition.match(/filename="([^"]+)"/);
              if (matches && matches.length > 1) {
                fileName = matches[1];
              }
            }
            // const contentLengthHeader = event.headers.get('content-length');
            // if (contentLengthHeader) {
            //   const totalSize = parseInt(contentLengthHeader, 10); // Convert to number
            //   this.progress = Math.round((event.loaded ?? 1 * 100) / totalSize);
            // }
          }
          else if(event.type === HttpEventType.UploadProgress){
            this.progress = 1; 
          }
          else if (event.type === HttpEventType.DownloadProgress) {
            this.progress = Math.round((event.loaded * 100) / event.total);
          } else if (event.type === HttpEventType.Response) {
            const blob = new Blob([event.body], { type: event.headers.get('content-type') });
            this.bownloadBtnClick = false;
            this.showProgress = false;
            this.isDownload = false;
            this.progress == 100;
            saveAs(blob, fileName);
          }
        },
        error: (error: any) => {
          this.bownloadBtnClick = false;
          this.showProgress = false;
          this.isDownload = false;
          Swal.fire({ title: 'Error', icon: 'error', text: 'Failed to download.' });
        }
      }
      
    );
  }

  loadInstitution(ref?: string) {
    this.institutionId = null;
    this.selectedInstitutionName = '';
    debugger
    // this.insType = ref ?? '';
    let payload: any = {
      type: ref ?? '',
    };
    this.loading = true;

    this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Institution, 'SELECT_ALL_INSTITUTION', payload);
  }
  getInstitutionId() {
    debugger
    const selectedInstitutionId = this.institutionList.find(f => f.institutionName === this.selectedInstitutionName)?.institutionId;
    console.log('selectedInstitutionId', selectedInstitutionId);
    this.institutionId = selectedInstitutionId;
  }

  getInstitutionIdS(event: any) {
    this.institutionId = event.institutionId;
    console.log('selectedInstitutionId', this.institutionId);
}
dropdownSettingsInstitution: IDropdownSettings = {
  singleSelection: true,
  idField: 'institutionId',
  textField: 'institutionName',
  allowSearchFilter: true,
  closeDropDownOnSelection: true,
  searchPlaceholderText: 'Search Institution',
  noDataAvailablePlaceholderText: 'No institution found',
};

  onResponse(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.loading = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    } else if (res.header.referance === 'SELECT_ALL_INSTITUTION') {
      this.institutionList = res.payload;
      if (this.institutionList?.length <= 0) {
        Swal.fire({
          icon: 'info',
          title: 'Institution Not Found.',
          text: 'Please Add Institution First.',
          color: '#df4000',
          background: '#a4fd4a',
          iconColor: '#f0f0f0',
        });
      }
    } else if (res.header.referance === 'SEARCH_PA') {
      this.paList = res.payload;
      console.log('all pa list is: ', this.paList);

    } else if (res.header.referance === 'SEARCH2') {

      console.log(res.payload);
      if (res.payload) {
        this.signatureInfo = res.payload;
        this.isDownload = true;
        // this.activityLogService.saveSignatureActivity(ActivityType.VIEW_SIGNATURE, this.signatureInfo.signatureId, this.user?.email);
        // this.downloadSignature();
        this.openPopup();

      }
    } else if (res.header.referance === 'SEARCH_NAME') {
      this.nameList = res.payload;
      console.log('all name list is: ', this.nameList);

    }

  }
  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
    throw new Error('Method not implemented.');
  }

}
