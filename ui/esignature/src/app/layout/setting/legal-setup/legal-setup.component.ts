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

@Component({
  selector: 'app-legal-setup',
  templateUrl: './legal-setup.component.html',
  styleUrls: ['./legal-setup.component.scss']
})
export class LegalSetupComponent extends Softcafe implements OnInit, Service {

  @ViewChild('legalDisclaimer') legalDisclamimerRef: ElementRef;

  public appPermission = AppPermission;
  public fileType: string[] = ['.pdf', '.PDF'];
  legalDisclamimer: File;
  legalDisclamimerList: any[];
  isLegalDisclamimer: boolean;
  constructor(
    public permissionStoreService: PermissioinStoreService,
    private cs: CommonService
  ) {
    super();
  }


  ngOnInit(): void {
    this.loadLegal();
  }


  fileInput(files: any, element: any, type: string) {
    debugger
    if (files?.length > 0 && files[0].size > 1024 * 2000) {
      Swal.fire('Legal Disclaimer file size not more than 2MB.');
      element.value = '';  
      return; 
    }
    try {

      this.legalDisclamimer = this.checkValidFile(files[0]);

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
    if (fileExtention && this.fileType.includes(`.${fileExtention.toLowerCase()}`)) {
      return file;
    }
    else {
      throw Error(`${fileExtention} File not valid.`);
    }
  }

  uploadFile(event: Event) {
    event.preventDefault();
    
    if (!this.legalDisclamimer) {
      return;
    }
    let formData = new FormData();
    if (this.legalDisclamimer) {
      formData.append('legalDisclaimer', this.legalDisclamimer);
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
        this.cs.filePostBySecure('/upload/diclaimer', formData)
          .pipe(finalize(() => uploadProgress$.complete()))
          .subscribe(
            (event: HttpEvent<any>) => {
              if (event.type === HttpEventType.UploadProgress) {
                percentDone = Math.round((event.loaded / event.total) * 100);
                uploadProgress$.next(percentDone);

                this.loadProgress(percentDone);


              } else if (event.type === HttpEventType.Response) {
                // Handle response
                console.log('File uploaded successfully:', event.body);
                const res = event.body;
                this.resetValue();
                uploadProgress$.complete();
                this.popupMsg('success', 'Success', 'Save Success.', true).then(() => {
                  this.legalDisclamimerList = res;
                  this.checkFileType(this.legalDisclamimerList);
                });
              }
            },
            (error) => {
              console.error('Error uploading file:', error);
              this.popupMsg('error', 'Opsss', error?.error ?? error?.statusText);
            }
          );

        // uploadProgress$.subscribe(progress => {
        //   Swal.fire({
        //     title: 'Uploading file',
        //     allowOutsideClick: false,
        //     timerProgressBar: progress < 100,
        //     didOpen: () => {
        //       Swal.showLoading();
        //       const timer = Swal.getPopup().querySelector("b");
        //     },

        //   });
        // });

      } else {

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

  checkFileType(list: any[]) {
    if (list) {
      debugger
      this.isLegalDisclamimer = false;
      list.forEach(e => {
        if (e?.configSubGroup === 'LEGAL_DISCLAIMER') {
          this.isLegalDisclamimer = true;
        }
      });
    }
    this.resetValue();
  }

  handleValueChanged(event) {
    this.checkFileType(event);
  }
  resetValue() {
    this.legalDisclamimer = null;
    if (this.legalDisclamimerRef) {
      this.legalDisclamimerRef.nativeElement.value = '';
    }

  }

  popupMsg(icon: SweetAlertIcon, title: string, text: string, timer?: boolean): any {
    return Swal.fire({
      icon: icon,
      title: title,
      timer: timer ? 5000 : null,
      text: text,
    });
  }

  loadLegal() {
    // payload.configGroup = 'DISCLAIMER';
    //   payload.configSubGroupList = ['LEGAL_DISCLAIMER'];
    const payload = {
    };
    this.cs.sendRequest(this, ActionType.SELECT_ALL_LEGAL, ContentType.DocumentFiles, 'SELECT_ALL_LEGAL', payload);
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      this.popupMsg('error', 'Error', super.getErrorMsg(res),);
      return;
    }
    debugger
    if (res.header.referance === 'SELECT_ALL_LEGAL') {
      this.legalDisclamimerList = res.payload;
      console.log('legal dis', this.legalDisclamimerList);
      
      this.checkFileType(this.legalDisclamimerList);

    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
