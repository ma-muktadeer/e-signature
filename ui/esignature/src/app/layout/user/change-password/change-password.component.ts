import { Location } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validatePassword } from 'src/app/service/BlockToCamel';
import { EncrDecrService } from 'src/app/service/encr-decr.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { ActivityType } from '../../activity-log/activity-type';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends Softcafe implements OnInit, Service, OnChanges {
  error = null;
  // loginName = new FormControl('');
  // password = new FormControl('');
  // newPass = new FormControl('');
  // confirmPass = new FormControl('');
  // questionAns = new FormControl(['']);
  questionAns: any;

  captureSum: number;
  n1: number;
  n2: number;
  imageName: number = 0;

  questionAnsList: any;

  changePassForm = this.fb.group({
    loginName: '',
    password: ['', [Validators.required]],
    // newPass: ['', [Validators.required]],
    newPass: [null, [Validators.required]],
    confirmPass: ['', [Validators.required]],
    capture: ['', [Validators.required]],
    // questionAnswer: [],
    questionAns: [],
  });
  requestType: string;
  questionList: any;
  configGroup: string = 'QUESTION';
  configSubGroup: string = 'QUESTION_ANS';
  btnClick: boolean = false;
  isSubmit: boolean = false;
  isValid: boolean = false;
  user: any;
  isExternaluser: boolean;
  loading: boolean = false;
passValidation
  : boolean | any;
  constructor(private router: Router,
    private fb: FormBuilder,
    private cs: CommonService,
    private location: Location,
    private activityLogService: ActivityLogService,
    private encryptService: EncrDecrService) {
    super();
    this.requestType = router.getCurrentNavigation()?.extras.state?.requestType;
    console.log('curent state ', this.requestType);
    if (!this.requestType) {
      this.location.back();
    }
    this.user = cs.loadLoginUser();
    this.changePassForm.get('loginName').setValue(this.user?.loginName);

  }

  ngOnChanges() { }

  ngOnInit() {
    this.isExternaluser = this.user?.userType === 'EXTERNAL_USER';
    if (this.isExternaluser) {
      this.loadUserQuestionAndAnsList();
    }
    // this.loadAnswer();
    this.generateCapture();
  }


  // checkPassValidation(event: any) {
  //   debugger
  //   const ps = event.target.value;
  //   this.isValid = validatePassword(ps);
  // }
  checkPassValidation(event: any) {
    this.changePassForm.get('confirmPass').setValue('');
    this.isPassMatch = false;
    const ps = event.target.value;
    this.passValidation = validatePassword(ps);
    this.isValid = (this.passValidation && typeof(this.passValidation) === 'boolean') ? this.passValidation : this.passValidation?.isValid;
    debugger
  }
  // validatePassword = validatePassword;


  onKey(value: any) {
    let v = value;
    debugger
    console.log('key pass value:, ', v);
    if (v && v !== '') {
      this.checkPassMatch(v, this.changePassForm.value.newPass!)
    }
  }

  checkPassMatch(checkPass, pass): boolean {
    return this.isPassMatch = pass === checkPass;
  }
  isPassMatch: boolean = null;

  loadUserQuestionAndAnsList() {
    let payload = {
      userId: this.cs.getUserId(),
    }
    debugger
    this.loading = true;
    this.cs.sendRequest(this, ActionType.SELECT_3, ContentType.SecurityQuestion, 'SELECT_3', payload);
    // this.cs.sendRequest(this, ActionType.SELECT_3, ContentType.SecurityQuestionAnswer, 'SELECT_3', payload);
  }

  loadAnswer() {
    const payload = {
      configGroup: this.configGroup,
      configSubGroup: this.configSubGroup,
    }
    this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_ANS, ContentType.SConfiguration, 'SELECT_ALL_ANS', payload);
  }

  checkUserType(): boolean {
    return this.requestType == 'BY_USER';
  }

  onChangePassword() {
    this.error = null;
    if (this.isSubmit) {
      return;
    }
    this.btnClick = true;


    debugger
    var payload = this.changePassForm.value;
    // payload.password= '12131';
    console.log(payload);

    if (!payload.password) {
      this.error = "Old passowrd can not be empty.";
      return;
    }
    if (!payload.newPass) {
      this.error = "New passowrd can not be empty.";
      return;
    }
    if(payload?.newPass && !this.isValid){
      this.error = "New password is not valid.";
      return;
    }

    if (this.isValid && !payload.confirmPass) {
      this.error = "Confirm passowrd can not be empty.";
      return;
    }
    if (payload.newPass != payload.confirmPass) {
      this.error = "Password Mismatch";
      return;
    }
    if (payload.password == payload.newPass) {
      this.error = "Old password and new password must not be same";
      return;
    }
    if (!this.checkSecurityQuestionAnswer()) {
      Swal.fire({
        icon: 'error',
        text: 'Any one Question must be answerd.',
        timer: 5000,
      });
      return;
    }
    if (this.checkCapture()) {
      // alert('Please enter the Capture answer');
      // this.checkCaptureValidation();
      this.generateCapture();
      return;
    }

    payload.password = this.encryptService.set(environment.SECRET_KEY, this.changePassForm.value?.password);
    payload.newPass = this.encryptService.set(environment.SECRET_KEY, this.changePassForm.value?.newPass);
    payload.questionAnswer = this.questionList;

    // return

    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: `Want to Submit?`,
      // text: 'Are you want to change your password?',
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showConfirmButton: true,
      showDenyButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.isSubmit = true;
        this.cs.sendRequest(this, ActionType.CHANGE_PASS, ContentType.User, 'changePassword', payload);
      } else {
        return;
      }
    });

  }

  checkUserPassMatch(event: any){
    debugger
    const payload = this.changePassForm.value;

    this.cs.sendRequest(this, ActionType.CHECK_PASS, ContentType.User, 'check_pass', payload);
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

  checkCapture(): boolean {
    return this.changePassForm.get('capture').hasError('required')
      || (this.changePassForm.get('capture').value != this.captureSum
        || this.changePassForm.get('capture').value?.length <= 0);
  }

  resetForm() {
    const payload = {
      password: '',
      newPass: '',
      confirmPass: '',
      questionAns: [],
    };

    this.changePassForm.patchValue(payload);
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


  onResponse(service: Service, req: any, response: any) {
    this.btnClick = false;
    this.isSubmit = false;
    this.loading = false;
    debugger
    if (!super.isOK(response)) {
      Swal.fire({
        icon: 'error',
        title: 'Password Change Error',
        text: super.getErrorMsg(response) ? super.getErrorMsg(response) : 'You can’t make your last 3 past passwords as a new password.',
        // text: `${super.getErrorMsg(response)}`,
        // text: 'You can’t make your last 3 past passwords as a new password.',
        timer: null,
      }).then(() => this.resetForm());
      this.generateCapture();
      return;
    }
    else if (response.header.referance == 'changePassword') {
      this.isSubmit = false;
      // this.router.navigate(['/login']);
      console.debug('change password successful');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password change successfull.',
      }).then(() => {
        this.activityLogService.saveSignatureActivity(ActivityType.CHANGE_PASSWORD, null, this.user?.email);
        this.cs.logout(this);
      }
      )
    }
    else if (response.header.referance == 'logout') {
      console.log('logout success');
      this.cs.removeSession();
      this.router.navigate(["/login"]);
    }
    else if (response.header.referance == 'SELECT_3') {
      this.questionList = response.payload;
      console.log('questin list is: ', this.questionList);

      // if (this.questionList) {
      //   this.loadQuestionAnswer(this.questionList);
      // }
    } 
    else if (response.header.referance == 'SELECT_ALL_ANS') {
      this.questionAnsList = response.payload;
      console.log('security question liat', this.questionAnsList);
    }
    else if (response.header.referance == 'check_pass') {
     
      console.log('check_pass');
      
    }
  }
  onError(service: Service, req: any, response: any) {
    this.btnClick = false;
    this.isSubmit = false;
    this.loading = false;
    console.log('error');
  }

  interval = setInterval(() => {
    if (true) {
      console.log('ok');
      this.generateCapture();
      console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
      this.loadCapture();
    }
  }, 3 * 60 * 1000);


}
