import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { checkNullValue } from 'src/app/service/BlockToCamel';
import { FileService } from 'src/app/service/file.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-popup',
  templateUrl: './request-popup.component.html',
  styleUrls: ['./request-popup.component.scss'],
  providers: [DatePipe]
})
export class RequestPopupComponent extends Softcafe implements OnInit, Service, OnDestroy {

  @Input('isFromView')
  public isFromView: boolean = false;
  @Input('linkInformation')
  public linkInformation: any;
  @Input('ref')
  public ref?: string = 'add';

  tooltip = 'CLOSE';
  linkType: string = null;
  userRequestType: string = null;
  isNewStatus: string = '';
  pageSize: number = 20;
  requestFile: any;
  pageNumber: number = 1;
  name = null;
  pa = null;
  paList: any;

  total: number = 0;
  searchBy: string;
  click: boolean = false;
  showProgress: boolean = false;
  selectedInfo: any;
  selectedInstitutionName: any;

  typeList: any[] = [];
  imageList: any[] = [];
  allList: any = []

  nameList: any;

  institutionList: any = []
  isSuperAdmin: boolean;

  serviceRequestList: string[] = ['SERVICE_REQUEST'];
  userRequestList: string[] = ['USER_CREATION', 'USER_ACTIVATION', 'USER_DEACTIVATION'];
  allTypeList: any = [
    { type: 'Request Of Booklet', value: 'REQUEST_FOR_BOOKLET', ref: false },
    { type: 'Verify Signature', value: 'VERIFY_SIGNATURE', ref: false },
    { type: 'Request Creation', value: 'REQUEST_CREATION', ref: false },
    { type: 'Generate Link', value: 'GENERATE_LINK', ref: false },
    { type: 'Others', value: 'OTHERS', ref: false },
  ];
  reqTypeList: any = [
    { type: 'User Creation', value: 'USER_CREATION' },
    { type: 'User Activation', value: 'USER_ACTIVATION' },
    { type: 'User Deactivation', value: 'USER_DEACTIVATION' },
    { type: 'Service Request', value: 'SERVICE_REQUEST' },
  ];
  linkTypeList: any = [
    { type: 'For User', value: 'FOR_USER' },
    { type: 'For Non User', value: 'FOR_NON_USER' },
  ];

  requestForm = this.fb.group({
    requestId: [null],
    signatoryId: [null],
    pa: [null],
    description: [null],
    type: [null, [Validators.required]],
    requesterEmail: [null],
  });
  type: string = null;

  lnkCreationFrm = this.fb.group({
    requestId: [null],
    pa: ['', [Validators.required]],
    lnkSendingEmail: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]],
    type: [null, [Validators.required]],
    linkType: [null, [Validators.required]],
  });

  userCDForm = this.fb.group({
    employeeId: [null],//user
    name: [null],//user
    email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]],
    nid: [null, [Validators.required, Validators.pattern('^[0-9]{10,17}$')]],//user
    designation: [null],
    division: [null],//user
    phoneNumber: [null, [Validators.required, Validators.pattern('^[0-9]{10,14}$')]],
    dob: [null, [Validators.required]],
    institutionId: [null, [Validators.required]],
  });

  loaderConfig: any = {
    loader: 'twirl',
    position: 'right',
    color: '#000',
    background: '#fff',
    padding: '10px',
    height: .6,
    opacity: 1,
    speed: 1000,
    padButton: true,
  }

  btnName: string = 'Submit';

  appPermission = AppPermission;
  paAndName: string;
  user: any;
  startDate: string;
  endDate: string;
  designation: string;
  division: any;
  email: any;
  userConfigList: any;

  // calendar = inject(NgbCalendar);
  // formatter = inject(NgbDateParserFormatter);
  constructor(
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private cs: CommonService,
    private modelRef: NgbActiveModal,
    private fb: FormBuilder,
    public permissioinStoreService: PermissioinStoreService,
    private fileService: FileService,
    private datePipe: DatePipe,
  ) {
    super();
    const loginUser = this.cs.loadLoginUser();
    this.isSuperAdmin = loginUser?.roleList.find((f: any) => f.roleName === 'SUPER_ADMIN');
  }

  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    this.user = this.cs.loadLoginUser();
    debugger
    this.loadValue();
    if (this.isFromView) {
      this.typeList = this.allTypeList.filter(f => f.ref == this.isFromView);
      this.pa = this.linkInformation?.pa;
      this.selectedInfo = this.linkInformation;
      // this.searchPa(this.pa);
      this.setFormSignatoryId(this.linkInformation);
      // lklkkl
      this.type = 'GENERATE_LINK';
      this.requestForm.get('type').value === 'GENERATE_LINK';
      this.linkType = this.linkInformation?.linkType;

    } else if (this.linkInformation) {
      this.typeList = this.allTypeList.filter(f => f.ref == this.isFromView);
      this.type = this.linkInformation?.requestType;
    }
    else {
      this.typeList = this.allTypeList;
    }
    // this.typeList = this.allTypeList.filter(f => this.isFromView ? f.ref == this.isFromView : f);
  }
  ngOnDestroy(): void {

  }

  loadValue() {
    const value = forkJoin([this.loadInstitution()])
      .subscribe((res: any) => {
        this.institutionList = res[0]?.payload;
        console.log('institution list: ', this.institutionList);
        if (this.user?.institutionId && this.user?.userType) {
          const selectedInstitution = this.institutionList.find((f: any) => f.institutionId === this.user?.institutionId);
          this.selectedInstitutionName = selectedInstitution?.institutionName;
          this.userCDForm.get('institutionId').setValue(selectedInstitution.institutionId ?? null);
        }
        if (!this.isFromView) {
          this.viewRequest(this.linkInformation, this.ref)
        }

      })
  }

  loadInstitution() {
    const payload = {
      institutionId: this.user?.institutionId,
    }
    return this.cs.execute(ActionType.SELECT_ALL_INSTUTION, ContentType.Institution, payload);
  }


  viewRequest(dataContext: any, ref: string) {
    // this.ref = ref;
    console.log(dataContext);
    if (dataContext) {

      this.isNewStatus = dataContext?.requestStatus;
      debugger
      const patchValue = {
        // signatoryId: dataContext.externalUserRequestId
        requestId: dataContext.externalUserRequestId,
        type: dataContext.requestType,
        signatoryId: dataContext.signatoryId,
        description: dataContext.description,
        pa: dataContext.pa,
        requesterEmail: dataContext.requesterEmail,

      }
      this.selectedInfo = dataContext;
      this.linkType = dataContext?.publicLinkType;
      this.userRequestType = dataContext?.userRequestType;
      this.name = dataContext.name;
      this.pa = dataContext.pa;
      this.email = dataContext.email;
      this.requestForm.patchValue(patchValue);
      this.lnkCreationFrm.get('lnkSendingEmail').setValue(dataContext?.publicLinkSend);
      this.lnkCreationFrm.get('pa').setValue(this.pa);
      this.lnkCreationFrm.get('type').setValue(this.type);
      this.lnkCreationFrm.get('linkType').setValue(this.linkType);
      this.lnkCreationFrm.get('requestId').setValue(dataContext?.externalUserRequestId);
      this.paAndName = `${this.pa}(${this.name})`;
      this.toDate = this.formatDate(dataContext?.toDate);
      this.fromDate = this.formatDate(dataContext?.fromDate);


      this.userCDForm.get('name').setValue(this.name);
      if (dataContext.userRequestForm) {
        const pld = JSON.parse(dataContext?.userRequestForm);
        pld.userRequestType = dataContext?.userRequestType;
        this.userRequestType = dataContext?.userRequestType;
        this.selectedInstitutionName = this.institutionList.find((f: any) => f.institutionId == pld.institutionId)?.institutionName;
        debugger
        this.userCDForm.patchValue(pld);
      }
      this.viewDocument(dataContext);
    }
  }
  formatDate(endDate: any): NgbDate {
    debugger
    if (!endDate) {
      return null;
    }
    try {
      // Convert JavaScript Date to NgbDate
      const [day, month, year] = endDate.substring(0, 10).split('-').map(Number);
      const dt = new NgbDate(year, month, day);
      return dt;
      // const eDate = new Date(endDate.substring(0, 10));
      // return new NgbDate(
      //   eDate.getFullYear(),
      //   eDate.getMonth() + 1, // Months are 0-indexed in JavaScript Date
      //   eDate.getDate()
      // );
    } catch (e) {
      console.error('Error parsing endDate:', e);
    }
  }

  changeType($event: any) {
    this.endDate = null;
    this.startDate = null;
    this.linkType = null;
    this.userRequestType = null;
    this.requestForm.get('type').setValue(this.type);
  }

  isRequestFormOpen(): boolean {
    return this.requestForm.get('type').value == 'REQUEST_CREATION' && this.checkRequestType('USER');
  }

  checkRequestType(type: string): boolean {
    return this.userRequestList.includes(this.userRequestType)
      || this.serviceRequestList.includes(this.userRequestType);
    // return type == 'USER' && this.userRequestList.includes(this.userRequestType)
    //   ? true : type == 'SERVICE' && this.serviceRequestList.includes(this.userRequestType) ? true : false;
  }

  isCreationLnkOpn(): boolean {
    return (this.requestForm.get('type').value === 'GENERATE_LINK' && this.linkType) ? true : false;
  }

  isRequestCreatePermission(): boolean {
    return (this.permissioinStoreService.hasPermission(this.appPermission.REQUEST_MAKER) || this.isSuperAdmin);
  }
  checkPermission(status: string, appPermission: AppPermission): boolean {
    return this.isNewStatus === status && (this.permissioinStoreService.hasPermission(appPermission) || this.isSuperAdmin);
  }



  viewDocument(dataContext: any) {
    debugger
    this.fileService.loadFile2Base64(ActionType.LOAD_IMAGE, dataContext.externalUserRequestId, 'REQUEST_DOC')
      .subscribe({
        next: (res: any) => {
          this.imageList = res.payload;
        },
        error: (err: Error) => {
          Swal.fire(err.message);
        },
      })
  }

  disableType(): boolean {
    return this.ref === 'view';
  }


  onSave() {
    this.click = true;
    debugger
    if (this.requestForm.get('type').value != 'GENERATE_LINK') {

      var payload = this.requestForm.value;
      if (this.requestForm.get('type').errors) {
        Swal.fire('Please select type.')
      }
      if (this.requestForm.get('pa').value && !this.requestForm.get('signatoryId').value) {
        Swal.fire('Please enter valid User\'s PA Number Or Name.');
        return true;
      }
      if (this.requestForm.get('type').value === 'VERIFY_SIGNATURE' && !this.requestForm.get('signatoryId').value) {
        Swal.fire('Please enter PA Number Or Name.');
        return true;
      }
      if (this.requestForm.get('type').value === 'OTHERS'
        && this.requestForm.get('description').value == null) {
        Swal.fire('Description is required.');
        return true;
      }
      if (this.isRequestFormOpen()) {
        if (this.userCDForm.invalid) {
          Swal.fire('Please Enter All Requires Value...');
          return;
        }
        payload.userRequestType = this.userRequestType;
        payload.userRequestForm = JSON.stringify(this.userCDForm.value);
        // payload.userRequestForm = this.userCDForm.value;
        debugger
      }
      payload.institutionId = this.cs.loadLoginUser()?.institutionId;
    } else {
      this.lnkCreationFrm.get('pa').setValue(this.selectedInfo?.pa);
      this.lnkCreationFrm.get('type').setValue(this.type);
      this.lnkCreationFrm.get('linkType').setValue(this.linkType);
      if (this.lnkCreationFrm.invalid) {
        Swal.fire('Please Enter All Requires Value...');
        return;
      }
      if (!this.startDate || !this.endDate) {
        Swal.fire('Please Enter link validation time range...');
        return;
      }
      var payload = this.lnkCreationFrm.value;
      payload.startDate = this.startDate;
      payload.endDate = this.endDate;


      payload.signatoryId = this.requestForm.get('signatoryId')?.value;
    }
    payload.pageNumber = this.pageNumber;
    payload.pageSize = this.pageSize;

    Swal.fire({
      text: `Want to Submit?`,
      // title: `Are you want ${this.btnName} the Request?`,
      icon: 'warning',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
    }).then((ans: any) => {
      if (ans.isConfirmed) {
        // if (this.requestFile) {
        //   //hear request to file download

        //   this.request2SaveWithFile(payload, this.requestFile);
        // } else {
        //   this.cs.sendRequest(this, ActionType.SAVE, ContentType.Request, 'save', payload);
        // }
        this.request2SaveWithFile(payload, this.requestFile);
        debugger
      } else {
        // Swal.fire('Upload Cancel', '', 'info');
      }
    });

  }

  buildInfoByPa(pa: string) {
    this.selectedInfo = this.paList.find(f => f.pa === pa);
    this.name = this.selectedInfo.name;
    this.setFormSignatoryId(this.selectedInfo);
  }
  setFormSignatoryId(selectedInfo: any) {
    this.requestForm.get('signatoryId').setValue(selectedInfo.signatoryId);
  }


  getInstitutionId() {
    debugger
    const selectedInstitution = this.institutionList.find((f: any) => f.institutionName === this.selectedInstitutionName);
    this.userCDForm.get('institutionId').setValue(selectedInstitution.institutionId ?? null);
  }


  searchName(name: string) {
    this.showProgress = true;
    this.searchBy = 'name';
    debugger
    console.log('name : ', name);
    const payload = {
      name: name,
    }


    this.cs.sendRequest(this, ActionType.SEARCH_NAME, ContentType.SignatureInfo, 'SEARCH_NAME', payload);

  }

  searchByPa = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      map(term => term.length == 2 ? this.searchPa(term)
        : this.buildPaHead(term)
      )
    );

  searchByName = (name: Observable<string>) =>
    name.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      map(
        // term => term.length < 3 ? this.searchName(term)
        // : this.buildNameHead(term)
        term => {
          if (term == '') {
            return [];
          } else {
            // return this.test(term).subscribe(
            //   (res: any) => this.buildNameHeadt(term, res.payload!)
            // );
            return term.length == 2 ? this.searchName(term) : this.buildNameHead(term);
          }
        }
      )

    );

  // buildPaHead(term: string): string[] {
  //   debugger
  //   return this.paList?.filter(f => (
  //     f.pa?.toLowerCase().indexOf(term.toLocaleLowerCase())
  //     || f.name?.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())
  //   ) > -1).slice(0, 10)
  //     ?.map(m => m.pa +'('+ m.name +')');
  // }

  buildPaHead(term: string): string[] {
    debugger;
    return this.paList
      ?.filter(f =>
      (f.pa?.toLowerCase().includes(term.toLowerCase()) ||
        f.name?.toLowerCase().includes(term.toLowerCase()))
      )
      ?.slice(0, 10)
      ?.map(m => m.pa + '(' + m.name + ')')
      ?? [];
  }

  buildNameHead(term: string): string[] {
    let n = this.nameList?.filter(f => f.name.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10);
    let np: string[] = [];
    n?.forEach(e => {
      np.push(`${e.name} (${e.pa})`);
    });
    return np;
    // return this.nameList?.filter(f => f.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0, 10);
  }

  sendRequest(actionType: ActionType, contentType: ContentType, ref: string, payload: any) {
    this.cs.sendRequest(this, actionType, contentType, ref, payload)
  }
  request2SaveWithFile(payload: any, file: any) {
    let formData = new FormData();
    debugger
    if (payload.signatoryId) {
      formData.append('signatoryId', payload.signatoryId ?? '');
    }
    formData.append('type', payload.type);
    if (file) {
      formData.append('document', file ?? '');
    }
    if (this.pa) {
      formData.append('pa', this.pa);
    }
    if (this.startDate) {
      formData.append('startDate', this.startDate);
    }
    if (this.endDate) {

      formData.append('endDate', this.endDate);
    }

    debugger
    formData.append('description', checkNullValue(payload?.description));
    formData.append('lnkSendingEmail', checkNullValue(payload?.lnkSendingEmail));
    formData.append('userRequestForm', checkNullValue(payload?.userRequestForm));
    formData.append('pageNumber', this.pageNumber + '');
    formData.append('pageSize', this.pageSize + '');
    formData.append('linkType', this.linkType ?? '');
    formData.append('userRequestType', this.userRequestType ?? '');

    const uploadProgress$ = new Subject<number>();
    this.cs.filePostBySecure('/save/request', formData)

      .pipe(finalize(() => uploadProgress$.complete()))
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((event.loaded / event.total) * 100);
            uploadProgress$.next(percentDone); // Emitting progress percentage
          } else if (event.type === HttpEventType.Response) {
            // Handle response
            console.log('File uploaded successfully:', event.body);
            const res = event.body;
            this.saveResponse(res);

          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          // Swal.fire(error?.error ?? error?.message );
          Swal.fire({
            icon: 'error', 
            title: 'An Error Occurred',
            text: error?.error ?? error?.message ?? 'An unknown error occurred',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      );

    // uploadProgress$.subscribe(progress => {
    //   Swal.fire({
    //     title: 'Uploading file',
    //     allowOutsideClick: false,
    //     timerProgressBar: true,
    //     didOpen: () => {
    //       Swal.showLoading();
    //       const timer = Swal.getPopup().querySelector("b");
    //     },

    //   });
    // });
  }

  saveResponse(payload: any) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "save has been success",
      showConfirmButton: false,
      timer: 5000
    }).then(t => {
      debugger
      this.closeModal(payload);
      // this.allList = payload['content'];
      // this.total = payload['total'];
    });
  }

  fileInput(files: any) {
    this.requestFile = files[0];
  }
  searchPa(e) {
    this.showProgress = true;
    this.searchBy = 'pa';
    debugger
    console.log('enter Pa is: ', e);
    const payload = {
      pa: e,
      name: e,
    }

    this.cs.sendRequest(this, ActionType.SEARCH_PA_NAME, ContentType.SignatureInfo, 'SEARCH_PA', payload);
  }


  selectedName(item: any) {
    this.paAndName = item.item;
    debugger
    const selectedName: string = item.item;
    const pa = selectedName.substring(selectedName.indexOf('(') + 1, selectedName.length - 1);
    console.log('selected name is: ', selectedName);
    this.pa = pa;
    this.name = selectedName.replace(`(${pa})`, '');
    // this.searchSignature();
    this.buildInfoByPa(pa);
  }
  selectedPa(item: any) {
    debugger
    const selectedPa = item.item?.split('(')[0];
    console.log('selected name is: ', selectedPa);
    this.pa = selectedPa;
    this.buildInfoByPa(this.pa);

    // this.searchSignature();
  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'USER_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }

  clear() {
    this.type = null;
    this.selectedInfo = null;
    this.click = false;
    this.requestForm.reset();
    this.userCDForm.reset();
    this.btnName = 'Save';
    this.name = null;
    this.pa = null;
    this.requestFile = null;
    this.imageList = [];
    this.userRequestType = null;
  }

  onResponse(service: Service, req: any, res: any) {

    this.showProgress = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    // else if (res.header.referance == 'select') {
    //   debugger
    //   this.institutionList = res.payload;
    // }
    else if (res.header.referance == 'save') {
      debugger
      if (res.payload) {
        this.saveResponse(res.payload);
      }

    }
    else if (res.header.referance === 'SEARCH_PA') {
      this.paList = res.payload;
      console.log('all pa list is: ', this.paList);

    }
    else if (res.header.referance === 'SEARCH_NAME') {
      this.nameList = res.payload;
      console.log('all name list is: ', this.nameList);

    }
    // else if (res.header.referance == 'SELECT_BY') {
    //   debugger
    //   // this.allList = res.payload
    //   this.allList = res.payload['content'];
    //   this.total = res.payload['total'];
    //   console.log('all list ', this.allList);

    //   setTimeout(() => {
    //     if (this.paginationService) {
    //       this.paginationService.updateTotalItems(this.total);
    //     }
    //   }, 100);

    // }
    else if (res.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', res);
      console.log('Reference:', res.header.referance);
      debugger;
      this.userConfigList = res.payload;

      const maxLengthMapping = {
           firstName: 'firstNameMaxLength',
        lastName: 'lastNameMaxLength',
        phoneNumber: 'phoneNumberMaxLength',
        branch: 'branchMaxLength',
        designation: 'designationUMaxLength',
        nid: 'nidMaxLength',
        remarks: 'remarksMaxLength',
      };

      this.userConfigList.forEach(config => {
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


  closeModale(res: any) {
    this.closeModal(res);
  }

  closeModal(res: any) {
    debugger
    this.modelRef.close(res);
  }





  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = null;
  // toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 1);

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.toDate && this.fromDate) {
      this.buildDate();
    }
  }
  buildDate() {
    debugger
    const d = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
    this.startDate = this.datePipe.transform(d, 'yyyy-MM-dd');
    const de = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
    this.endDate = this.datePipe.transform(de, 'yyyy-MM-dd');

  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    debugger
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
