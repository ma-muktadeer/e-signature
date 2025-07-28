
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { DateConvertService } from 'src/app/service/date-convert.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { app } from 'src/app/softcafe/common/App';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sample-doc',
  templateUrl: './sample-doc.component.html',
  styleUrls: ['./sample-doc.component.scss']
})
export class SampleDocComponent extends Softcafe implements OnInit, Service {


  appPermission = AppPermission;
  app = app;
  loading: boolean = true;
  othersDocs: { file: File, fileName: string }[] = [];

  private printText: string;


  private downloadText: string;
  private mtSelected: boolean;
  btnName: string = 'Save';
  btnClick: boolean = false;
  type: string = '';
  insType: string = '';
  // singleInsInfo: any;
  documentFiles: any;
  fileName: any;
  pdfSrc: Blob;
  blockToCamel = blockToCamel;

  constructor(
    private cs: CommonService,
    private dateConvert: DateConvertService,
    public permissionStoreService: PermissioinStoreService) {
    super();
  }


  ngOnInit(): void {
    var payload = {
    }
    this.onLoadDocument(payload);
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

  allowedFileTypes = ['.doc', '.docx', '.txt'];
  otherFile(files: any[], i: number, fElement?: any) {
    const file = files[0];
    debugger
    if (file) {
      const fileExtension = '.' + file.name.split('.').pop();
      if (this.allowedFileTypes.indexOf(fileExtension) === -1) {
        Swal.fire(`${fileExtension.substring(1, fileExtension.length)} is not allowed.`);
        fElement.value = '';
        return;
      }
      else if (file?.size > 1 * 1024 * 1000) {
        Swal.fire(`File size not more than 1MB.`);
        fElement.value = '';
        return;
      }
      else {
        this.othersDocs[i].file = file;
      }
    }
  }


  addOrRemoveOtherDocuments(action: string) {
    if (action === 'add') {
      this.othersDocs.push({ file: null, fileName: '' });
    } else if (action === 'remove') {
      this.othersDocs.pop();
    }
  }


  saveSampleDocument(action: string = 'Save') {
    debugger
    this.btnClick = true;
    if (this.othersDocs.length < 1) {
      Swal.fire('Please Select Documents.');
      return;
    }
    let invalidDocs = [];
    if (this.othersDocs.length > 0) {
      invalidDocs = this.othersDocs.filter(f => (!f.file || !f.fileName));
    }

    if (invalidDocs.length > 0) {
      Swal.fire('Please input all the required information.');
      return;
    }
    let formData = new FormData();
    if (this.othersDocs && this.othersDocs?.length) {
      this.othersDocs.forEach(f => {
        const fl = f.file.name.split('.');
        formData.append('files', f.file, `${f.fileName}.${fl[fl.length - 1]}`);
        // formData.append('fileName', f.fileName);
      });
    }
    // formData.append('status', action === 'Save' ? 'NEW' : 'PEND_APPROVE');
    this.showNotifivation(formData, action);

  }

  saveAndSubmit() {
    this.saveSampleDocument('Save & Sumit');

  }
  showNotifivation(formData: any, ref: string) {
    let buttonText = ref === "Save & Sumit" ? "Save & Submit" : ref;
    Swal.fire({
      icon: 'info',
      title: 'Info',
      // text: `Are you want to ${buttonText} this Doc?`,
      text: `Want to Submit?`,
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showDenyButton: true,
      showConfirmButton: true,
      color: '#fff',
      background: '#082666',
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        denyButton: 'btn btn-danger mx-2',
      },
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then(r => {
      if (r.isConfirmed) {
        if (ref === 'Save & Sumit') {
          this.buildSaveRequest(formData);
        }
        else if (ref === 'Pend_Delete') {
          this.sendPendDeleteRequest(formData);
        }
        else if (ref === 'Delete') {
          this.sendDeleteRequest(formData);
        }
        else if (ref === 'Approve') {
          this.sendApproveRequest(formData);
        }

      } else {
        return;
      }
    });
  }

  buildSaveRequest(formData: FormData) {

    // formData.append('type', this.type!);

    this.sendSaveRequest(formData);
  }

  public sampleDocumentList;

  sendSaveRequest(formData: FormData) {

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
    this.cs.filePostBySecure('/save/sample/doc', formData)
      .pipe(finalize(() => uploadProgress$.complete()))
      .subscribe(

        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            percentDone = Math.round((event.loaded / event.total) * 100);
            uploadProgress$.next(percentDone); // Emitting progress percentage
            this.loadProgress(percentDone);
          } else if (event.type === HttpEventType.Response) {
            // Handle response
            console.log('File uploaded successfully:', event.body);
            const res = event.body;
            if (res) {
              // this.clear();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 5000
              }).then(t => {
                // var payload = {

                // }
                // this.onLoadDocument(payload);
                this.sampleDocumentList = res;
              });
            }
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          Swal.fire(error);
        }
      );

    this.closeModal();

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

  onLoadDocument(payload) {
    this.cs.sendRequest(this, ActionType.SELECT_SAMPLE_DOC, ContentType.DocumentFiles, 'SELECT_SAMPLE_DOC', payload);

  }
  addSampleDoc() {
    this.btnName = 'Save';
    this.openPopup();
  }


  clear() {
    this.btnClick = false;
    this.type = '';

    this.insType = '';
    this.othersDocs.length = 0;
    this.clearf();
  }

  clearf() {
    this.fileName = null;
    this.pdfSrc = null;
  }

  viewDocEx: string[] = ['.pdf', '.PDF'];

  deleteSignatory(info: any, ref: string) {

    const documetnFilesId = info.documetnFilesId;

    if (documetnFilesId) {
      this.showNotifivation(documetnFilesId, ref);

    }
  }
  approveDocument(info: any) {

    const documetnFilesId = info.documetnFilesId;

    if (documetnFilesId) {
      this.showNotifivation(documetnFilesId, 'Approve');

    }
  }
  sendDeleteRequest(documetnFilesId: any) {
    debugger
    const payload = {
      documetnFilesId: documetnFilesId,
    }
    this.cs.sendRequest(this, ActionType.DELETE_SAMPLE_DOC, ContentType.DocumentFiles, 'SELECT_SAMPLE_DOC', payload);
  }
  sendPendDeleteRequest(documetnFilesId: any) {
    debugger
    const payload = {
      documetnFilesId: documetnFilesId,
    }
    this.cs.sendRequest(this, ActionType.PEND_DELETE, ContentType.DocumentFiles, 'SELECT_SAMPLE_DOC', payload);
  }
  sendApproveRequest(documetnFilesId: any) {
    debugger
    const payload = {
      documetnFilesId: documetnFilesId,
    }
    this.cs.sendRequest(this, ActionType.APPROVE_SAMPLE_DOC, ContentType.DocumentFiles, 'SELECT_SAMPLE_DOC', payload);
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
        if (ref === 'view' && this.viewDocEx.includes(this.fileName.slice(this.fileName.indexOf('.')))) {
          this.pdfSrc = blob;
          this.openPopupView();

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
    // this.isCollapsed = true;
    // this.closeModal();
    this.loading = false;

    this.btnClick = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
    }
    else if (res.header.referance === 'BUILD_IMAGE64') {

      this.documentFiles = res.payload;
    } else if (res.header.referance === 'SELECT_SAMPLE_DOC') {
      console.log('SELECT_SAMPLE_DOC', res.payload);
      
      if (this.sampleDocumentList) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been successfully done.',
          showConfirmButton: false,
          timer: 5000
        }).then(() => {
          this.sampleDocumentList = res.payload;
        });
      } else {
        this.sampleDocumentList = res.payload;
      }

    }

  }

  onError(service: Service, req: any, res: any) {
    // this.isCollapsed = true;
    this.btnClick = false;
    this.loading = false;

    console.log('error');
  }

  tooltip = 'CLOSE';
  @ViewChild('pop')
  private popModal: ElementRef;
  //2
  openPopup() {
    debugger
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal('show');
  }

  closeModal() {
    this.documentFiles = '';
    debugger
    const modalElement = this.popModal.nativeElement;
    ($(modalElement) as any).modal('hide');
    this.clear();
  }


  @ViewChild('popview')
  private popModalView: ElementRef;
  openPopupView() {
    const modalElement = this.popModalView.nativeElement;
    ($(modalElement) as any).modal('show');
  }
  closeFileModal() {
    debugger
    const modalElement = this.popModalView.nativeElement;
    ($(modalElement) as any).modal('hide');
    this.clearf();
  }

}

