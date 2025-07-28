import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

import { ActivatedRoute } from '@angular/router';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';

import { HttpEventType } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, forkJoin, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ViewComponent } from 'src/app/image-view/view/view.component';
import { blockToCamel, checkNullValue } from 'src/app/service/BlockToCamel';
import { FileDownloaderService } from 'src/app/service/file-downloader.service';
import { DownloadInfoComponent } from 'src/app/shard-module/download-info/download-info.component';
import { SigViewSetupValue } from 'src/app/softcafe/constants/sig-view-setup-value';
import { ActivityLogService } from '../../activity-log/activity-log.service';

@Component({
  selector: 'app-e-signature-view',
  templateUrl: './e-signature-view.component.html',
  styleUrls: ['./e-signature-view.component.scss'],
})
export class ESignatureViewComponent extends Softcafe implements OnInit, Service, AfterViewInit {


  @ViewChild('container') 'container': ElementRef;
  @ViewChild('img') 'img': ElementRef;

  // imageSrc: any = 'assets/images/slider2.jpg';
  imageSrc: any = null;
  // imageSrc: any;
  pa: string;
  employeeId: string;
  name: string;
  viewConfigValue: SigViewSetupValue[] = [];

  isZoomed = false;
  loading: boolean = false;
  pos = { top: 0, left: 0, x: 0, y: 0 };
  showProgress: boolean = false;
  signatureInfo: any;
  signatoryList: any;
  signatoryId: any;

  signatureSearchForm = this.fb.group({
    accountId: '',
    signatoryId: [''],

  });
  paList: any[] = [];
  empList: any[] = [];
  nameList: any[] = [];
  appPermission = AppPermission;
  agreement: string = 'agreement';
  agreementValue: string;
  INTERNAL_USER: string = 'INTERNAL_USER';

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
  inputLoaderConfig: any = {
    loader: 'twirl', // full list of loaders is provided below
    position: 'right', // options: 'right', 'center', 'left'
    color: '#005cbf',
    background: '#fff',
    padding: '10px', // any supported format
    height: .6, // number relative to input height like 0.9 or 0.25
    opacity: 1,
    speed: 1000, // in milliseconds
    padButton: true, // adds padding to buttons

    // In case any property is not specified, default options are used.
  }
  searchBy: any;
  contractUserInfo: any;
  progress: number;
  bownloadBtnClick: boolean = false;
  requestFrom: string;
  employeeIdList: any;
  blockToCamel = blockToCamel;
  institutionList: any[] = [];
  selectedInstitutionName: any;
  institutionId: any;

  constructor(private cs: CommonService,
    private fb: FormBuilder,
    // private router: Router,
    private location: Location,
    public permissionStorageService: PermissioinStoreService,
    private route: ActivatedRoute,
    private activityLogService: ActivityLogService,
    private ngModel: NgbModal,
    public fileDown: FileDownloaderService,
    private modalService: NgbModal,


  ) {
    super();
    debugger
    this.requestFrom = route.snapshot.url[0]['path'];
  }


  user: any;
  ngOnInit() {
    this.loading = true;
    this.user = this.cs.loadLoginUser();
    const user = this.user;
    this.agreementValue = localStorage.getItem(this.agreement);
    // this.loadSignatory();
    debugger
    // const btnRef = this.router.snapshot?.data;
    if (user?.roleList[0]?.roleName === 'SUPER_ADMIN' || this.cs.forceAllow()) {
      console.log('ok');

    }
    else if (user?.userType != this.INTERNAL_USER) {
      const btnRef = this.route.snapshot?.paramMap?.get(this.agreement);

      if (this.agreementValue) {
        if (btnRef && btnRef === 'true') {
          console.log('ok');
        } else {
          if (this.agreementValue == 'true') {
            console.log('ok');
          }
        }
      } else {
        this.location.back();
      }
    }
    // else {
    //     this.location.back();
    //   }

    if (this.requestFrom === 'external') {
      forkJoin([this.loadInstitution()])
        .subscribe((res: any) => {
          this.institutionList = res[0]?.payload;
          console.log('institution', this.institutionList);

          debugger
          if (this.permissionStorageService.hasPermission(this.appPermission.HR_ROLE) && !this.cs.forceAllow()) {
            this.institutionList = this.institutionList.filter(m => m.institutionName.toUpperCase().includes('PRIME BANK'));
          }
          this.loading = false;
        });
    }
  }

  loadInstitution() {
    const payload = {
      // institutionId: this.user?.institutionId,
    }
    return this.cs.execute(ActionType.SEARCH_EX_INSTITUTION, ContentType.Institution, payload);
  }

  formateDate(dt: string) {
    try {
      const [day, month, year] = dt.split(' ')[0].split('-'); // Extract day, month, year
      return new Date(+year, +month - 1, +day);
    } catch (_) {
      return dt;
    }
  }

  getInstitutionId() {
    debugger
    const selectedInstitutionId = this.institutionList.find(f => f.institutionName === this.selectedInstitutionName)?.institutionId;
    console.log('selectedInstitutionId', selectedInstitutionId);
    this.institutionId = selectedInstitutionId;
  }

  decelect() {
    this.institutionId = null;
    this.selectedInstitutionName = null;
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
    noDataAvailablePlaceholderText: 'No institution found'
  };

  resetNameField(): void {
    this.name = '';
  }

  resetPaField(): void {
    this.pa = '';
  }


  ngAfterViewInit(): void {
    this.loadContractInfo();
  }
  loadContractInfo() {
    const payload = {
      configGroup: `SIG_AD_INFO_GROUP`,
      configSubGroup: `SIG_AD_INFO_SUBGROUP`,
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_APP_AD_INFO, ContentType.SConfiguration, 'CONTRACT_USER_INFO', payload);
  }

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'signatoryId',
    textField: 'name',
    limitSelection: 1,
    noFilteredDataAvailablePlaceholderText: 'Sorry no data available.',
    noDataAvailablePlaceholderText: 'Data not found.',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  loadSignatory() {
    const payload = {};
    this.cs.sendRequest(this, ActionType.SELECT_ALL, ContentType.Signatory, 'SELECT', payload);
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

  searchName(name: string): any {
    this.showProgress = true;
    this.searchBy = 'name';
    console.log('name : ', name);
    const payload = {
      name: name,
      ownInstitution: this.requestFrom === 'internal' ? 1 : 0,
      institutionId: this.requestFrom === 'internal' ? null : this.institutionId,

    }

    this.cs.sendRequest(this, ActionType.SEARCH_NAME, ContentType.SignatureInfo, 'SEARCH_NAME', payload);
    return of([]);
  }

  // auto suggest for pa or empId
  searchByPaEmp = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      map(term => term.length < 1 ? this.paList.length = 0 : (term.length >= 2 && this.paList?.length == 0) ? this.searchPaOrEmpId(term)
        : this.buildPaEmpHead(term)
      )
    );


  searchPaOrEmpId(e) {
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


  //

  searchSignature() {
    // if (!/^[A-Za-z\s.]+$/.test(this.name) && !this.pa) {
    //   Swal.fire('Only alphabets and dots are allowed in the Name field.');
    //   return;
    // }
    if (this.showProgress) {
      return;
    }
    else {
      this.showProgress = true;
    }
    debugger
    this.imageSrc = null;
    this.signatureInfo = null;
    const payload = {
      pa: this.pa,
      name: this.name,
      ownInstitution: 1,
    };
    this.viewConfigValue.length = 0;
    this.searchBy = 'btn';
    this.loading = true;

    this.cs.sendRequest(this, ActionType.SEARCH, ContentType.SignatureInfo, 'SEARCH', payload);
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
    this.imageSrc = null;
    this.signatureInfo = null;
    const payload = {
      employeeId: this.employeeId,
      name: this.name,
      ownInstitution: 0,
      institutionId: this.institutionId,
    };
    this.viewConfigValue.length = 0;
    this.searchBy = 'btn';
    this.loading = true;

    this.cs.sendRequest(this, ActionType.SEARCH2, ContentType.SignatureInfo, 'SEARCH2', payload);
  }

  loadViewConfigValue() {
    debugger
    if (this.user.roleList[0]?.roleName === 'SUPER_ADMIN') {
      this.viewConfigValue = SigViewSetupValue.getSetupList();
    }
    else {
      const payload = {
        value5: this.user!.userType,
      }

      this.cs.sendRequest(this, ActionType.SELECT_VIEW_SETUP, ContentType.SConfiguration, 'select-config', payload);
    }
  }

  buildValue(value: any[]) {

    this.viewConfigValue = this.filteringValue(value);
    // if (this.signatureInfo) {
    //   this.buildViewingInfo();
    // }

  }

  buildViewingInfo() {
    this.viewConfigValue.forEach((v: SigViewSetupValue) => {
      // if(!Object.values(v.value).includes(this.signatureInfo[v.value])){
      delete this.signatureInfo[v.value];
      // }
    })
  }
  filteringValue(value: any[]): any[] {
    let a: any[] = [];
    let fList = JSON.parse(JSON.stringify((SigViewSetupValue.getSetupList())));
    value.forEach(v => {
      const index = fList.findIndex(l => l.value === v.value1);
      if (index !== -1) {
        a.push(fList[index]);
        fList.splice(index, 1);
      }
    });
    return a;
  }


  onClick(e) {
    debugger
    console.log(e.clientY, e.clientX);
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      this.container.nativeElement.style.overflow = 'hidden';
      this.img.nativeElement.style.width = '200%';
      this.img.nativeElement.style.height = '200%';
      this.img.nativeElement.style.cursor = 'zoom-out';
      this.img.nativeElement.style.left = `-${e.clientX}`;
      this.img.nativeElement.style.top = `-${e.clientY}`;
    } else {
      this.container.nativeElement.style.overflow = 'hidden';
      this.img.nativeElement.style.width = '100%';
      this.img.nativeElement.style.height = '100%';
      this.img.nativeElement.style.cursor = 'zoom-in';
    }
  }
  onMouseDown(e) {
    this.pos = {
      // The current scroll
      left: this.container.nativeElement.scrollLeft,
      top: this.container.nativeElement.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };
  }

  mouseMoveHandler(e) {
    // How far the mouse has been moved
    const dx = (e.clientX - this.pos.x) * 2;
    const dy = (e.clientY - this.pos.y) * 2;

    // Scroll the element
    this.container.nativeElement.scrollTop = this.pos.top - dy;
    this.container.nativeElement.scrollLeft = this.pos.left - dx;
    //   this.container.nativeElement.scrollTop = this.container.nativeElement.scrollTop - dy;
    //   this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft - dx;
  }

  onLeave() {
    this.container.nativeElement.style.overflow = 'hidden';
    this.img.nativeElement.style.transform = 'scale(1)';
    this.img.nativeElement.style.cursor = 'zoom-in';
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
      this.buildDownloadValue(isFull, payload);
    });

  }

  buildDownloadValue(isFull: boolean, payload: any) {
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
    }
    if (isFull) {
      formData.append('downloadType', 'FULL');
    } else {
      formData.append('downloadType', 'SINGLE');
    }
    this.downloadSignature(formData);
  }

  downloadSignature(formData: FormData) {

    if (this.bownloadBtnClick) {
      return;
    }
    debugger
    if (!this.signatureInfo && !this.signatureInfo.pa) {
      return;
    }
    this.progress = 0;
    let fileName = 'esig.jar';

    let contentLength: number | null = null;
    const signatureId = this.signatureInfo.signatureId;
    const userId = this.cs.loadLoginUser()?.userId;
    this.fileDown.downloadSignature(`download/signature?signatureId=${signatureId}&userId=${userId}`, formData).subscribe(event => {
      this.bownloadBtnClick = true;
      if (event.type === HttpEventType.ResponseHeader) {
        const contentDisposition = event.headers.get('content-disposition');
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="([^"]+)"/);
          if (matches && matches.length > 1) {
            fileName = matches[1];
          }
        }
      } else if (event.type === HttpEventType.DownloadProgress) {
        this.progress = Math.round((event.loaded * 100) / event.total);
      } else if (event.type === HttpEventType.Response) {
        const blob = new Blob([event.body], { type: event.headers.get('content-type') });
        this.bownloadBtnClick = false;
        saveAs(blob, fileName);
      }


      // if (event.type === HttpEventType.ResponseHeader) {
      //   const contentLengthHeader = event.headers.get('content-length');
      //   if (contentLengthHeader) {
      //     contentLength = parseInt(contentLengthHeader, 10);
      //   }
      //   // You can also extract the file name here if needed
      //   fileName = this.getFileName(event?.headers);
      // } else if (event.type === HttpEventType.DownloadProgress && contentLength !== null) {
      //   this.progress = Math.round((event.loaded * 100) / contentLength);
      // } else if (event.type === HttpEventType.Response) {
      //   // Download complete, save the file here
      //   fileName = this.getFileName(event?.headers);
      //   const blob = new Blob([event.body], { type: event.headers.get('content-type') });
      //   saveAs(blob, fileName);
      // }
    });
  }

  onResponse(service: Service, req: any, response: any) {
    this.showProgress = false;
    this.loading = false;
    debugger;
    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response));
      return;
    } else if (response.header.referance === 'SEARCH') {

      console.log(response.payload);
      if (response.payload) {
        this.signatureInfo = response.payload;
        // this.activityLogService.saveSignatureActivity(ActivityType.VIEW_SIGNATURE, this.signatureInfo.signatureId, this.user?.email);
        if (this.signatureInfo) {
          this.loadViewConfigValue();
        }

        // this.imageStatus = 

        // this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
        //          + this.signatureInfo.base64Image);

        // this.imageSrc = 'data:image/jpeg;base64, '+this.signatureInfo.base64Image;
        // console.log('image path is: ', this.imageSrc);

        this.imageSrc = this.signatureInfo.base64Image;

      }
    }
    else if (response.header.referance === 'SEARCH2') {

      console.log(response.payload);
      if (response.payload) {
        this.signatureInfo = response.payload;
        // this.activityLogService.saveSignatureActivity(ActivityType.VIEW_SIGNATURE, this.signatureInfo.signatureId, this.user?.email);
        if (this.signatureInfo) {
          this.loadViewConfigValue();
        }
        this.imageSrc = this.signatureInfo.base64Image;

      }
    }
    else if (response.header.referance === 'SELECT') {
      this.signatoryList = response.payload?.allSignatory;
      console.log(this.signatoryList);
    }
    else if (response.header.referance === 'SEARCH_PA_EMP') {
      this.paList = response.payload;
      console.log('all pa list is: ', this.paList);

    }
    else if (response.header.referance === 'CONTRACT_USER_INFO') {
      // const jsn = response.payload;
      this.contractUserInfo = response.payload;
    }
    else if (response.header.referance === 'SEARCH_PA') {
      this.paList = response.payload;
      console.log('all pa list is: ', this.paList);

    }
    else if (response.header.referance === 'SEARCH_EMP_ID') {
      this.empList = response.payload;
      console.log('all emp list is: ', this.empList);

    }
    else if (response.header.referance === 'SEARCH_NAME') {
      this.nameList = response.payload;
      console.log('all name list is: ', this.nameList);

    }
    else if (response.header.referance === 'select-config') {
      const value = response.payload;
      if (value?.length > 0) {
        this.buildValue(value);
      }
      else {
        this.viewConfigValue = SigViewSetupValue.getSetupList();
      }
    }
  }
  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
    this.loading = false;

    console.log('getting error: ', res);

  }

  // searchByPa = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(1000),
  //     distinctUntilChanged(),
  //     switchMap(term => {
  //       if (term.length === 1 || (term.length > 1 && !this.paList)) {
  //         return this.searchPa(term) || of([]);
  //       } else if (this.paList.length) {
  //         return of(this.buildPaHead(term));
  //       }
  //     })
  //   );

  searchByPa = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
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

  searchByName = (name$: Observable<string>) =>

    name$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(
        term => {
          debugger
          if (!/^[A-Za-z\s.]+$/.test(term) && term) {
            Swal.fire('Only alphabets and dots are allowed in the Name field.');
            return;
          }
          if (term === '') {
            return of([]);
          } else {
            if (term.length === 2 || (term.length > 2 && !this.nameList?.length)) {
              // if (this.nameList?.length < 1 || term.length >= 2) {
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

  buildPaHead(term: string): string[] {
    return this.paList?.filter(f => f.pa?.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10)
      ?.map(m => m.pa);
  }

  buildNameHead(term: string): string[] {

    return this.nameList?.filter(f => f.name.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10)
      ?.map(m => {
        if (this.requestFrom === 'internal') {
          return `${m.name} (${m.pa})`;
        }
        else if (this.requestFrom === 'external') {
          return `${m.name} (${m.employeeId})`;
        }

      })

  }

  // selectedName(item: any) {
  //   debugger
  //   const selectedName: string = item.item;
  //   const pa = selectedName.substring(selectedName.indexOf('(') + 1, selectedName.length - 1);
  //   console.log('selected name is: ', selectedName);
  //   this.pa = pa;
  //   this.name = selectedName;
  //   this.searchSignature();
  // }
  empFormatter = (result: string): string => {
    return result.split('(')[0].trim(); // Show only the name
  };
  nameFormatter = (result: string): string => {
    return result.split('(')[0].trim(); // Show only the name
  };
  selectedName(item: any) {
    const selectedName: string = item.item;
    const identifier = selectedName.substring(selectedName.indexOf('(') + 1, selectedName.length - 1);
    console.log('selected name is: ', selectedName);
    const nameOnly = selectedName.split('(')[0].trim();
    if (this.requestFrom === 'internal') {
      this.pa = identifier;
      this.name = nameOnly;
      this.searchSignature();
    } else if (this.requestFrom === 'external') {
      this.employeeId = identifier;
      this.name = nameOnly;
      this.searchExternalSignature();
    }
    item.item = nameOnly;
  }

  selectedPa(item: any) {
    debugger
    const selectedPa = item.item;
    console.log('selected name is: ', selectedPa);
    this.name = null;
    this.pa = selectedPa;
    this.searchSignature();
  }
  selectedEmployeeId(item: any) {
    debugger;
    const selectedEmployeeId = item.item?.split('(')[0];
    console.log('selected employee ID is: ', selectedEmployeeId);
    this.employeeId = selectedEmployeeId;
    this.searchExternalSignature();
  }

  // Assuming you have searchByEmployeeId method similar to searchByPa
  searchByEmployeeId = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.employeeIdList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  status: string;
  stFormatting(st: string): string {
    this.status = st;
    debugger
    return blockToCamel(st);
  }

  @Input()
  imageViewTemplate = ViewComponent;
  openSignatureView() {
    debugger
    if ((this.signatureInfo && this.signatureInfo?.signatureStatus === 'ACTIVE')) {
      let res = this.ngModel.open(this.imageViewTemplate, { size: 'xl', backdrop: 'static' });
      res.componentInstance.isView = true;
      res.componentInstance.isPublic = false;
      res.componentInstance.imageSrc = this.imageSrc;
      // res.componentInstance.height = this.height;
      res.componentInstance.signatureInfo = this.signatureInfo;
    } else {
      return;
    }

  }


}
