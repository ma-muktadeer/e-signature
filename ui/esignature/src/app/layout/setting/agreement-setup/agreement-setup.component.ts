import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CommonFileViewGridComponent } from '../common-file-view-grid/common-file-view-grid.component';

@Component({
  selector: 'app-agreement-setup',
  templateUrl: './agreement-setup.component.html',
  styleUrls: ['./agreement-setup.component.scss']
})
export class AgreementSetupComponent extends Softcafe implements Service, OnInit {

  @ViewChild('fileViewGrid') fileViewGrid: CommonFileViewGridComponent;
  @ViewChild('generalNotic') generalNoticRef: ElementRef;
  @ViewChild('instruction') instructionRef: ElementRef;

  isSaveGeneralNotic: boolean = true;
  isSaveInstructionFile: boolean = true;
  // selectedFile: File | null = null;
  generalNotic: File | null = null;
  instruction: File | null = null;
  imageType: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  agreementLis: any;

  public appPermission = AppPermission;

  constructor(private cs: CommonService, public permissionStoreService: PermissioinStoreService) {
    super();
  }

  ngOnInit(): void {
    this.loadAgreemant();
  }


  fileInput(files: any, element: any, type: string) {
    debugger
    if (files?.length > 0 && files[0].size > 2 * 1000 * 1000) {
      Swal.fire('Image size not more than 2MB.');
      element.value = '';  
      return; 
    }

    try {
      if (type === 'GENERAL_NOTIC_FILE') {
        this.generalNotic = this.checkValidFile(files[0]);
      }
      else if (type === 'INSTRUCTION_FILE') {
        this.instruction = this.checkValidFile(files[0]);
      }
      // this.selectedFile = files[0];
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        timer: 5000,
      }).then(r => {
        element.value = '';
      });
    }

  }

  checkValidFile(file: File): File {
    const value: any[] = file.name.split('.');
    const fileExtention = value[value.length - 1];
    if (fileExtention && this.imageType.includes(`.${fileExtention.toLowerCase()}`)) {
      return file;
    }
    else {
      throw Error(`${fileExtention} File not valid.`);
    }
  }

  onView(e: any, args: any) {
    const payload = args.dataContext;
    // this.openPopup(payload);
  }

  popupInfoMsg(icon: SweetAlertIcon, action: string): any {
    return Swal.fire({
      icon: icon,
      title: 'Info',
      text: `Want to Submit?`,
      // text: `Are you want to ${action}?`,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: `Confirm`,
      cancelButtonText: 'No',
    });
  }

  uploadFile(event: Event) {
    event.preventDefault();
    debugger

    if (!(this.generalNotic || this.instruction)) {
      return;
    }
    let formData = new FormData();
    if (this.generalNotic) {
      formData.append('generalNotic', this.generalNotic);
    } if (this.instruction) {
      formData.append('instruction', this.instruction);
    }

    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: `Want to Submit?`,
      // text: 'Are you want to save?',
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: `Confirm`,
      cancelButtonText: 'No',
    }).then(r => {
      if (r.isConfirmed) {

        const uploadProgress$ = new Subject<number>();
        this.cs.filePostBySecure('/upload/agreement', formData)
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
                this.resetValue();
                uploadProgress$.complete();
                this.popupMsg('success', 'Success', 'Save Success.',true).then(() => {
                  this.agreementLis = res;
                  this.checkFileType(this.agreementLis);
                });
              }
            },
            (error) => {
              console.error('Error uploading file:', error);
              this.popupMsg('error', 'Opsss', error.error.error);
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
        //     this.popupMsg('success', 'Success', 'Save Success.').then(() => {
        //       this.agreementLis = res;
        //       this.checkFileType(this.agreementLis);
        //     });
        //   },
        //   error: (err: HttpErrorResponse) => {
        //     this.popupMsg('error', 'Opsss', err.error.error);
        //   },
        //   complete: () => {
        //     // Reset file input value
        //     this.resetValue();
        //     // Perform any other actions after file upload completion
        //   },
        // });
      } else {

      }
    });
  }


  popupMsg(icon: SweetAlertIcon, title: string, text: string, timer?: boolean): any {
    return Swal.fire({
      icon: icon,
      title: title,
      timer: timer ? 5000 : null,
      text: text,
    });
  }

  handleValueChanged(event) {
    this.checkFileType(event);
  }


  showDeleteSuccessMsg(list: any[]) {
    this.popupMsg('success', 'Success', 'Delete successful.').then(
      () => {
        this.agreementLis = list;
        this.checkFileType(this.agreementLis);
      }
    );
  }



  loadAgreemant() {
    const payload = {};
    this.cs.sendRequest(this, ActionType.SELECT_ALL_AGREEMENT, ContentType.DocumentFiles, 'SELECT_ALL_AGREEMENT', payload);
  }
  checkFileType(list: any[]) {
    if (list) {
      debugger
      this.isSaveGeneralNotic = false;
      this.isSaveInstructionFile = false;
      list.forEach(e => {
        if (e?.configSubGroup === 'GENERAL_NOTIC_FILE') {
          this.isSaveGeneralNotic = true;
        } else if (e?.configSubGroup === 'INSTRUCTION_FILE') {
          this.isSaveInstructionFile = true;
        }
        // this.isSaveGeneralNotic = e?.configSubGroup === 'GENERAL_NOTIC_FILE';
        // this.isSaveInstructionFile = e?.configSubGroup === 'INSTRUCTION_FILE';
      });
    }
    this.resetValue();
  }

  resetValue() {
    this.generalNotic = null;
    this.instruction = null;
    if (this.instructionRef) {
      this.instructionRef.nativeElement.value = '';
    }
    if (this.generalNoticRef) {
      this.generalNoticRef.nativeElement.value = '';
    }

  }

  onResponse(service: Service, req: any, res: any) {

    if (!super.isOK(res)) {
      this.popupMsg('error', 'Error', super.getErrorMsg(res),);
      return;
    }
    debugger
    if (res.header.referance === 'SELECT_ALL_AGREEMENT') {
      const list = res.payload;
      if (this.agreementLis?.length > list.length) {
        this.showDeleteSuccessMsg(list);
      } else {
        this.agreementLis = res.payload;
        this.checkFileType(this.agreementLis);
      }
    }
  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
