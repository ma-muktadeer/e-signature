import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { RegexFormValidationService } from 'src/app/service/regex-form-validation.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail-tmp-pop',
  templateUrl: './mail-tmp-pop.component.html',
  styleUrls: ['./mail-tmp-pop.component.scss']
})
export class MailTmpPopComponent extends Softcafe implements OnInit, Service, AfterViewInit {

  @Input()
  private exitMailTemInfo: any;
  @Input()
  public isViewMode: boolean = false;
  @Input()
  public isRequestView: boolean = false;

  // public emailId = null;
  public emailSubject;
  public emailBody;
  public emailGroup = '';
  public emailType = '';

  isemailSubjectValid = true;
  isemailBodyValid = true;

  private Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  config: AngularEditorConfig = {
    editable: !this.isViewMode,
    spellcheck: true,
    height: '20rem',
    minHeight: '12rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultFontName: 'Times New Roman',
    fonts: [
      // { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      // { class: 'calibri', name: 'Calibri' },
      // { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontSize: '',
    sanitize: true,
    toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    // ]
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'] 
    ]
  };

  showApproveBtn = false;
  spinnerApproveBtn = false;
  spinnerSaveBtn = false;
  // disabledSaveBtn = false;
  public appPermission = AppPermission;

  saveOrUpdate: string;
  mailTempId: any;
  enableUpdate: boolean = false;
  emailEditBody: any;



  constructor(
    private cs: CommonService,
    private modelRef: NgbActiveModal,
    public permissioinStoreService: PermissioinStoreService,
    private cdf: ChangeDetectorRef,
    private regexFormValidationService: RegexFormValidationService
  ) {
    super();

  }

  ngOnInit(): void {
    debugger
    if (this.exitMailTemInfo) {
      this.setMailTempInfo(this.exitMailTemInfo);
    } else {
      this.saveOrUpdate = 'Save';
    }
  }
  ngAfterViewInit(): void {
    this.cdf.detectChanges
  }

  emailSubjectValidate() {
    this.isemailSubjectValid = this.regexFormValidationService.templateValidator(this.emailSubject);
  }
  emailBodyValidate(event?:any) {
    this.emailBody = event.target?.innerHTML;
    debugger
    this.isemailBodyValid = this.regexFormValidationService.templateValidator(event.target?.innerText);

  }

  onTokenCopy(token) {
    debugger;
    console.log(token);
    if (this.permissioinStoreService.hasPermission(this.appPermission.COPY_TEXT)) {
      if (token != null) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(token)
            .then(() => {
              Swal.fire({ title: "Copied to clipboard", toast: true, timer: 5000 });
            })
            .catch((error) => {
              console.error('Failed to copy:', error);
              this.fallbackCopyTextToClipboard(token);
            });
        } else {
          console.warn('Clipboard API not supported');
          this.fallbackCopyTextToClipboard(token);
        }
      }
    }
  }

  fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      if (successful) {
        Swal.fire({ title: "Copied to clipboard", toast: true, timer: 5000 });
      } else {
        // Handle the copy failure
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      // Handle the copy failure
    }

    document.body.removeChild(textArea);
  }

  public groupList = [
    { name: 'USER', value: 'USER' },
    { name: 'SIGNATURE', value: 'SIGNATURE' },
    { name: 'DOWNLOAD SIGNATURE', value: 'DOWNLOAD_SIGNATURE' },
    { name: 'PA', value: 'PA' },
    { name: 'REQUEST', value: 'REQUEST' }
  ]
  public tokenList: Map<string, { name: string, value: string }[]> = new Map<string, { name: string, value: string }[]>([
    ['USER', [
      { name: 'User Name', value: '#username#' },
      { name: 'User ID', value: '#userId#' },
      { name: 'OTP', value: '#otp#' },
      { name: 'Login ID', value: '#loginId#' },
      { name: 'OTP Expire Time', value: '#otpExpireTime#' },
      { name: 'Temp Password', value: '#tempPassword#' },
      { name: 'Temp Pass Expire', value: '#tempPasswordExpireTime#' },
      { name: 'Login Notify Time', value: '#loginNotifyTime#' },
      { name: 'Pass Notify Time', value: '#passNotifyTime#' },
      { name: 'User Email', value: '#userEmail#' },
      { name: 'Rejection Cause', value: '#rejectionCause#' },
      { name: 'User Type', value: '#userType#' },
      { name: 'Institution Name', value: '#institutionName#' },
      { name: 'Worng Login Try', value: '#loginTry#' },
    ]],
    ['SIGNATURE', [
      { name: 'PA', value: '#pa#' },
      { name: 'Signature Status', value: '#signatureStatus#' },
      { name: 'CANCEL TIME', value: '#cancelTime#' },
      { name: 'UPDATE TIME', value: '#updateTime#' },
      { name: 'EFFECTIVE DATE', value: '#effectiveDate#' },
      { name: 'CANCEL EFFECTIVE DATE', value: '#cancelEffectiveDate#' },
      { name: 'CANCEL CAUSE', value: '#cancelCause#' },
      { name: 'INACTIVE TIME', value: '#inactiveTime#' },
      { name: 'OLD STATUS', value: '#oldStatus#' },
      { name: 'Employee ID', value: '#employeeId#' },
      { name: 'PA Holder Name', value: '#paHolderName#' },
      { name: 'Rejection Cause', value: '#rejectionCause#' },
      { name: 'Designation', value: '#designation#' },
      { name: 'Division/Branch', value: '#divisionOrBranch#' },
      { name: 'Cell No', value: '#cellNo#' },
      { name: 'Email Address', value: '#emailAddress#' },
      { name: 'PA Status', value: '#paStatus#' },
    ]],
    ['DOWNLOAD_SIGNATURE', [
      { name: 'Downloader Email', value: '#downloaderEmail#' },
      { name: 'Downloader Name', value: '#downloaderName#' },
      { name: 'Institution Name', value: '#institutionName#' },
      { name: 'letter ref no', value: '#letterRefNo#' },
      { name: 'letter issue date', value: '#letterIssDate#' },
      { name: 'Remarks', value: '#remarks#' },
      { name: 'Download PA', value: '#pa#' },
      { name: 'PA Holder Name', value: '#paHolderName#' },
    ]],
    ['PA', [
      { name: 'PA', value: '#pa#' },
      { name: 'Employee ID', value: '#employeeId#' },
      { name: 'PA Holder Name', value: '#paHolderName#' },
      { name: 'Designation', value: '#designation#' },
      { name: 'Division/Branch', value: '#divisionOrBranch#' },
      { name: 'Cell No', value: '#cellNo#' },
      { name: 'Email Address', value: '#emailAddress#' },
      { name: 'Rejection Cause', value: '#rejectionCause#' },
      { name: 'PA Status', value: '#paStatus#' },
    ]],
    ['REQUEST', [
      { name: 'PA Holder Name', value: '#paHolderName#' },
      { name: 'Request User Name', value: '#requestUserName#' },
      { name: 'Request User Institution', value: '#institutionName#' },
      { name: 'Request User Email', value: '#requestUserEmail#' },
      { name: 'Request For', value: '#requestFor#' },
      { name: 'Request Description', value: '#description#' },
      { name: 'PA', value: '#pa#' },
      { name: 'Rejected By', value: '#rejectedBy#' },
      { name: 'Rejection Cause', value: '#rejectionCause#' },
      { name: 'Public Link', value: '#link#' },
      { name: 'Public Link From Time', value: '#linkStartTime#' },
      { name: 'Public Link To Time', value: '#linkEndTime#' },
    ]],

  ]);
  
  public typeList: Map<string, { name: string, value: string, disable: boolean, desc: string }[]> = new Map<string, { name: string, value: string, disable: boolean, desc: string }[]>([
    ['USER', [
      { name: '-- select one --', value: '', disable: true, desc: "" },
      { name: 'USER LOGIN', value: 'USER_LOGIN', disable: false, desc: "" },
      { name: 'USER LOGIN OTP', value: 'LOGIN_OTP', disable: false, desc: "" },
      { name: 'USER REJECT', value: 'USER_REJECT', disable: false, desc: "" },
      // { name: 'INTERNAL USER CREATION', value: 'INTERNAL_USER_CREATION', disable: false, desc: "This template will be use when internal user creation initialized." },
      // { name: 'EXTERNAL USER CREATION', value: 'EXTERNAL_USER_CREATION', disable: false, desc: "" },
      { name: 'FORGOT PASSWORD', value: 'FORGOT_PASSWORD', disable: false, desc: "" },
      { name: 'FIRST LOGING FIRST MAIL', value: 'FIRST_LOGING_FIRST_MAIL', disable: false, desc: "" },
      { name: 'FIRST LOGING SECOND MAIL', value: 'FIRST_LOGING_SECOUND_MAIL', disable: false, desc: "" },
      { name: 'RESEND PASSWORD', value: 'RESEND_PASSWORD', disable: false, desc: "" },
      { name: 'PASSWORD CHANGE SUCCESS', value: 'PASSWORD_CHANGE_SUCCESS', disable: false, desc: "" },
      { name: 'BLOCKED BY WRONG PASSWORD', value: 'BLOCK_BY_WRONG_PASS', disable: false, desc: "" },
      { name: 'PASSWORD CHANGE INFO', value: 'PASSWORD_CHANGE_INFO', disable: false, desc: "" },
      { name: 'LOGING NOTIFY TEN', value: 'LOGING_NOTIFY_TEN', disable: false, desc: "" },
      { name: 'LOGING NOTIFY SEVEN', value: 'LOGING_NOTIFY_SEVEN', disable: false, desc: "" },
      { name: 'PASSWORD NOTIFY TEN', value: 'PASS_NOTIFY_TEN', disable: false, desc: "" },
      { name: 'PASSWORD NOTIFY SEVEN', value: 'PASS_NOTIFY_SEVEN', disable: false, desc: "" },

      { name: 'INTERNAL INACTIVATION CHECK', value: 'INTERNAL_INACTIVATION_CHECK', disable: false, desc: "" },
      { name: 'EXTERNAL INACTIVATION CHECK', value: 'EXTERNAL_INACTIVATION_CHECK', disable: false, desc: "" },

      { name: 'INTERNAL ACTIVATION CHECK', value: 'INTERNAL_ACTIVATION_CHECK', disable: false, desc: "" },
      { name: 'EXTERNAL ACTIVATION CHECK', value: 'EXTERNAL_ACTIVATION_CHECK', disable: false, desc: "" },


    ]],

    ['SIGNATURE', [
      { name: '-- select one --', value: '', disable: true, desc: "" },
      { name: 'SIGNATURE CHECK', value: 'SIGNATURE_CHECK', disable: false, desc: "" },
      { name: 'SECOND SIGNATURE CHECK', value: 'SND_SIGNATURE_CHECK', disable: false, desc: "" },
      { name: 'SIGNATURE UPDATE CHECK', value: 'SIGNATURE_UPDATE_CHECK', disable: false, desc: "" },
      { name: 'REJECT MAIL', value: 'REJECT_MAIL', disable: false, desc: "" },
      { name: 'CANCEL CHECK', value: 'CANCEL_CHECK', disable: false, desc: "" },
      { name: 'SECOND CANCEL CHECK', value: 'SND_CANCEL_CHECK', disable: false, desc: "" },
      { name: 'CANCEL UPDATE CHECK', value: 'CANCEL_UPDATE_CHECK', disable: false, desc: "" },
      { name: 'DELETE CHECK', value: 'DELETE_CHECK', disable: false, desc: "" },
      { name: 'INACTIVATION CHECK', value: 'INACTIVATION_CHECK', disable: false, desc: "" },
      { name: 'SECOND INACTIVATION CHECK', value: 'SND_INACTIVATION_CHECK', disable: false, desc: "" },
      { name: 'INACTIVATION UPDATE CHECK', value: 'INACTIVATION_UPDATE_CHECK', disable: false, desc: "" },
    ]],

    ['DOWNLOAD_SIGNATURE', [
      { name: '-- select one --', value: '', disable: true, desc: "" },
      { name: 'SINGLE SIGNATURE', value: 'SINGLE_SIGNATURE', disable: false, desc: "" },
      { name: 'FULL SIGNATURE BOOKLET', value: 'FULL_SIGNATURE', disable: false, desc: "" },
    ]],

    ['PA', [
      { name: '-- select one --', value: '', disable: true, desc: "" },
      { name: 'PA CHECK', value: 'PA_CHECK', disable: false, desc: "" },
      { name: 'PA REJECT', value: 'PA_REJECT', disable: false, desc: "" },
      // { name: 'PBL ADMIN USER', value: 'PBL_ADMIN_USER', disable: false, desc: "" },
      { name: 'UPLOAD APPROVAL', value: 'UPLOAD_APPROVAL', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE APPROVAL', value: 'UPLOAD_UPDATE_APPROVAL', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE SIGNATURE APPROVAL', value: 'UPLOAD_UPDATE_SIGNATURE_APPROVAL', disable: false, desc: "" },
      { name: 'UPLOAD AGREEMENT', value: 'UPLOAD_AGREEMENT', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE AGREEMENT', value: 'UPLOAD_UPDATE_AGREEMENT', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE SIGNATURE AGREEMENT', value: 'UPLOAD_UPDATE_SIGNATURE_AGREEMENT', disable: false, desc: "" },
      { name: 'UPLOAD CANCELATION', value: 'UPLOAD_CANCELATION', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE CANCELATION', value: 'UPLOAD_UPDATE_CANCELATION', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE SIGNATURE CANCELATION', value: 'UPLOAD_UPDATE_SIGNATURE_CANCELATION', disable: false, desc: "" },
      { name: 'UPLOAD CANCELATION APPROVAL', value: 'UPLOAD_CANCELATION_APPROVAL', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE CANCELATION APPROVAL', value: 'UPLOAD_UPDATE_CANCELATION_APPROVAL', disable: false, desc: "" },
      { name: 'UPLOAD UPDATE SIGNATURE CANCELATION APPROVAL', value: 'UPLOAD_UPDATE_SIGNATURE_CANCELATION_APPROVAL', disable: false, desc: "" },
    ]],
    
    ['REQUEST', [
      { name: '-- select one --', value: '', disable: true, desc: "" },
      // { name: 'BOOKLET CHECK', value: 'BOOKLET_CHECK', disable: false, desc: "" },
      // { name: 'BOOKLET REJECT', value: 'BOOKLET_REJECT', disable: false, desc: "" },
      // { name: 'VERIFY SIGNATURE CHECK', value: 'VERIFY_SIGNATURE_CHECK', disable: false, desc: "" },
      // { name: 'VERIFY SIGNATURE REJECT', value: 'VERIFY_SIGNATURE_REJECT', disable: false, desc: "" },
      { name: 'GENERATE LINK CHECK', value: 'GENERATE_LINK_CHECK', disable: false, desc: "" },
      // { name: 'GENERATE LINK REJECT', value: 'GENERATE_LINK_REJECT', disable: false, desc: "" },
      // { name: 'OTHERS CHECK', value: 'OTHERS_CHECK', disable: false, desc: "" },
      // { name: 'OTHERS REJECT', value: 'OTHERS_REJECT', disable: false, desc: "" },
      // { name: 'USER CREATION CHECK', value: 'USER_CREATION_CHECK', disable: false, desc: "" },
      // { name: 'USER CREATION REJECT', value: 'USER_CREATION_REJECT', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'USER_ACTIVATION_CHECK', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'USER_ACTIVATION_REJECT', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'USER_DEACTIVATION_CHECK', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'USER_DEACTIVATION_REJECT', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'SERVICE_REQUEST_CHECK', disable: false, desc: "" },
      // { name: 'USER ACTIVATION CHECK', value: 'SERVICE_REQUEST_REJECT', disable: false, desc: "" },
    ]],

  ]);

  onChangeGroup(e) {
    console.log(this.emailGroup);
    debugger
    this.emailType = '';
    this.emailSubject = null;
    this.emailBody = null;
    this.saveOrUpdate = 'Save';
  }

  onChangeType() {
    console.log(this.emailType)
    debugger
    const payload = {
      group: this.emailGroup,
      type: this.emailType,
    }

    this.cs.sendRequest(this, ActionType.SELECT_1, ContentType.MailTemplete, 'SELECT_1', payload);
  }


  closePopup() {
    this.isViewMode = false;
    this.isRequestView = false;
    // this.emailId = null;
    this.emailSubject = null;
    this.emailBody = null;
    this.emailGroup = null;
    this.emailType = '';
    this.close('close');
  }



  onUpdateOrAddCustomerSetup() {
    debugger
    if (this.spinnerSaveBtn || this.isViewMode) {
      return
    }
    console.log(this.emailBody)
    if (!this.emailBody || !this.emailType || !this.emailGroup || !this.emailSubject) {
      Swal.fire("All Fields are mandatory");
      return;
    }
    var payload = {
      mailTempId: this.mailTempId,
      subject: this.emailSubject,
      body: this.emailBody,
      group: this.emailGroup,
      type: this.emailType,
      status: this.mailTempId ? 'PEND_MODIFIED' : 'NEW',
    }
    this.cs.sendRequest(this, ActionType.SAVE, ContentType.MailTemplete, 'NEW', payload);
    this.spinnerSaveBtn = true;
    // this.disabledSaveBtn = true

  }

  onApprove() {
    debugger
    if (this.spinnerApproveBtn) {
      return
    }
    var payload = {
      // mailTempletId: this.emailId,
      subject: this.emailSubject,
      body: this.emailBody,
      // mailGroup: this.emailGroup,
      type: this.emailType,
      approverId: this.cs.getUserId(),
    }
    // this.cs.sendRequestAdmin(this, ActionType.APPROVE, ContentType.MailTemplete, "Approved", payload);
    this.spinnerApproveBtn = true;
  }

  setMailTempInfo(payload: any) {
    debugger
    this.mailTempId = payload.mailTempId;
    this.emailSubject = this.isRequestView ? payload?.reqSubject ?? payload.subject : payload.subject;
    this.emailBody = this.isRequestView ? payload?.reqBody ?? payload.body : payload.body;
    this.emailEditBody = this.isRequestView ? payload?.reqBody ?? payload.body : payload.body;
    this.emailGroup = payload.group;
    this.emailType = payload.type;

    this.saveOrUpdate = this.isViewMode ? 'View' : 'Update';
  }
  removeInfo() {
    this.mailTempId = null;
    this.emailSubject = null;
    this.emailBody = null;
    this.saveOrUpdate = 'Save';
  }


  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return
    } else if (res.header.referance === 'NEW') {
      // this.disabledSaveBtn = false;
      this.spinnerSaveBtn = false;
      this.Toast.fire({
        icon: "success",
        title: "Mail template saved successfully."
      }).then(r => {
        this.close(res.payload);
      });
    }
    else if (res.header.referance === 'SELECT_1') {
      this.enableUpdate = true;
      if (res.payload) {
        this.setMailTempInfo(res.payload);
      } else {
        this.removeInfo();
      }
    }
    else if (res.header.referance == 'selectOne') {
      console.log(res)
      if (res.payload) {
        //load value

        this.emailBody = res.payload.body
        this.emailSubject = res.payload.subject
      }
      else {
        this.emailBody = null
        this.emailSubject = null
      }
    }
  }




  onError(service: Service, req: any, res: any) {
    console.log(('error'));

  }


  close(ref: string) {
    this.closeModal(ref);
  }
  closeModal(res: any) {
    debugger
    this.modelRef.close(res);
  }

}
