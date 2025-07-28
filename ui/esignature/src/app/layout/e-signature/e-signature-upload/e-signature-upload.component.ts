import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileDownloaderService } from 'src/app/service/file-downloader.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { INSTITUTION_TYPE, InstitutionType } from '../../admin/moder/institution_type';



@Component({
    selector: 'app-e-signature-upload',
    templateUrl: './e-signature-upload.component.html',
    styleUrls: ['./e-signature-upload.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                overflow: 'hidden',
                height: '*',
                width: '100%'
            })),
            state('out', style({
                opacity: '0',
                overflow: 'hidden',
                height: '0px',
                width: '100%'
            })),
            transition('in => out', animate('1500ms ease-in-out')),
            transition('out => in', animate('1500ms ease-in-out'))
        ])
    ]
})
export class ESignatureUploadComponent extends Softcafe implements OnInit, Service {



    public fileType = ['.jpeg', '.png', '.jpg', '.JPG', '.JPEG', '.PNG'];
    protected xclFileType = ['.xlsx', '.xlsm', '.xlsb', '.xltx'];
    modelBody: string = 'SINGLE';
    // modelBody: string = 'FIRST';
    xclFile: any;

    files = [];
    fileName: any = [];
    isFile: boolean = false;
    signatoryList: any[] = [];
    signatoryId: any;
    // canvasRotation: number = 0;
    rotation: number = 0;
    transform: ImageTransform = {};
    isMultiple: boolean = false;
    insType: string = '';

    institutionTypeList: InstitutionType[] = INSTITUTION_TYPE;

    signatureForm = this.fb.group({
        // signatureName:'',
        // accountId: '',
        signatureId: '',
        signatoryId: ['', [Validators.required]],
        effictiveDate: ['', [Validators.required]],
        cancelEffectiveDate: [''],
        signaturePath: '',
        signatureStatus: ['', [Validators.required]],
        status: '',
        rejectionCause: '',
        calcelCause: '',
        cancelTime: '',
        // signatureName: '',
        // email: '',
        mainSignature: '',
        signatureType: 'ALL',
    });
    fileUploadMsg: any;
    openErrorPopup: string = 'none';

    appPermission = AppPermission;
    btnClick: string;
    selectPa: any;
    type1: string;
    institutionId: number;
    userType: string = '';
    isConfirmedUpload: boolean = false;
    institutionList: any[] = [];
    imgFileSize: number = 1;
    loading: boolean = false;
    isChangeBg: boolean = false;

    constructor(private http: HttpClient,
        private fb: FormBuilder,
        private cs: CommonService,
        private modalService: BsModalService,
        public fileDown: FileDownloaderService,
        public permissionStoreService: PermissioinStoreService) {
        super();
    }

    get csService() {
        return this.cs;
      }


    ngOnInit(): void {
        // this.loadSignatory();

        this.openBody(this.modelBody);
    }

    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'signatoryId',
        textField: 'name',
        limitSelection: 1,
        noFilteredDataAvailablePlaceholderText: 'Sorry no data available.',
        noDataAvailablePlaceholderText: 'Data not found.',

        // selectAllText: 'Select All',
        // unSelectAllText: 'UnSelect All',
        itemsShowLimit: 10,
        allowSearchFilter: true,
        closeDropDownOnSelection: true,
    };



    filesDropped(fl: any, pointer?: string): void {
        debugger
        // this.fileName = [];
        const file = fl[0].file;

        // file.name.substring(file.name.lastIndexOf('.')+1)

        // if (!this.checkIsValidFileType(file, pointer)) {
        //     return;
        // }
        this.checkValidFile(file, pointer);

    }

    checkValidFile(file: File, pointer?: string) {
        const fSplit = file.name.split('.');
        if (pointer && pointer == 'IMG') {
            if (this.imgFileSize * 1024 * 1024 < file.size) {
                Swal.fire(`Please select file under ${this.imgFileSize} MB.`);
                return;
            }
            const res = this.fileType.includes('.' + fSplit?.[fSplit.length - 1]);
            if (!res) {
                Swal.fire('File type not Acceptable.');
                return;
            } else {
                this.upFileName = file.name;
                this.convertFile2Blob(file);
            }
        } else if (pointer && pointer == 'EXCL') {
            if (!this.xclFileType.includes('.' + fSplit?.[fSplit.length - 1])) {
                // if (pointer && pointer != 'EXCL') {
                Swal.fire('File type not Acceptable.');
                //  false;
                // } 
            }
            else {
                this.fileName.push(file.name);
                this.xclFile = file;
            }
        } else {
            // res = false;
            Swal.fire('File type not Acceptable.');
            return;
        }
    }
    upFileName: any;
    checkIsValidFileType(file: any, pointer?: string): boolean {
        this.xclFile = null;
        this.upFileName = null;
        let res: boolean = true;
        this.upFileName = file.name;
        let name = file.name;
        if (this.fileType.includes(name.substring(name.lastIndexOf('.')))) {
            if (pointer && pointer == 'EXCL') {
                res = false;
                Swal.fire('File type not Acceptable.');
            }
            else {
                // this.fileName.push(`${this.selectPa}_${this.fileName?.length + 1}${name.substring(name.lastIndexOf('.'))}`);
                // this.fileName.push(name);
                this.convertFile2Blob(file);
            }
        } else if (this.xclFileType.includes(name.substring(name.lastIndexOf('.')))) {
            if (pointer && pointer != 'EXCL') {
                res = false;
                Swal.fire('File type not Acceptable.');
            } else {
                this.fileName.push(name);
                this.xclFile = file;
            }
        } else {
            res = false;
            Swal.fire('File type not Acceptable.');
        }
        // if (res && blob) {
        //     this.convertFile2Blob(file);
        // }
        return res;
    }
    changeFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    imageFile: any;
    convertFile2Blob(file: File) {
        const type = file.type;
        this.changeFile(file).then((base64: string): any => {
            // console.log(base64);
            this.imageFile = this.dataURItoBlob(base64);
            this.imageFile ? this.isFile = true : this.isFile = false;
        });
    }

    rotateImage(rotationType?: string) {
        rotationType == 'left' ? this.rotation-- : rotationType == 'right' ? this.rotation++ : this.rotation;
        this.transform = {
            ...this.transform,
            rotate: this.rotation,
        }
    }

    selectSignatory() {
        debugger
        this.selectPa = this.signatoryList.find(f => f.signatoryId === this.signatoryId[0].signatoryId)?.pa;
    }

    deselectSignatory() {
        this.selectPa = null;
        this.signatoryId = null;
        this.fileName = [];
        this.previews = [];
    }
    bankType: any = '';

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


    selectedInstitutionName: string;
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


    updateType() {
        const effictiveDateControl = this.signatureForm.get('effictiveDate');
        if (effictiveDateControl) {
            this.type = effictiveDateControl.value ? 'date' : 'text';
        }
    }
    updateType1() {
        const cancelEffectiveDate = this.signatureForm.get('cancelEffectiveDate');
        if (cancelEffectiveDate) {
            this.type1 = cancelEffectiveDate.value ? 'date' : 'text';
        }
    }
    rotateLeft() {
        // this.canvasRotation--;
        this.rotateImage('left');
    }

    rotateRight() {
        // this.canvasRotation++;
        this.rotateImage('right');
    }

    onFileDropped(event: any, pointer?: string) {
        console.log(event);
        // this.fileName = [];
        debugger
        if (event.target.value) {
            const file = event.target.files[0];
            // this.checkIsValidFileType(file, pointer);

            this.checkValidFile(file, pointer);
        } else {
            alert('Nothing');
        }

    }

    previews: string[] = [];
    imageUrls: any;

    isHidden(): boolean {
        return this.previews.length < 0;
    }

    openBody(value?: string) {
        debugger
        this.helpMenu = 'out';
        this.modelBody = value!;

        this.resetValue();

        this.toggleHelpMenu(value);
    }

    loadSignatory(ref: string) {
        this.signatoryList.length = 0;
        debugger
        if (ref === 'INTERNAL_USER' || this.institutionTypeList.find((f: InstitutionType) => f.value === ref)) {
            this.institutionId = this.cs.loadLoginUser()?.institutionId;
            const payload = {
                institutionId: this.institutionId,
                userType: this.userType,
                insType: this.insType,
            };
            this.loading = true;

            this.cs.sendRequest(this, ActionType.ACTION_SELECT_ALL_UPLOAD, ContentType.Signatory, 'SELECT', payload);
        } else {
            return;
        }
    }

    uploadFile() {
        if (!this.xclFile) {
            Swal.fire('Please upload EXCEL file.');
            return;
        }
        if (!this.institutionId) {
            Swal.fire('Please select an Institution.');
        }

        Swal.fire({
            title: `Want to Submit?`,
            // title: `Are you want Upload ${this.fileName[0]} file?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Confirm',
            denyButtonText: 'No',
        }).then((result: any) => {
            if (result.isConfirmed) {
                const formData: FormData = new FormData();

                if (this.xclFile) {
                    formData.append('files', this.xclFile);
                } else {
                    return;
                }
                formData.append('institutionId', this.institutionId.toString());
                debugger
                const uploadProgress$ = new Subject<number>();

                this.cs.filePostBySecure('/file/upload', formData)
                    .pipe(finalize(() => uploadProgress$.complete()))
                    .subscribe(
                        (event: HttpEvent<any>) => {
                            if (event.type === HttpEventType.UploadProgress) {
                                const percentDone = Math.round((event.loaded / event.total) * 100);
                                uploadProgress$.next(percentDone); // Emitting progress percentage
                            } else if (event.type === HttpEventType.Response) {
                                // Handle response
                                if (Swal.isVisible()) {
                                    Swal.close();
                                }
                                console.log('File uploaded successfully:', event.body);
                                const res = event.body;
                                if (res.fileUploadMsg.length > 0) {
                                    this.fileUploadMsg = res.fileUploadMsg;
                                    this.showFileValidationError(this.fileUploadMsg);
                                } else if (res.uploadFileCount > 0) {
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: `${res.uploadFileCount} Signature Upload successful.`,
                                        showConfirmButton: false,
                                        timer: 5000
                                    });
                                }
                                this.resetValue();
                            }
                        },
                        (error) => {
                            if (Swal.isVisible()) {
                                Swal.close();
                            }
                            debugger
                            console.error('Error uploading file:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error To Reading The EXCEL File',
                                text: error.error ?? error.error.error ?? 'An unexpected error occurred.',
                                showConfirmButton: false,
                            }).then(()=>{
                                this.resetValue();
                            });

                            this.closeModale();
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
            }
            else if (result.isDenied) {
                Swal.fire('Upload Cancel', '', 'info');
                this.resetValue();
            }
        });

    }
    progress;
    downloadTemp() {
        const userId = this.cs.loadLoginUser()?.userId;
        let fileName = '';
        this.fileDown.downloadSignature(`download/template?userId=${userId}`).subscribe(event => {
            if (event.type === HttpEventType.ResponseHeader) {
                const contentDisposition = event.headers.get('content-disposition');
                if (contentDisposition) {
                    const matches = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (matches && matches.length > 1) {
                        fileName = matches[1];
                    }
                }
            } else if (event.type === HttpEventType.DownloadProgress) {
                this.progress = Math.round((event.loaded * 100) / event.total);
                console.log('progress: ', this.progress)
            } else if (event.type === HttpEventType.Response) {
                const blob = new Blob([event.body], { type: event.headers.get('content-type') });
                debugger
                saveAs(blob, fileName);
            }
        });

    }
    // uploadFile() {
    //     if (!this.xclFile) {
    //         Swal.fire('Please upload EXCEL file.');
    //         return;
    //     }

    //     Swal.fire({
    //         title: `Do you want Upload ${this.fileName[0]} file?`,
    //         showDenyButton: true,
    //         // showCancelButton: true,
    //         confirmButtonText: 'Upload',
    //         denyButtonText: 'Cancel',
    //     }).then((result: any) => {
    //         if (result.isConfirmed) {
    //             const formData: FormData = new FormData();

    //             if (this.xclFile) {
    //                 formData.append('files', this.xclFile);
    //             } else {
    //                 return;
    //             }


    //             this.cs.filePostBySecure('/file/upload', formData).subscribe((res: any) => {
    //                 Swal.fire({
    //                     position: 'top-end',
    //                     icon: 'success',
    //                     title: 'File Read Successful.',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                 }).then(r => {
    //                     // this.closeModale();
    //                     debugger
    //                     console.log(res);
    //                     if (res.fileUploadMsg.length > 0) {
    //                         this.fileUploadMsg = res.fileUploadMsg;
    //                         this.showFileValidationError(this.fileUploadMsg);
    //                     } else if (res.uploadFileCount > 0) {
    //                         Swal.fire({
    //                             position: 'top-end',
    //                             icon: 'success',
    //                             title: `${res.uploadFileCount} Signature Upload successful.`,
    //                             showConfirmButton: false,
    //                             timer: 1500
    //                         })
    //                     }
    //                     this.resetValue();
    //                 });

    //             }, (err: any) => {
    //                 alert(err.error.error);
    //                 this.closeModale();
    //             });
    //         } else if (result.isDenied) {
    //             Swal.fire('Upload Cancel', '', 'info');
    //             this.resetValue();
    //         }
    //     });

    // }




    head: string;
    headKey = new Set<string>();
    showFileValidationError(fileUploadMsg: any) {
        debugger
        console.log(fileUploadMsg);

        let serial = [];
        let body: string[] = [];

        fileUploadMsg.forEach(f => {
            serial.push(f.rowNum + 1);
            f.msg.forEach(m => {

                Object.keys(m).map((key) => {
                    this.headKey = this.buildTHeaderKey(key, this.headKey);

                });
            });
        });
        const col = 'col';
        fileUploadMsg.forEach((m: any, n) => {
            let col = `<tr><td> ${serial[n]} </td>`;

            Array.from(this.headKey).forEach((h, j) => {
                let value;
                m.msg.forEach(m => {
                    if (m[h]) {
                        value = '<td>' + m[h] + '</td>';
                    }
                });
                col = col + (value ?? '<td></td>');
            });

            col = col + '</tr>';
            body.push(col);
        });

        this.head = this.buildTHeader(this.headKey);

        const thead = `<div>
                            <thead style="position: sticky;top: 0;" class="thead-dark">
                                <th>Row No.</th>
                                ${this.head}
                            </thead>
                       </div>`;

        this.html = `<div style="height:420px; overflow-y: scroll;  font-size: 16px;">
                        <table class="table table-striped table-hover" style="width:100%; max-height:100px;">
                            ${thead}
                            <tbody >
                                
                                ${Array.from(body).join('')}
                            
                            </tbody>
                        </table>
                    </div>`;

        Swal.fire({
            // icon: 'error',
            title: 'Error List',
            html: this.html,
            width: 'auto',
            heightAuto: false,
            customClass: {
                popup: 'format-pre p-1',
                icon: 'icon-class mt-0 mb-0'
            },
        });

        // this.openErrPopup();

    }
    openErrPopup() {
        this.openErrorPopup = 'block';
    }
    cloaseErrorMsg() {
        this.openErrorPopup = 'none';
    }
    buildRow(mLength: any, hLength: number, i: any, value: any, headKey: Set<string>): string {
        let r;
        Array.from(headKey).forEach((h, j) => {
            r = this.selectColValue(mLength, hLength, i, j, h, headKey, value);
            // let v = '';
            // if (mLength == hLength) {
            //     if (i == j) {
            //         v = [...headKey][i];
            //         col = col + '<td>' + (value[v] ?? '') + '</td>';
            //     }
            // } else {
            //     v = h;
            //     col = col + '<td>' + (value[v] ?? '') + '</td>';
            // }
            return;
        });
        return r;
    }

    selectColValue(mLength: any, hLength: number, i: any, j: number, h: string, headKey: Set<string>, value: any): string {

        let v = '';

        if (mLength == hLength) {
            if (i == j) {
                v = [...headKey][i];
                return '<td>' + (value[v] ?? '') + '</td>';
            }
        } else {
            v = h;
            return '<td>' + (value[v] ?? '') + '</td>';
        }
        return;
    }

    @ViewChild('err')
    err!: TemplateRef<any>

    public html;
    buildTHeaderKey(key: string, headKey: Set<string>): Set<string> {
        const hd = key;
        headKey.add(hd);
        return headKey;
    }

    buildTHeader(headKey: Set<string>): string {
        let hd: string = '';
        headKey.forEach(key => {
            hd += `<th scope="col">${key}</th>`;
        });

        // const hd = `<th>${key}</th>`;
        //     head.add(hd);

        // if (!tKey) {
        //     tKey = key;
        //     const hd = `<th>${key}</th>`;
        //     head.add(hd);

        // }
        // else if (tKey != key) {
        //     tKey = key;
        //     const hd = `<th>${key}</th>`;
        //     head.add(hd);
        // }
        return hd;
    }

    uploadSignature(status: string, btnRef?: string) {
        this.btnClick = btnRef;
        var classList = document.getElementsByClassName('input ng-invalid');
        var classListm = document.getElementsByClassName('m-input ng-invalid');
        console.log(classList);
        for (let i = 0; i < classList.length; i++) {
            classList[i].removeAttribute('placeholder');
        }
        debugger
        for (let i = 0; i < classListm.length; i++) {
            classListm[i].removeAttribute('placeholder');
            classListm[i].removeAttribute('ng-reflect-placeholder');
        }



        // if (!this.signatureForm.value.signatoryId || this.signatureForm.value.signatoryId.length <= 0) {
        //     alert('Please select signatory.');
        //     return true;
        // }
        if (!this.signatureForm.valid) {
            Swal.fire('Please inter the all required value.');
            return;
        }

        // var blob = this.dataURItoBlob(this.croppedImage);
        // let f = new File([blob], this.signatureForm.value.signatoryId[0].signatoryId + '.' + blob.type.slice(blob.type.indexOf('/') + 1, blob.type.length), {
        //     type: blob.type
        // });

        if (this.previews?.length > 0) {
            this.files = [];
            this.previews.forEach((p, i) => {
                let blob = this.dataURItoBlob(p);
                let f = new File([blob], this.fileName[i], { type: blob.type });
                this.files.push(f);
            });
        }

        if (this.files.length < 0) {
            Swal.fire('Please upload signature.');
            return true;
        }
        if (this.previews?.length > 1 && !this.signatureForm.get('mainSignature')?.value) {
            Swal.fire('Please select main signature.');
            return true;
        }
        Swal.fire({
            title: 'Want to Submit?',
            // title: 'Are you want to Upload E-Signature?',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Confirm',
            denyButtonText: 'No',
        }).then((result: any) => {
            if (result.isConfirmed) {
                const formData: FormData = new FormData();
                // formData.append('accountId', this.signatureForm.value.accountId);
                formData.append('effictiveDateString', this.signatureForm.value.effictiveDate);
                formData.append('signatureStatus', this.signatureForm.value.signatureStatus);
                formData.append('signatoryId', this.signatureForm.value.signatoryId[0].signatoryId);
                formData.append('mainSignature', this.signatureForm.get('mainSignature').value);
                formData.append('signatureType', this.signatureForm.get('signatureType').value);
                formData.append('status', status);

                if (this.files.length > 0 && this.files != null) {
                    this.files.forEach(i => {
                        formData.append('files', i);
                    });
                } else {
                    return;
                }
                const uploadProgress$ = new Subject<number>();

                this.cs.filePostBySecure('/signature/upload', formData)
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
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Signature Upload successful.',
                                    showConfirmButton: false,
                                    timer: 5000
                                }).then(r => {
                                    this.btnClick = null;
                                    this.closeModale();
                                    console.log(res);
                                    this.resetValue();
                                });
                            }
                        },
                        (error) => {
                            console.error('Error uploading file:', error);
                            this.btnClick = null;
                            alert(error.error.error);
                            this.closeModale();
                            this.resetValue();
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

                // .subscribe(res => {
                //     // this.http.post(environment.SERVER_BASE_URL + '/signature/upload', formData, option).subscribe(res => {
                //     Swal.fire({
                //         position: 'top-end',
                //         icon: 'success',
                //         title: 'Signature Upload successful.',
                //         showConfirmButton: false,
                //         timer: 1500
                //     }).then(r => {
                //         this.btnClick = null;
                //         this.closeModale();
                //         console.log(res);
                //         this.resetValue();
                //     });

                // }, (err: any) => {
                //     this.btnClick = null;
                //     alert(err.error.error);
                //     this.closeModale();
                //     this.resetValue();
                // });
            } else if (result.isDenied) {
                Swal.fire('Upload Cancel', '', 'info');
                // this.fileName = [];
                // this.files = [];
                // this.isFile = false;
                // this.closeModale();
            }
        });

    }

    resetValue() {
        this.signatureForm.reset();
        this.signatureForm.get('signatureStatus').setValue('');
        this.signatureForm.get('mainSignature').setValue('');
        this.signatoryId = null;
        this.fileName = [];
        this.previews = [];
        this.files = [];
        this.isFile = false;
        this.xclFile = null;
        this.isConfirmedUpload = false;
        this.bankType = '';
        this.institutionId = null;
        this.userType = '';
        this.signatoryList.length = 0;
        this.insType = '';
        this.institutionList.length = 0;
        // this.closeModale();
    }

    deleteFile(from?: number) {
        // from !== 10 ? this.allFileRemove() : this.popupRemove();
        from !== 10 ? this.removeSignature(from) : this.popupRemove();
    }
    removeSignature(from: number) {
        this.previews.splice(from, 1);
        this.fileName.splice(from, 1);
    }
    popupRemove() {
        this.imageFile = null;
        this.isFile = false;
    }

    allFileRemove() {
        this.imageFile = null;
        this.previews = [];
        this.isFile = false;
        this.fileName = [];
    }


    modalRef: BsModalRef;
    updateImageId: number;
    // ref:string ;
    openModal(template: TemplateRef<any>, i?: number) {
        debugger
        this.setCropImageProperty(i, i != undefined ? true : false);

        this.modalRef = this.modalService.show(template);
    }
    setCropImageProperty(i: number, arg: boolean) {
        this.updateImageId = null;
        this.isFile = arg;
        const selectImag = this.previews[i] ?? null;
        let f;
        if (selectImag) {
            this.updateImageId = i;
            var blob = this.dataURItoBlob(selectImag);
            f = this.blob2File(blob);

        }
        this.imageFile = f ?? null;
    }
    blob2File(blob: Blob): any {
        return new File([blob], + '.' + blob.type.slice(blob.type.indexOf('/') + 1, blob.type.length), {
            type: blob.type
        });
    }

    imageChangedEvent: any = '';
    croppedImage: any = '';

    fileChangeEvent(event: any): void {
        debugger
        this.imageChangedEvent = event;
        this.isFile = true;
    }
    imageCropped(event: ImageCroppedEvent) {
        debugger
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    crop() {
        debugger
        // (this.updateImageId || this.updateImageId == 0)
        //     ? this.previews.splice(this.updateImageId, 1, this.croppedImage)
        //     : this.gettingFileInfo();

        if (this.updateImageId || this.updateImageId === 0) {
            this.previews.splice(this.updateImageId, 1, this.croppedImage)
            // this.changeBackground(this.croppedImage)
            //     .then(img => {
            //         // Assuming `this.previews` is an array and `this.updateImageId` is a valid index
            //         this.previews.splice(this.updateImageId, 1, img);
            //     })
            //     .catch(error => {
            //         console.error('Error processing image:', error);
            //         // Optionally handle errors here
            //     });
        } else {
            this.gettingFileInfo();
        }
        this.modalRef.hide();
    }

    @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
    changeBackground(image64: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const backgroundImg = new Image();
            const overlayImg = new Image();
            const ctx = this.canvas.nativeElement.getContext('2d');

            // Load the overlay image
            overlayImg.src = image64;
            overlayImg.onload = () => {
                // Create a temporary canvas to remove the white background from the overlay image
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');

                tempCanvas.width = overlayImg.width;
                tempCanvas.height = overlayImg.height;
                tempCtx.drawImage(overlayImg, 0, 0);

                // Remove white background from the overlay image
                this.removeWhiteBackground(tempCanvas);

                // Load the background image
                backgroundImg.src = "assets/images/prime_bank_background.png";
                backgroundImg.onload = () => {
                    // Set the main canvas size to match the background image
                    ctx.canvas.width = overlayImg.width;
                    ctx.canvas.height = overlayImg.height;
                    ctx.drawImage(backgroundImg, 0, 0);

                    // Draw the processed overlay image on top of the background
                    ctx.drawImage(tempCanvas, 0, 0);

                    // Add text to the image
                    ctx.font = 'bold 40px Arial'; // Font size and family
                    ctx.fillStyle = 'black'; // Text color
                    ctx.textAlign = 'center'; // Text alignment
                    ctx.textBaseline = 'middle'; // Text baseline

                    // Draw the text on top of the image
                    const text = this.signatoryId[0]?.name ?? '';
                    // const x = ctx.canvas.width / 1.2; // X position (centered)
                    // const y = ctx.canvas.height / 1.15; // Y position (centered)

                    const cx = ctx.canvas.width;
                    const cy = ctx.canvas.height;
                    const x = cx * 30 / 100;
                    // const x = 200;
                    const y = cy - 50;

                    ctx.fillText(this.signatoryId[0]?.name ?? '', x, y);
                    ctx.fillText(`PA (${this.selectPa ?? ''})`, cx - (x * 0.7), y);

                    // Convert the canvas to a Base64 image
                    const finalResult = ctx.canvas.toDataURL('image/png');
                    resolve(finalResult);
                };

                backgroundImg.onerror = (error) => {
                    reject(new Error('Error loading background image: ' + error));
                };
            };

            overlayImg.onerror = (error) => {
                reject(new Error('Error loading overlay image: ' + error));
            };
        });
    }

    removeWhiteBackground(canvas: HTMLCanvasElement): HTMLImageElement {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const threshold = 254; // Values near this will be considered white
        const tolerance = 100;  // How much deviation from white we can allow

        // Loop through each pixel
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            // Check if the pixel is close to white
            if (red > threshold - tolerance && green > threshold - tolerance && blue > threshold - tolerance) {
                // Set pixel to transparent
                data[i + 3] = 0; // Set alpha to 0 (fully transparent)
            }
        }

        // Put the updated image data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the updated image as an Image element
        const resultImg = new Image();
        resultImg.src = canvas.toDataURL('image/png');
        return resultImg;
    }



    gettingFileInfo() {
        this.fileName.push(`${this.selectPa}_${this.fileName?.length + 1}${this.upFileName.substring(this.upFileName.lastIndexOf('.'))}`);
        // this.previews.push(this.croppedImage);
        this.isChangeBg ? this.changeBackground(this.croppedImage).then(img => this.previews.push(img)).catch(e => console.log(e)) : this.previews.push(this.croppedImage);

        debugger
    }
    dataURItoBlob(croppedImage: any) {
        var byteString;
        if (croppedImage.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(croppedImage.split(',')[1]);
        else
            byteString = unescape(croppedImage.split(',')[1]);

        // separate out the mime component
        var mimeString = croppedImage.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    closeModale() {
        this.modalRef.hide();

        // this.allFileRemove();
        this.openErrorPopup = 'none';
    }

    type: string = 'text';
    onFocus(event): boolean {
        debugger
        console.log(event);
        if (this.type === 'text') {
            this.type = 'date';
        } else {
            this.type = event.attributes.type.value;
        }
        return event.attributes.type.value === 'text';
    }
    onFocusOut(event, value: any) {
        debugger
        console.log(value);

    }


    onResponse(service: Service, req: any, response: any) {
        // this.userType = '';
        // this.insType = '';
        // this.userType = '';
        this.loading = false;
        debugger
        this.type = 'text';
        this.btnClick = null;
        if (!super.isOK(response)) {
            Swal.fire(super.getErrorMsg(response));
            return;
        } else if (response.header.referance === 'SELECT') {
            if (response.payload?.allSignatory?.length) {
                this.signatoryList = response.payload?.allSignatory;
                console.log('signatory ', response.payload?.allSignatory);
            }
            else {
                Swal.fire({
                    title: 'Empty',
                    text: 'Signatory is Empty. Please add signatory first.',
                    timer: 5000,
                    icon: 'info',
                });
            }
            console.log(this.signatoryList);
        }
        else if (response.header.referance == 'SELECT_ALL_INSTITUTION') {
            console.log('institutin', response.payload);
            
            this.institutionList = response.payload;
            if (this.permissionStoreService.hasPermission(this.appPermission.HR_ROLE) && !this.cs.forceAllow()) {
                this.institutionList = this.institutionList.filter(m => m.institutionName.toUpperCase().includes('PRIME BANK'));
            }
            if (this.institutionList?.length <= 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Institution Not Found.',
                    text: 'Please Add Institution First.',
                    color: '#df4000',
                    background: '#a4fd4a',
                    iconColor: '#f0f0f0'
                });
            }
        }
    }
    onError(service: Service, req: any, res: any) {
        this.loading = false;
        console.log('error', req, res);
        this.btnClick = null;
        this.type = 'text';
        this.userType = '';
        this.insType = '';

    }


    helpMenu: string = 'out';


    toggleHelpMenu(value): void {
        debugger
        this.helpMenu = 'in';
        // this.helpMenu = value !== 'SINGLE' ? 'out' : 'in';
        // this.helpMenu = this.helpMenu === 'out' ? 'in' : 'out';
        // this.helpMenu = this.helpMenu === 'out' ? 'in' : 'out';
    }


}


