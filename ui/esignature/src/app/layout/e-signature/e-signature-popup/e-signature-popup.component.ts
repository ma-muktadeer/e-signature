import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DateConvertService } from 'src/app/service/date-convert.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-e-signature-popup',
  templateUrl: './e-signature-popup.component.html',
  styleUrls: ['./e-signature-popup.component.scss']
})
export class ESignaturePopupComponent extends Softcafe implements OnInit, Service {

  @Input() signatureValue: any;
  @Input() ref: any;
  @Input() allData: any;
  @Input() pageNumber: number = 1;
  @Input() pageSize: number = 20;

  loading: boolean = true;

  showProgress: boolean = false;
  appPermission = AppPermission;
  othersDocs: { file: File, fileName: string }[] = [];

  signatureForm = this.fb.group({
    active: '',
    signatureInfoId: '',
    signatureId: '',
    signatoryId: '',
    pa: '',
    name: '',
    designation: '',
    effictiveDate: '',
    signaturePath: '',
    signatureStatus: '',
    email: '',
    rejectionCause: '',
    status: '',
    calcelCause: '',
    cancelEffectiveDate: '',
    inactiveTime: '',
    remarks: '',
  });

  btnRef: string;
  status: string;
  image64: string[] = [];
  documentFiles: any[] = [];
  fileName: any;
  tooltip: string = 'CLOSE';
  public spreadMode: "off" | "even" | "odd" = "off";
  pdfSrc: any;

  viewDocEx: string[] = ['.pdf', '.jpg', '.png', '.jpeg', '.gif'];

  cancelationApproval: any;
  cancelation: any;
  ceDate: boolean = false;
  btnClick: boolean = false;
  click: boolean = false;
  isPdf: boolean;
  fileType: any;

  constructor(
    private cs: CommonService,
    private modelRef: NgbActiveModal,
    private fb: FormBuilder,
    public permissionStoreService: PermissioinStoreService,
    public dateConvertService: DateConvertService,
    private ds: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    console.log('Signature Value is, ', this.signatureValue);
    console.log('Signature all value, ', this.allData);
    debugger
    this.buildPatch4FormValue(this.signatureValue);
    // this.signatureForm.patchValue(this.signatureValue);
    if (this.signatureValue) {
      this.loadSignatureImage(this.signatureValue);
    }
  }

  loadSignatureImage(signatureValue: any) {
    this.loading = true;

    let payload = JSON.parse(JSON.stringify(signatureValue));
    payload.signaturePath = '';

    this.cs.sendRequest(this, ActionType.BUILD_IMAGE64, ContentType.SignatureInfo, 'BUILD_IMAGE64', payload);
  }
  buildPatch4FormValue(signatureValue: any) {
    let eDate: string = this.dateConvertService.convertDb2Date(signatureValue?.effictiveDate);
    let cDate: string = this.dateConvertService.convertDb2Date(signatureValue?.cancelEffectiveDate);
    let aDate: string = this.dateConvertService.convertDb2Date(signatureValue?.inactiveTime);
    // let eDate: string = this.buildTime(signatureValue?.effictiveDate);
    // let cDate: string = this.buildTime(signatureValue?.cancelEffectiveDate);
    // let aDate: string = this.buildTime(signatureValue?.inactiveTime);
    let pathcFormValue = signatureValue;
    pathcFormValue.effictiveDate = eDate;
    pathcFormValue.cancelEffectiveDate = cDate;
    pathcFormValue.inactiveTime = aDate;
    debugger
    this.signatureForm.patchValue(pathcFormValue);

  }



  // buildTime(effictiveDate: string): string {
  //   console.log(effictiveDate);
  //   if (effictiveDate) {
  //     let [day, month, year] = effictiveDate!.slice(0, 10).split('-');
  //     return year + '-' + month + '-' + day;
  //   }
  //   return;
  // }

  closeModal(res: any) {
    debugger
    this.modelRef.close(res);
  }
  checkDocumentSize(): boolean {
    return !(this.documentFiles.length > 2 && this.downloadFile.length <= 4)
  }
  updateSignature(btnRef: string, ref?: string) {
    if (this.btnClick) {
      return;
    }
    this.click = true;
    this.btnRef = btnRef;
    let st = 'NEW';
    debugger
    let payload = this.signatureForm.value;
    console.log('Payload: ', payload);
    if (payload.signatureStatus === 'CANCELED' && !payload.cancelEffectiveDate) {
      Swal.fire('Cancel Effictive Date is Required.');
      return;
    }
    if (payload.signatureStatus === 'IN_ACTIVE' && !payload.inactiveTime) {
      Swal.fire('Inactive Date is Required.');
      return;
    }

    // if (this.checkUpdateStatus(payload)) {
    if (this.cancelation || this.cancelationApproval || (this.othersDocs && this.othersDocs[0]?.file)) {
      this.buildFromControlValue(payload);
      // }
      // else {
      //   Swal.fire('Please Upload Cancelation Required Documents.');
      //   return true;
      // }
    }
    else {
      this.requestSignature(payload, st);
    }


  }

  checkUpdateStatus(value: any): boolean {
    debugger
    return true;
    // const fv = this.allData.filter(f => f.signatureInfoId === value.signatureInfoId);
    // return ['CANCELED', 'IN_ACTIVE'].includes(value.signatureStatus) && fv[0].signatureStatus !== value.signatureStatus

  }
  otherFile(files: any[], i: number, inputElement: HTMLInputElement) {
    console.log('Input Element:', inputElement);
    const file = files[0];
    if (file.size > 1 * 1024 * 1024) {
      Swal.fire('File size should not exceed 1 MB');
      this.othersDocs[i].file = null;
      inputElement.value = '';
      return;
    }
    this.othersDocs[i].file = files[0];
  }
  addOrRemoveOtherDocuments(action: string) {
    if (action === 'add') {
      this.othersDocs.push({ file: null, fileName: '' });
    } else if (action === 'remove') {
      this.othersDocs.pop();
    }
  }

  buildFromControlValue(payload: any) {

    // if (payload.signatureStatus === 'CANCELED' && !payload.cancelEffectiveDate) {
    //   this.ceDate = true;
    //   Swal.fire('Cancle Effictive Date is Required.');
    //   return;
    // }
    let validDocs;
    if (this.othersDocs && this.othersDocs.length > 0) {
      validDocs = this.othersDocs.filter(f => (!f.file || !f.fileName));
    }
    if (validDocs?.length > 0) {
      Swal.fire('Please fill all the Other Documents information.');
      return;
    }

    let formData = new FormData();
    formData.append('signatureId', payload.signatureId);
    formData.append('signatoryId', payload.signatoryId);
    formData.append('effictiveDate', payload.effictiveDate ?? '');
    formData.append('signatureStatus', payload.signatureStatus);
    formData.append('calcelCause', payload.calcelCause);
    formData.append('pageSize', this.pageSize + '');
    formData.append('pageNumber', this.pageNumber + '');
    if (payload.signatureStatus === 'CANCELED') {
      formData.append('cancelEffectiveDate', payload.cancelEffectiveDate);
      formData.append('rejectionCause', payload.rejectionCause);
    }
    formData.append('inactiveTime', payload.inactiveTime ?? '');
    formData.append('status', 'NEW');

    if (this.cancelationApproval) {
      formData.append('cancelationApproval', this.cancelationApproval);
    }
    if (this.cancelation) {
      formData.append('cancelation', this.cancelation);
    }

    if (this.othersDocs && this.othersDocs?.length) {
      this.othersDocs.forEach(f => {
        const fl = f.file.name.split('.');
        formData.append('files', f.file, `${f.fileName}.${fl[fl.length - 1]}`);
        // formData.append('fileName', f.fileName);
      });
    }

    Swal.fire({
      // title: 'Are you want to Update this signature?',
      text: `Want to Submit?`,
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.btnClick = true;

        this.showProgress = true;
        debugger
        const uploadProgress$ = new Subject<number>();
        let percentDone = 0;
        Swal.fire({
          title: 'Uploading file...',
          // text: 'Uploading........',
          timerProgressBar: false,
          showConfirmButton: false,
          html: `
          <div class="progress" id="progress-bar" role="progressbar" aria-label="Animated striped example" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar progress-bar-striped progress-bar-animated" id="progress-text">0%</div>
          </div>
          `,
          allowOutsideClick: false,

          didOpen: () => {
            // Swal.showLoading();
          },
          willClose: () => {
            percentDone = 100; // Ensure percentDone is 100% when closing
          }
        });

        this.cs.filePostBySecure('/update/signature', formData)
          .pipe(finalize(() => uploadProgress$.complete()))
          .subscribe(
            (event: HttpEvent<any>) => {
              if (event.type === HttpEventType.UploadProgress) {
                // const percentDone = Math.round((event.loaded / event.total) * 100);
                // uploadProgress$.next(percentDone); // Emitting progress percentage
                percentDone = Math.round((event.loaded / event.total) * 100);
                uploadProgress$.next(percentDone); // Emitting progress percentage
                this.loadProgress(percentDone);
              } else if (event.type === HttpEventType.Response) {
                // Handle response
                console.log('File uploaded successfully:', event.body);
                const res = event.body;
                this.showProgress = false;
                this.closeModal(res);
                this.btnClick = false;
                this.click = false;
              }
            },
            (error) => {
              this.btnClick = false;
              this.click = false;
              console.error('Error uploading file:', error);
              Swal.fire('Error', `Failed to upload file.\n${error.message ?? ''}`, 'error');
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
      else if (result.isDenied) {
        // Swal.fire('')
        // this.closeModale();
        // this.authInprogress = false;
        // this.showProgress = false;
      }
    });



  }
  loadProgress(percentDone: number) {
    const progressBar: any = Swal.getHtmlContainer().querySelector('.progress-bar');
    const progressText = Swal.getHtmlContainer().querySelector('#progress-text');

    if (progressBar && progressText) {
      // Set the width of the progress bar based on percentDone
      progressBar.style.width = `${percentDone}%`;

      // Update the text inside the progress bar
      progressText.textContent = `${percentDone}%`;
    }
  }
  fileInput(files: any, ref: any, inputElement: HTMLInputElement) {
    console.log('Input Element:', inputElement);
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire('File size should not exceed 10 MB');
      if (ref === 'CANCELATION_APPROVAL') {
        this.cancelationApproval = null;
      } else if (ref === 'CANCELATION') {
        this.cancelation = null;
      }

      inputElement.value = '';
      return;
    }

    debugger
    if (ref === 'CANCELATION_APPROVAL') {
      this.cancelationApproval = files[0];
    } else if (ref === 'CANCELATION') {
      this.cancelation = files[0];
    }

  }


  isRequestMaker(status?: string): boolean {
    const res = this.permissionStoreService.hasPermission(this.appPermission.UPDATE_SIGNATURE);
    if (res) {
      this.status = status;
    }
    return res;
  }

  checkStatus(): boolean {
    const selectedRows = this.signatureForm.value;
    return selectedRows.status == this.status;
  }

  checkRequestApproveStatus(): boolean {
    const selectedRows = this.signatureForm.value;
    return selectedRows.status == this.status;
  }

  onRequest4ApproverBtn(btnRef?: string) {
    this.btnRef = btnRef;
    if (this.btnClick) {
      return;
    }
    const selectedRows = this.signatureForm.value;
    // this.approveRequestByApprover(selectedRows);
    this.requestSignature(selectedRows, 'APPROVED');
  }

  onApproveRequestByBtn(btnRef?: string) {
    if (this.btnClick) {
      return;
    }
    this.btnRef = btnRef;
    // const selectedRows = this.dataViewObj.getAllSelectedItems();
    const selectedRows = this.signatureForm.value;
    this.requestSignature(selectedRows, 'PEND_APPROVE');
  }

  requestSignature(dataContext: any, status: string) {
    debugger
    console.log('data context', dataContext);
    let data: any = [];
    if (dataContext.length > 0) {
      data = dataContext;
    } else {
      data = [dataContext];
    }
    const payload = {
      updateSignature: data,
      status: status,
    };

    // this.buidSendUpdateRequest(payload, ActionType.UPDATE, `Are you want to ${this.btnRef.toLowerCase().replace(/_/g, ' ')}?`);
    this.buidSendUpdateRequest(payload, ActionType.UPDATE, `Want to Submit?`);
  }

  isRequestApprover(status: string): boolean {
    // const res = this.cs.hasAnyRole([AppRole.SIGNATURE_APPROVER, AppRole.SUPER_ADMIN]);
    const res = this.permissionStoreService.hasPermission(AppPermission.APPROVE_SIGNATURE);
    if (res) {
      this.status = status;
    }
    return res;
  }

  isSavePermission(): boolean {
    let res: boolean = this.permissionStoreService.hasAnyPermission([this.appPermission.SIGNATURE_MAKER, this.appPermission.UPDATE_SIGNATURE]) && this.ref != 'VIEW';
    // console.log(res);
    return res;
  }

  buidSendUpdateRequest(dataContext: any, action: ActionType, title?: string) {
    const payload = dataContext;
    payload.pageNumber = this.pageNumber;
    payload.pageSize = this.pageSize;
    Swal.fire({
      title: title,
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.btnClick = true;

        this.showProgress = true;
        this.loading = true;

        this.cs.sendRequest(this, ActionType.UPDATE, ContentType.SignatureInfo, 'UPDATE', payload);

      }
      else if (result.isDenied) {
        // this.closeModale();
        // this.authInprogress = false;
        // this.showProgress = false;
      }
    });
  }
  sendRequest2FileUpload(payload: any) {
    debugger
    const uploadProgress$ = new Subject<number>();
    this.cs.filePostBySecure('/update/signature', payload)
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
            Swal.fire({
              title: 'Successfull',
              icon: 'success',
              text: 'File uploaded successfully',
              timer: 5000,
            })
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          Swal.fire('Error', 'Failed to upload file', 'error');
        }
      );

    uploadProgress$.subscribe(progress => {
      Swal.fire({
        title: 'Uploading file',
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
        },

      });
    });

    // .subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //   },
    //   error: (err: any) => {

    //   },

    // });
  }

  downloadDocument(file: any, ref?: string) {
    const payload = JSON.parse(JSON.stringify(file));
    payload.modDate = null;
    payload.createDate = null;
    this.fileName = file.fileName;
    debugger

    this.cs.fileDownload('/file/download', payload).subscribe({
      next: (res: any) => {
        console.log('getting response', res);

        const blob = new Blob([res], { type: 'application/octet-stream' });
        const fn = this.fileName.slice(this.fileName.lastIndexOf('.')).toLowerCase();
        // this.fileType = fn;
        this.isPdf = fn === '.pdf';
        if (ref === 'view' && this.viewDocEx.includes(fn)) {
          const type = fn === '.pdf' ? 'application/pdf' : fn === '.png' || fn === '.jpg' || fn === '.jpeg' || fn === '.gif' ? 'image/jpeg' : "";
          this.blob2File(new File([blob], this.fileName, { type: type }));
          // this.pdfSrc = blob;
          this.openPopup();

        } else {
          this.downloadFile(blob);
        }

      },
      error(err: any) {
        console.log('err', err);
        Swal.fire('Sorry... Failed to getting Document.')
      },
    });
  }
  fileSrc: any;
  //old
  // blob2File(f: File) {
  //   let reader = new FileReader();
  //   reader.onload = (res) => {
  //     // If you want to display it in an iframe, use createObjectURL
  //     const blob = new Blob([res.target.result], { type: f.type });
  //     const url = URL.createObjectURL(blob);

  //     // Assuming pdfSrc is the variable holding the URL to display the PDF
  //     this.pdfSrc = res.target.result;
  //     this.fileSrc = this.ds.bypassSecurityTrustResourceUrl(url);

  //     this.fileType = f.type;

  //     // Optional: Revoke the Object URL after using it to free up memory
  //     reader.onloadend = () => {
  //       URL.revokeObjectURL(url);
  //     };
  //   };
  //   reader.readAsArrayBuffer(f);
  // }

  //new
  blob2File(f: File) {
    let reader = new FileReader();
    reader.onload = (res) => {
      const base64File = res.target.result as string;
      const byteCharacters = atob(base64File.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: f.type });

      const url = URL.createObjectURL(blob) + '#toolbar=1&download=1';
      this.pdfSrc = this.ds.bypassSecurityTrustResourceUrl(url);
      this.fileSrc = this.ds.bypassSecurityTrustResourceUrl(url);
      this.fileType = f.type;
    };
    reader.readAsDataURL(f);
  }


  downloadFile(blob: Blob) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  onResponse(service: Service, req: any, res: any) {
    this.loading = false;
    this.btnClick = false;
    this.click = false;

    this.showProgress = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'UPDATE') {
      this.btnClick = false;
      // this.signatureList = res.payload;
      // console.log('all signature is, ', this.signatureList);
      this.closeModal(res.payload);
    }
    else if (res.header.referance === 'BUILD_IMAGE64') {

      this.image64 = res.payload?.base64Image;
      console.log('64 image', this.image64);
      this.documentFiles = res.payload?.fileList;
    }

  }
  onError(service: Service, req: any, res: any) {
    console.log('getting error', res);
    this.loading = false;
    this.btnClick = false;
    this.click = false;
  }



  @ViewChild('pop')
  private popModal: ElementRef;
  openPopup() {
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal({
      backdrop: 'static', 
      keyboard: false     
    });
    ($(modalElement) as any).modal('show');
  }
  closeFileModal() {
    debugger
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal('hide');
    this.clear();
  }

  clear() {
    this.fileName = null;
    this.pdfSrc = null;
  }



}
