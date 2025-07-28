import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { validatePassword } from '../service/BlockToCamel';
import { EncrDecrService } from '../service/encr-decr.service';
import { Softcafe } from '../softcafe/common/Softcafe';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Component({
  selector: 'app-complete-regi',
  templateUrl: './complete-regi.component.html',
  styleUrls: ['./complete-regi.component.scss']
})
export class CompleteRegiComponent extends Softcafe implements OnInit, Service {

  firstLoginUserInfo: any;
  logoName = environment.logoName;
  submitted: boolean = false;
  loading: boolean = true;

  public selectedSecurityQueList = [];
  isReadOnly = true;
  regiForm = this.fb.group({
    userId: '',
    firstName: ['', [Validators.required]],
    lastName: [''],
    middleName: [''],
    // lastName: ['', Validators.pattern('^[a-zA-Z]{1,}$')],
    // middleName: ['', Validators.pattern('^[a-zA-Z]{1,}$')],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]],
    loginName: ['', [Validators.required]],
    branchId: [0, [Validators.required]],
    // password: [null, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')]],
    password: [''],
    cnofPassword: ['', [Validators.required]],
    logingMethod: environment.LOGIN_METHOD_LDAP,
    phoneNumber: ['', [Validators.pattern('^[0-9]{11,}$')]],
    defaultAdPass: '',
    fullName: '',
    branchName: '',
    securityQuestionList: [''],
    // selectedSecurityQueList
    capture: ['', Validators.required],
    userType: ['', Validators.required],
    institutionName: [''],
  });
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
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
  clicked = false;
  showProgress = false;

  securityQueList: any;
  questionAnsList: any;
  configGroup: string = 'QUESTION';
  configSubGroup: string = 'QUESTION_ANS';
  userType: String = 'EXTERNAL_USER';

  captureSum: number;
  n1: number;
  n2: number;
  imageName: number = 0;
  isPassMatch: boolean = null;
  link: Params;
  // validatePassword = validatePassword;
  isValid: boolean = false;
  passValidation: boolean | any;
  basicRes: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private cs: CommonService,
    private encrDecr: EncrDecrService,
  ) {
    super();
    this.generateCapture();
    debugger
    let value = this.router.getCurrentNavigation().extractedUrl?.queryParams;
    console.log(value);
    if (value) {

      if (value['firstLoginUserInfo']) {
        //need to work
        this.basicRes = value['firstLoginUserInfo'];
      }
      if (value['link']) {
        this.link = value;
        this.loadUserInformation(this.link);
      }
    }
    else {
      router.navigate(['/login']);
    }

  }
  ngOnInit(): void {
    // this.loadSecurityQuestion();
  }

  loadUserInformation(value: Params) {
    let payload = value;

    debugger
    this.loading = true;

    this.cs.sendRequestPublic(this, ActionType.SELECT_1, ContentType.User, 'GETTING_INFO', payload);
  }
  checkPassValidation(event: any) {
    debugger
    this.regiForm.get('cnofPassword').setValue('');
    this.isPassMatch = false;
    const ps = event.target.value;
    this.passValidation = validatePassword(ps);
    this.isValid = (this.passValidation && typeof (this.passValidation) === 'boolean') ? this.passValidation : this.passValidation?.isValid;
  }
  request4ResendLik(link: Params) {
    //request for resend link
    this.loading = true;
    let payload = {link: link};
    this.cs.sendRequestPublic(this, ActionType.REQUEST4LINK, ContentType.User, 'REQUEST4LINK', payload);
  }



  setStatus(): boolean {
    return (!this.regiForm.get('securityQuestionList').value || this.regiForm.get('securityQuestionList').value?.length < 3);
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
  // checkSelectedQuestionList() {
  //   debugger
  //   console.log('selected question list', this.selectedSecurityQueList);
  //   if (this.selectedSecurityQueList?.length > 3) {
  //     Swal.fire('You can select only any three security question.');
  //     this.selectedSecurityQueList.pop();
  //     return;
  //   }
  // }
  checkSelectedQuestionList(event: any) {
    debugger
    console.log('selected question list', this.selectedSecurityQueList);

    const selectValue = this.securityQueList.find(f => f.securityQuestionId === event.securityQuestionId);

    if (this.selectedSecurityQueList?.length > 3) {
      Swal.fire('You can select only any three security question.');
      this.selectedSecurityQueList.pop();
      return;
    } else {
      this.selectedSecurityQueList.push(selectValue);
    }
  }

  deSelectQuestion(value: any) {
    this.selectedSecurityQueList = this.selectedSecurityQueList.filter(f => f.securityQuestionId !== value.securityQuestionId);
  }


  checkCapture(): boolean {
    return this.regiForm.get('capture').hasError('required')
      || (this.regiForm.get('capture').value != this.captureSum
        || this.regiForm.get('capture').value?.length <= 0);
  }
  validatForm(): boolean {
    // frist name, loging name, email
    return this.regiForm.get('firstName').errors
      || this.regiForm.get('loginName').errors
      || this.regiForm.get('email').errors ? false : true;
  }
  checkQuestionValidation(): boolean {
    if (this.selectedSecurityQueList?.length == 3) {
      return this.checkAnswer(this.selectedSecurityQueList);
    } else {
      alert('Please select at least three question.')
      return false;
    }
    // return this.selectedSecurityQueList?.length == 3 ? this.checkAnswer(this.selectedSecurityQueList) : false;
  }
  // checkAnswer(questionList): boolean {
  //   let hasNoAnswer = questionList.filter(e => !e.securityQuestionAnswer);
  //   if (hasNoAnswer?.length > 0) {
  //     alert('Please answer all the selected question.')
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   // return hasNoAnswer.length > 0 ? false : true;
  // }

  checkAnswer(questionList): boolean {
    let hasNoAnswer = questionList.filter(e => !e.questionAnswer);
    if (hasNoAnswer?.length > 0) {
      alert('Please answer all the selected question.')
      return false;
    } else {
      return true;
    }
    // return hasNoAnswer.length > 0 ? false : true;
  }
  checkCaptureValidation() {
    if (this.regiForm.get('capture').hasError('required') || this.regiForm.get('capture').value?.length <= 0) {
      alert('Please answer the Cature.');
      return;
    }
    if (this.regiForm.get('capture').value != this.captureSum) {
      alert('Enter wrong Capture answer.');
      return;
    }
    return;
  }
  onKey(value: any) {
    let v = value;
    debugger
    console.log('key pass value:, ', v);
    if (v && v !== '') {
      this.checkPassMatch(v, this.regiForm.value.password!)
    }
  }

  encryptPassword(rawPassword: string): string {
    const sKey = environment.SECRET_KEY;
    const encrypted = this.encrDecr.set(sKey, rawPassword);
    console.log('encripted value: ', encrypted);
    return encrypted;
  }

  decryptPassword(encryptPassword: string): string {
    const sKey = environment.SECRET_KEY;
    const decrypted = this.encrDecr.get(sKey, encryptPassword);
    console.log('decrypt value: ', decrypted);
    return decrypted;
  }

  checkInternalUserValidation(payload: any): boolean {
    return (payload.branchId <= 0 || payload.branchId?.length <= 0) ? false : true;
  }

  checkPassMatch(checkPass, pass): boolean {
    return this.isPassMatch = pass === checkPass;
  }

  loadCapture(): string {
    return this.n1 + ' + ' + this.n2 + ' = ?'
  }

  // loadSecurityQuestion() {
  //   const payload = {};
  //   this.cs.sendRequestPublic(this, ActionType.SELECT, ContentType.SecurityQuestion, 'SELECT', payload);
  // }

  loadSecurityQuestion() {
    this.loading = true;
    const payload = {};
    this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_INFO, ContentType.SecurityQuestion, 'SELECT', payload);
  }


  register() {
    debugger
    var payload = JSON.parse(JSON.stringify( this.regiForm.value));
    // payload.userType = this.userType;
    // payload.defaultAdPass = environment.LDAP_PASSWORD;
    console.log('form value is: ', payload);

    this.submitted = true;

    if (!this.validatForm()) {
      alert('Please enter all requird information.')
      return;
    }
    if (!this.isValid) {
      // alert('Password is not valid.')
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'Password is not valid',
        confirmButtonText: 'OK',
    })
      return;
    }

    if (this.regiForm.value.password) {
      payload.password = this.encryptPassword(this.regiForm.value.password);
      delete payload.cnofPassword;
      
    } else {
      alert('Please enter password.');
      return;
    }

    // payload.password = this.regiForm.value.password ? this.encryptPassword(this.regiForm.value.password): alert('Please enter password.');
    // var decrypted = this.decryptPassword(payload.password);

    debugger

    if (payload.userType == 'INTERNAL_USER') {
      const enp = this.encryptPassword(environment.LDAP_PASSWORD);
      payload.defaultAdPass = enp;
      console.log('decrypted value: ', this.decryptPassword(enp));

      let internalUserValidation = this.checkInternalUserValidation(payload);
      // if (!internalUserValidation) {
      //   alert('Please enter the branch.')
      //   return;
      // }
    } else {

      if (!this.isPassMatch) {
        alert('Password not match.')
        return;
      }
    }

    if (!this.checkQuestionValidation()) {
      // return alert('Please enter all question answer.')
      return;
    }

    if (this.checkCapture()) {
      // alert('Please enter the Capture answer');
      this.checkCaptureValidation();
      this.generateCapture();
      return;
    }
    payload.securityQuestionList = JSON.parse(JSON.stringify(this.selectedSecurityQueList));
    payload?.securityQuestionList?.forEach(e => {
      delete e.questionAnsList;
      delete e.modDate;
      delete e.createDate;
      
    });

    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: 'Want to Submit?',
      confirmButtonText: 'Confirm',
      denyButtonText: 'No',
      showConfirmButton: true,
      showDenyButton: true,
    }).then(r => {
      if (r.isConfirmed) {

        this.clicked = true;
        this.showProgress = true;
        this.cs.sendRequestPublic(this, ActionType.REGISTER, ContentType.User, 'register', payload);
      } else {
        return;
      }
    });

  }

  loadAnswer() {
    const payload = {
      configGroup: this.configGroup,
      configSubGroup: this.configSubGroup,
    }
    this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_ANS, ContentType.SConfiguration, 'SELECT_ALL_ANS', payload);
  }

  onResponse(service: Service, req: any, response: any) {
    this.showProgress = false;
    this.clicked = false;
    this.loading = false;
    console.log('success');
    debugger
    if (!super.isOK(response)) {
      //alert(super.getErrorMsg(response));
      if (super.getErrorMsg(response).match('Password time is expired.')) {
        console.log('Password time is expired.');
        Swal.fire({
          // title: `${super.getErrorMsg(response)} Are you want to request for new Password?`,
          title: `Password time is expired!!!`,
          text: 'Your password time is expired. For resent click the Resent Button.',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Resent',
          cancelButtonText: 'No'
          // denyButtonText: `Don't save`
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.request4ResendLik(this.link['link']);
          } else {
            this.router.navigate(['/not-found']);
          }
        });

      } else {

        Swal.fire(super.getErrorMsg(response));
        this.router.navigate(['/not-found']);
        return;
      }
    }
    if (response.header.referance == 'register') {
      Swal.fire('Your user has been created.');
      this.regiForm.reset();
      localStorage.setItem("AUTH_TOKEN", this.basicRes.token);
      localStorage.setItem("IS_AUTHENTICATED", this.basicRes.authenticated);
      this.cs.storeLoginUser(response.payload[0]);
      this.router.navigate(['/login']);
    }
    // else if (response.header.referance == 'SELECT') {
    //   this.securityQueList = response.payload.allQuestion;
    //   console.log('security question list', this.securityQueList);
    //   this.loadAnswer();
    // } 
    else if (response.header.referance == 'SELECT') {
      this.securityQueList = response.payload;
      // this.securityQueList = response.payload.allQuestion;
      console.log('security question list', this.securityQueList);
      // this.loadAnswer();
    }
    else if (response.header.referance == 'SELECT_ALL_ANS') {
      this.questionAnsList = response.payload;
      console.log('security question liat', this.questionAnsList);
    }
    else if (response.header.referance == 'GETTING_INFO') {
      let usrInfo = response.payload;
      console.log(usrInfo);

      this.regiForm.patchValue(usrInfo);
      if (usrInfo) {
        this.loadSecurityQuestion();
      }
    }
    else if (response.header.referance == 'REQUEST4LINK') {
      let usrInfo: any = response.payload;
      console.log(usrInfo);
      if (usrInfo) {
        Swal.fire(`New Password is send to ${usrInfo.email}. Please check the mail and try again.`);
        this.router.navigate(['/login']);
      }
    }
  }

  onError(service: Service, req: any, res: any) {
    this.showProgress = false;
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
