import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ActivityLogService } from '../layout/activity-log/activity-log.service';
import { ActivityType } from '../layout/activity-log/activity-type';
import { routerTransition } from '../router.animations';
import { validatePassword } from '../service/BlockToCamel';
import { EncrDecrService } from '../service/encr-decr.service';
import { Softcafe } from '../softcafe/common/Softcafe';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent extends Softcafe implements OnInit, AfterViewInit, Service {
  otpMessage: string = '';
  otpTimeout: any;
  varifyCode: boolean;
  // forgotPassForm : FormGroup;
  // forgotPassAuthForm: FormGroup;
  questionList: any[] = [];
  public selectedSecurityQueList: any[] = [];
  securityQueList: any[];
  submitted: boolean = false;
  questionAnsList: any;
  showButton: boolean = false;
  countdown: number = 120;
  timerSubscription: Subscription;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  logoName = environment.logoName

  configGroup: string = 'QUESTION';
  configSubGroup: string = 'QUESTION_ANS';


  captureSum: number;
  n1: number;
  n2: number;
  imageName: number = 0;
  btnClick: boolean = false;
  error: string;
  forgotPassForm = this.fb.group({
    loginName: ['', [Validators.required]],
    capture: ['', [Validators.required]],
    securityQuestionList: [[], [Validators.required]],
    password: [''],
    cnofPassword: [''],
  });
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'securityQuestionId',
    textField: 'securityQuestion',
    limitSelection: 3,
    noFilteredDataAvailablePlaceholderText: 'Sorry no data available.',
    noDataAvailablePlaceholderText: 'Data not found.',

    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };
  isSubmit: boolean = false;
  link: any;
  usrInfo: any;
  isPassMatch: boolean = false;
  otp: boolean = false;

  public loading: boolean = false;
  public primaryColour = '#dd0031';
  public secondaryColour = '#1976d2';
  public coloursEnabled = false;
  isValid: boolean = false;
  passValidation: boolean | any;
  requestFrom: string;
  isForgotPassword: boolean;
  constructor(public cs: CommonService,
    public router: Router,
    public fb: FormBuilder,
    private activityLogService: ActivityLogService,
    private encrDecr: EncrDecrService,

  ) {
    super();
    debugger
    if (router.url.includes('forgot-password')) {
     this.isForgotPassword = true;
  } else if(router.url.includes('user-unlock')) {
      this.isForgotPassword = false;
  } 
  console.log("hello" + this.requestFrom);
  
    // this.loading = true;
    // this.requestFrom = route.snapshot.url[0]['path'];
    console.log(this.requestFrom);
    let value = this.router.getCurrentNavigation().extractedUrl?.queryParams;
    console.log(value);

    if (value['link']) {
      this.link = value['link'];
      // this.checkLinkValidation(this.link);
    }
  }

  ngOnInit() {

    if (this.link) {
      this.checkLinkValidation(this.link);
    } else {
      this.loadSecurityQuestion();
    }


    // this.forgotPassAuthForm = this.fb.group({
    //   verificationCode: new FormControl(),
    //   newPass: new FormControl(),
    //   confirmPass: new FormControl()
    // });
    this.generateCapture();


  }
  ngAfterViewInit(): void {

    // this.spinner.hide();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  checkValidOtp(value) {
    this.loading = true;
    const payload = {
      otp: value,
      userId: this.usrInfo.userId ?? 0,
    }

    this.cs.sendRequestPublic(this, ActionType.SELECT_BY_OTP, ContentType.User, 'CHECK_OTP_VALIDATION', payload);

  }

  checkLinkValidation(value: Params) {
    this.loading = true;
    let payload = { link: value, }

    debugger

    this.cs.sendRequestPublic(this, ActionType.SELECT_1, ContentType.User, 'GETTING_INFO', payload);
  }
  onKey(value: any) {
    let v = value;
    debugger
    console.log('key pass value:, ', v);
    if (v && v !== '') {
      this.checkPassMatch(v, this.forgotPassForm.value.password!)
    }
  }
  checkPassMatch(checkPass, pass): boolean {
    return this.isPassMatch = pass === checkPass;
  }
  onSendCodeClick(form: FormGroup) {
    var payload = form.value;
    console.info(payload);
    this.cs.sendRequest(this, ActionType.FORGOT_PASS, ContentType.User, 'forgot_pass', payload);
  }

  confirmNavigation() {
    Swal.fire({
      title: "Confirmation",
      text: "You will be redirected to the login page.",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: 'Leave the Page',
      denyButtonText: 'Stay on Page',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  onChangePassClick() {
    this.btnClick = true

    if (this.isSubmit) {

      return;
    }
    let payload = this.forgotPassForm.value;

    if (!this.forgotPassForm.valid) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'Please add all requird information.'
      });
      return;
    }
    debugger

    if (this.checkCapture()) {
      this.checkCaptureValidation();
      this.generateCapture();
      return;
    }
    if (!this.checkQuestionValidation()) {
      // return alert('Please enter all question answer.')
      return;
    }

    payload.questionAnswer = this.selectedSecurityQueList;

    console.info(payload);

    Swal.fire({
      icon: 'info',
      title: 'Info',
      // text: 'Are you want to submit your request?',
      text: 'Want to Submit?',
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showConfirmButton: true,
      showDenyButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.loading = true;
        this.isSubmit = true;
        // this.cs.sendRequest(this, ActionType.CHANGE_PASS, ContentType.User, 'changePassword', payload);
        this.cs.sendRequestPublic(this, ActionType.FORGOT_PASS, ContentType.User, 'forgot_pass', payload);
      } else {
        return;
      }
    });

  }
  changePass() {
    this.btnClick = true;
    if (this.isSubmit) {
      return;
    }
    if (this.forgotPassForm.get('loginName').invalid) {
      return;
    }
    let payload = this.forgotPassForm.value;

    if (payload.loginName != this.usrInfo?.loginName) {
      Swal.fire('Sorry', 'User ID not match', 'error');
      return
    }

    debugger

    if (this.checkCapture()) {
      this.checkCaptureValidation();
      this.generateCapture();
      return;
    }


    if (!this.isPassMatch) {
      Swal.fire('Password does not match.');
      return;
    }
    if (!this.isValid) {
      Swal.fire('Password is not valid.')
      return;
    }
    payload.password = this.encryptPassword(this.forgotPassForm.value.password);
    payload.link = this.link;
    console.info(payload);

    Swal.fire({
      icon: 'info',
      title: 'Info',
      // text: 'Are you want to change your password?',
      text: 'Want to Submit?',
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showConfirmButton: true,
      showDenyButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.isSubmit = true;
        this.loading = true;
        this.cs.sendRequestPublic(this, ActionType.SAVE_NEW_PASS, ContentType.User, 'SAVE_NEW_PASS', payload)
      } else {
        return;
      }
    });

  }
  checkPassValidation(event: any) {
    this.forgotPassForm.get('cnofPassword').setValue('');
    this.isPassMatch = false;
    const ps = event.target.value;
    this.passValidation = validatePassword(ps);
    this.isValid = (this.passValidation && typeof (this.passValidation) === 'boolean') ? this.passValidation : this.passValidation?.isValid;
    debugger
  }
  encryptPassword(rawPassword: string): string {
    const sKey = environment.SECRET_KEY;
    const encrypted = this.encrDecr.set(sKey, rawPassword);
    console.log('encripted value: ', encrypted);
    return encrypted;
  }

  checkQuestionValidation(): boolean {
    // if (this.selectedSecurityQueList?.length == 3) {
    //   return this.checkAnswer(this.selectedSecurityQueList);
    // } 
    if (this.selectedSecurityQueList?.length == 1) {
      return this.checkAnswer(this.selectedSecurityQueList);
    }
    else {
      Swal.fire('Please select any one question.')
      return false;
    }
    // return this.selectedSecurityQueList?.length == 3 ? this.checkAnswer(this.selectedSecurityQueList) : false;
  }
  checkAnswer(questionList): boolean {
    let hasNoAnswer = questionList.filter(e => !e.questionAnswer);
    if (hasNoAnswer?.length > 0) {
      Swal.fire('Please answer the selected question.')
      return false;
    } else {
      return true;
    }
    // return hasNoAnswer.length > 0 ? false : true;
  }

  checkCaptureValidation() {
    if (this.forgotPassForm.get('capture').hasError('required') || this.forgotPassForm.get('capture').value?.length <= 0) {
      Swal.fire('Please answer the CAPTCHA.');
      return;
    }
    if (this.forgotPassForm.get('capture').value != this.captureSum) {
      Swal.fire('Wrong CAPTCHA.');
      return;
    }
    return;
  }

  checkSelectedQuestionList(event: any) {
    this.selectedSecurityQueList.length = 0;
    debugger
    console.log('selected question list', this.selectedSecurityQueList);

    const selectValue = this.securityQueList.find(f => f.securityQuestionId === event.securityQuestionId);

    // if (this.selectedSecurityQueList?.length > 3) {
    //   Swal.fire('You can select only any three security question.');
    //   this.selectedSecurityQueList.pop();
    //   return;
    // } else {
    //   this.selectedSecurityQueList.push(selectValue);
    // }
    this.selectedSecurityQueList.push(selectValue);

  }

  deSelectQuestion(value: any) {
    this.selectedSecurityQueList = this.selectedSecurityQueList.filter(f => f.securityQuestionId !== value.securityQuestionId);
  }

  onItemSelect(item: any) {
    debugger
    console.log('onItemSelect', item);
  }

  generateCapture() {
    console.log('ok');

    this.n1 = Math.floor(Math.random() * 10);
    this.n2 = Math.floor(Math.random() * 10);
    this.captureSum = this.n1 + this.n2;

    console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
    this.generatImagName();
  }
  generatImagName() {
    this.imageName = Math.floor(Math.random() * 10);
    console.log('image name: ', this.imageName);
  }
  loadCapture(): string {
    return this.n1 + ' + ' + this.n2 + ' = ?'
  }
  checkCapture(): boolean {
    return this.forgotPassForm.get('capture').hasError('required')
      || (this.forgotPassForm.get('capture').value != this.captureSum
        || this.forgotPassForm.get('capture').value?.length <= 0);
  }
  checkSecurityQuestionAnswer(): boolean {
    let res: boolean = false;
    if (this.questionList?.length) {
      this.questionList.forEach(q => {
        if (!res) {
          if (q.questionAnswer) {
            res = true;
          }
        }
      });
    }
    return res;
  }
  setStatus(): boolean {
    return (!this.forgotPassForm.get('securityQuestionList').value || this.forgotPassForm.get('securityQuestionList').value?.length < 3);
  }
  loadSecurityQuestion() {
    const payload = {};
    this.loading = true;
    this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_INFO, ContentType.SecurityQuestion, 'SELECT', payload);
  }
  // loadSecurityQuestion() {
  //   const payload = {};
  //   this.cs.sendRequestPublic(this, ActionType.SELECT, ContentType.SecurityQuestion, 'SELECT', payload);
  // }
  // loadAnswer() {
  //   const payload = {
  //     configGroup: this.configGroup,
  //     configSubGroup: this.configSubGroup,
  //   }
  //   this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_ANS, ContentType.SConfiguration, 'SELECT_ALL_ANS', payload);
  // }
  onOtpInput(event: any) {
    const value = event.target.value?.replace(/\D/g, '');
    event.target.value = value;
    if (value && value.length < 6) {
      this.otpMessage = 'OTP should be 6 digits';
    }
    else if (value && value.length === 6) {
      this.checkValidOtp(value);
      this.otpMessage = '';
    }
    //  else if (value.length > 0 && value.length < 6) {
    //   clearTimeout(this.otpTimeout);
    //   this.otpTimeout = setTimeout(() => {
    //     // this.otpMessage = 'OTP should be 6 digits';
    //   }, 2000);
    // } else {
    //   this.otpMessage = '';
    // }
  }
  // checkOtp(event) {
  //   const value = event.target.value;
  //   if (value && value?.length == 6) {
  //     this.checkValidOtp(value);

  //   }
  // }

  resetCapture() {
    this.generateCapture();
    this.forgotPassForm.get('capture').setValue('');
  }
  onResponse(service: Service, req: any, response: any) {
    this.loading = false;
    this.isSubmit = false;
    this.btnClick = false;
    this.resetCapture();
    debugger
    if (!super.isOK(response)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: super.getErrorMsg(response),
      })
      // .then(()=> this.router.navigate(['/login']));
      return;
    }
    if (response.header.referance == 'forgot_pass') {
      // this.varifyCode = true;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `An email has been sent to your registered email containing a password reset code. Completing the form will reset your password.`
      }).then(() => {
        // this.router.navigate(['/login'])
        this.usrInfo = response.payload;
        this.otp = true;
      });
      this.startCountdown();
      this.showButton = false;
      return;

    }
    else if (response.header.referance == 'SAVE_NEW_PASS') {
      // this.varifyCode = true;
      if (response.payload) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Your user successfully unlock. Page will re-direct back to login, please wait…`,
          timer: 5000,
        }).then(() => {
          this.activityLogService.saveSignatureActivity(ActivityType.FORGOT_PASSWORD, null, this.usrInfo?.email);


          this.router.navigate(['/login']);

        });
        return;

      }

    }
    else if (response.header.referance == 'forgot_pass_auth') {
      this.router.navigate(['/login']);
    } else if (response.header.referance == 'GETTING_INFO') {

      this.usrInfo = response.payload;
      console.log(this.usrInfo);

      // this.regiForm.patchValue(usrInfo);

    }
    else if (response.header.referance == 'CHECK_OTP_VALIDATION') {

      this.usrInfo = response.payload;
      console.log(this.usrInfo);
      this.link = this.usrInfo.link;

      // this.regiForm.patchValue(usrInfo);

    }
    else if (response.header.referance == 'SELECT') {
      this.securityQueList = response.payload;
      // this.securityQueList = response.payload.allQuestion;
      console.log('security question list', this.securityQueList);
      // this.loadAnswer();
    } else if (response.header.referance == 'SELECT_ALL_ANS') {
      this.questionAnsList = response.payload;
      console.log('security question liat', this.questionAnsList);
    }

  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
    this.loading = false;
  }
  interval = setInterval(() => {
    if (true) {
      console.log('ok');
      this.generateCapture();
      // console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
      // this.loadCapture();
    }
  }, 3 * 60 * 1000);

  startCountdown() {
    this.timerSubscription = interval(1000).subscribe((seconds) => {
      this.countdown = 180 - seconds;
      if (this.countdown <= 0) {
        this.showButton = true;

        this.timerSubscription.unsubscribe();
      }
    });
  }


}
