import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent extends Softcafe implements Service, OnInit {
  name: string;
  email: string;
  number: number;
  saveRef: string;
  sigAdInfoBtn: string = 'Save';
  selectedForm: string = 'user';
  panels = [
    {
      title: 'Signature Admin Information',
      content: 'This is the content of the first section.'
    },
    {
      title: 'Date Setup',
      content: 'This is the content of the second section.'
    },
    {
      title: 'Date Setup',
      content: 'This is the content of the second section.'
    },
    {
      title: 'Date Setup',
      content: 'This is the content of the second section.'
    },
  ];
  isOpen = new Array(this.panels.length).fill(true); // Keeps track of open/closed state
  passwordFromUI: string = '';
  lastLogin: number;
  lastChangePass: number;
  lastUserInfoBtn: string = 'Save';
  lengthInfoBtn: string = 'Save';
  lastLengthInfoBtn: string = 'Save';
  // displayName: string;
  desc: string;
  configSubGroup: string;
  employeeId: any;
  name2: any;
  empId: any;
  showSignatoryFields: any;
  showRoleFields: any;
  selectedGroup: any;
  designation: string;
  approval: string;
  address: string;
  nid: string;
  department: string;
  phone: any;
  showUserFields: any;
  firstName: string;
  lastName: string;
  phoneNumber: any;
  branch: any;
  designationU: any;
  nidU: any;
  securityQuestion: any;
  securityQuestionAnswer: any;
  domain: any;
  institutionName: any;
  cbsBranchId: string;
  branchName: string;
  routingNumber: string;
  adCode: string;
  numberUser: any;
  numberGenUser: any;
  public permissionStoreService: PermissioinStoreService;
  appPermission = AppPermission;


  // selectedForm: any;
  roleForm: FormGroup;
  buindForm: Map<string, FormGroup> = new Map();
  buindSubGroup: Map<string, string> = new Map([
    ['role', 'ROLE_FORM_SETUP'],
    ['signatory', 'SIGNATORY_FORM_SETUP'],
    ['user', 'USER_FORM_SETUP'],
    ['question', 'QUESTION_FORM_SETUP'],
    ['institution', 'INSTITUTION_FORM_SETUP'],
    ['branch', 'BRANCH_FORM_SETUP'],
    ['permission', 'PERMISSION_FORM_SETUP'],
  ]);
  signatoryForm: FormGroup;
  userForm: FormGroup;
  questionForm: FormGroup;
  institutionForm: FormGroup;
  branchForm: FormGroup;
  permissionForm: FormGroup;



  constructor(private cs: CommonService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadData();
  }

  buildForm() {
    this.roleForm = this.fb.group({
      displayName: [''],
      desc: ['']
    });

    this.signatoryForm = this.fb.group({
      empId: [''],
      name2: [''],
      designation: [''],
      approval: [''],
      address: [''],
      department: [''],
      phone: [''],
      nid: ['']
    });

    this.userForm = this.fb.group({
      empId: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      branch: [''],
      designation: [''],
      nid: [''],
      remarks: [''],
      
    });

    this.questionForm = this.fb.group({
      securityQuestion: [''],
      securityQuestionAnswer: ['']
    });

    this.institutionForm = this.fb.group({
      institutionName: [''],
      domain: [''],
      numberUser: [''],
      numberGenUser: ['']
    });

    this.branchForm = this.fb.group({
      cbsBranchId: [''],
      branchName: [''],
      adCode: [''],
      routingNumber: ['']
    });
    this.permissionForm = this.fb.group({
      displayNameP: [''],
      descP: [''],

    });

    this.buindForm.set('role', this.roleForm);
    this.buindForm.set('signatory', this.signatoryForm);
    this.buindForm.set('user', this.userForm);
    this.buindForm.set('question', this.questionForm);
    this.buindForm.set('institution', this.institutionForm);
    this.buindForm.set('branch', this.branchForm);
    this.buindForm.set('permission', this.permissionForm);
  }

  checkFormValue(selectedForm: any) {
    const form = this.buindForm.get(selectedForm)?.value;
    this.lengthInfoBtn = form ? Object.values(form).some(v => v !== null && v !== '' && v != undefined) ? 'Update' : 'Save' : 'Save';
  }

  buildFormValue(): any {

    const formValue = this.findForm().value;

    return this.buildValue(formValue);
  }

  buildValue(formValue: any): any {
    let res: any[] = [];

    if (formValue) {
      Object.keys(formValue).forEach(key => {
        res.push(this.buildLengthValue(formValue[key], key));
      });
    }

    return res;
  }

  findForm(): FormGroup {
    return this.buindForm.get(this.selectedForm);
  }

  loadData() {
    debugger
    forkJoin([this.loadSigAdInfo(), this.loadLastUserInfo(), this.loadLastCharecterMaxLength()]).subscribe(f => {
      console.log('value ', f);
      this.setSigAdInfoValue(f[0]['payload']);
      this.setLastUserInfoValue(f[1]['payload']);
      this.maxLengthInfoValue(f[2]['payload']);
    })
  }

  loadSigAdInfo() {
    const payload = {
      configGroup: `SIG_AD_INFO_GROUP`,
      configSubGroup: `SIG_AD_INFO_SUBGROUP`,
    }

    return this.cs.execute(ActionType.SELECT_ALL_APP_AD_INFO, ContentType.SConfiguration, payload);
  }

  loadLastUserInfo() {
    const payload = {
      configGroup: `LAST_USER_INFO_GROUP`,
      configSubGroup: `LAST_USER_INFO_SUBGROUP`,
    }

    return this.cs.execute(ActionType.SELECT_ALL_LAST_USER_CONFIG, ContentType.SConfiguration, payload);
  }

  loadLastCharecterMaxLength() {
    const payload = {
      configGroup: `CHARACTER_MAX_LENGTH_GROUP`,
      // configSubGroup: `SIG_AD_INFO_SUBGROUP`,
    }

    return this.cs.execute(ActionType.SELECT_MAX_LENGTH_INFO, ContentType.SConfiguration, payload);
  }

  togglePanel(index: number) {
    // this.panels.forEach((e, i) => {
    //   this.isOpen[i] = i === index;
    // });
    debugger
    this.isOpen[index] = !this.isOpen[index];
    // this.isOpen[index] = true;
  }


  save(ref: string) {
    if (ref === 'SIG_AD_INFO') {
      this.saveRef = ref;
      this.buildSigAdInfo();
    }
    else if (ref === 'LAST_USER_INFO') {
      this.saveRef = ref;
      this.buildLastUserInfo();
    }
    else if (ref === 'CHARACTER_MAX_LENGTH') {
      // this.saveRef = ref;
      this.buildLastCharecterMaxLength();

    }
  }
  buildLastCharecterMaxLength() {
    // const payload = {
    //   requestData: this.buildInfo2(this.displayName, this.desc, this.empId,
    //     this.name2, this.designation, this.approval, this.address, this.department,
    //     this.nid, this.phone, this.firstName, this.lastName, this.phoneNumber,
    //     this.branch, this.designationU, this.nidU,
    //     this.securityQuestion, this.securityQuestionAnswer, this.institutionName, this.domain, this.cbsBranchId, this.branchName, this.adCode, this.routingNumber, this.numberUser, this.numberGenUser)
    // };

    const payload = {
      requestData: this.buildFormValue(),
    }

    debugger
    Swal.fire({
      icon: 'question',
      title: 'Attention',
      text: `Want to Submit?`,
      showConfirmButton: true,
      confirmButtonText: `Confirm`,
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.SAVE_APP_CONFIG, ContentType.SConfiguration, 'SELECT_SIG', payload);
      }
    });
  }

  buildLastUserInfo() {
    const payload = {
      requestData: this.buildLastInfo(this.lastLogin, this.lastChangePass)
    };
    debugger
    Swal.fire({
      icon: 'question',
      title: 'Attention',
      text: `Want to Submit?`,
      // text: `Are you want to ${ref} information?`,
      showConfirmButton: true,
      // confirmButtonText: `${ref}`,
      confirmButtonText: `Confirm`,
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.SAVE_APP_CONFIG, ContentType.SConfiguration, 'SELECT_SIG', payload);
      }
    });
  }
  buildSigAdInfo() {
    const payload = {
      requestData: this.buildInfo(this.name, this.email, this.number)
    };

    debugger
    Swal.fire({
      icon: 'question',
      title: 'Attention',
      text: `Want to Submit?`,
      // text: `Are you want to ${this.saveRef === 'SIG_AD_INFO' ? this.sigAdInfoBtn : ''} information?`,
      showConfirmButton: true,
      // confirmButtonText: `${this.saveRef === 'SIG_AD_INFO' ? this.sigAdInfoBtn : ''}`,
      confirmButtonText: `Confirm`,
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.SAVE_APP_CONFIG, ContentType.SConfiguration, 'SELECT_SIG', payload);
      }
    });
  }

  encPass(encreptOrDecrept) {

    if(!this.passwordFromUI.trim()){
      Swal.fire('Error', 'Please enter password.', 'error');
      return;
    }

    var payload = {
      password: this.passwordFromUI.trim(),
      encDecFlag:encreptOrDecrept
    }
  debugger

  this.cs.sendRequest(this, ActionType.PASSWORD_ENCREPT, ContentType.SConfiguration, 'PASSWORD_ENCREPT', payload);
  
  }

  buildLastInfo(lastLogin: number, lastChangePass: number): any {
    let payload: any[] = [];
    if (lastLogin) {
      payload.push(this.build(lastLogin, 'LAST_LOGIN'));
    }
    if (lastChangePass) {
      payload.push(this.build(lastChangePass, 'LAST_CHANGE_PASS'));
    }

    return payload;
  }
  buildInfo(name: string, email: string, number: number): any {
    let payload: any[] = [];
    if (name) {
      payload.push(this.build(name, 'NAME'));
    }
    if (email) {
      payload.push(this.build(email, 'EMAIL'));
    }
    if (number) {
      payload.push(this.build(number, 'NUMBER'));
    }
    return payload;
  }

  // buildInfo2(displayName: string, desc: string, empId: string, name2: string,
  //   designation: string, approval: string, address: string, department: string, nid: string,
  //   phone: any, firstName: string, lastName: string, phoneNumber: string, branch: string,
  //   designationU: string, nidU: string, securityQuestion: string, securityQuestionAnswer: string, institutionName: string, domain: string, cbsBranchId: string, branchName: string, adCode: string, routingNumber: string, numberUser: string, numberGenUser: string): any {
  //   let payload: any[] = [];
  //   if (displayName) {
  //     payload.push(this.build2(displayName, 'displayName'));
  //   }
  //   if (desc) {
  //     payload.push(this.build2(desc, 'desc'));
  //   }
  //   if (empId) {
  //     payload.push(this.build2(empId, 'empId'));
  //   }
  //   if (name2) {
  //     payload.push(this.build2(name2, 'name2'));
  //   }
  //   if (designation) {
  //     payload.push(this.build2(designation, 'designation'));
  //   }
  //   if (approval) {
  //     payload.push(this.build2(approval, 'approval'));
  //   }
  //   if (address) {
  //     payload.push(this.build2(address, 'address'));
  //   }
  //   if (department) {
  //     payload.push(this.build2(department, 'department'));
  //   }
  //   if (nid) {
  //     payload.push(this.build2(nid, 'nid'));
  //   }
  //   if (phone) {
  //     payload.push(this.build2(phone, 'phone'));
  //   }
  //   //User Form start
  //   if (firstName) {
  //     payload.push(this.build2(firstName, 'firstName'));
  //   }
  //   if (lastName) {
  //     payload.push(this.build2(lastName, 'lastName'));
  //   }
  //   if (phoneNumber) {
  //     payload.push(this.build2(phoneNumber, 'phoneNumber'));
  //   }
  //   if (branch) {
  //     payload.push(this.build2(branch, 'branch'));
  //   }
  //   if (designationU) {
  //     payload.push(this.build2(designationU, 'designationU'));
  //   }
  //   if (nidU) {
  //     payload.push(this.build2(nidU, 'nidU'));
  //   }
  //   //sequrity question
  //   if (securityQuestion) {
  //     payload.push(this.build2(securityQuestion, 'securityQuestion'));
  //   }
  //   if (securityQuestionAnswer) {
  //     payload.push(this.build2(securityQuestionAnswer, 'securityQuestionAnswer'));
  //   }
  //   //institution
  //   if (institutionName) {
  //     payload.push(this.build2(institutionName, 'institutionName'));
  //   }
  //   if (domain) {
  //     payload.push(this.build2(domain, 'domain'));
  //   }
  //   if (numberUser) {
  //     payload.push(this.build2(numberUser, 'numberUser'));
  //   }
  //   if (numberGenUser) {
  //     payload.push(this.build2(numberGenUser, 'numberGenUser'));
  //   }
  //   //branch
  //   if (cbsBranchId) {
  //     payload.push(this.build2(cbsBranchId, 'cbsBranchId'));
  //   }
  //   if (branchName) {
  //     payload.push(this.build2(branchName, 'branchName'));
  //   }
  //   if (adCode) {
  //     payload.push(this.build2(adCode, 'adCode'));
  //   }
  //   if (routingNumber) {
  //     payload.push(this.build2(routingNumber, 'routingNumber'));
  //   }
  //   return payload;
  // }


  build(value1: string | number, value5: string): any {
    return {
      configGroup: `${this.saveRef}_GROUP`,
      configSubGroup: `${this.saveRef}_SUBGROUP`,
      value1: value1,
      value5: value5,
    };
  }
  buildLengthValue(value1: string | number, value5: string): any {
    return {
      configGroup: 'CHARACTER_MAX_LENGTH_GROUP',
      configSubGroup: this.buindSubGroup.get(this.selectedForm),
      value1: value1,
      value5: value5,
    };
  }

  // build2(value1: string | number, value5: string): any {
  //   return {
  //     configGroup: `CHARACTER_MAX_LENGTH_GROUP`,
  //     // configSubGroup: this.configSubGroup,
  //     configSubGroup: `${this.saveRef}`,
  //     value1: value1,
  //     value5: value5,
  //   };
  // }

  updateConfigSubGroup(subGroup: string) {
    this.configSubGroup = subGroup;
    console.log('Updated configSubGroup:', this.configSubGroup);
  }

  setSigAdInfoValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        if (e.value5 === 'NAME') {
          this.name = e.value1;
        }
        if (e.value5 === 'EMAIL') {
          this.email = e.value1;
        }
        if (e.value5 === 'NUMBER') {
          this.number = e.value1;
        }
      });
      this.sigAdInfoBtn = 'Update';
    }
  }
  // maxLengthInfoValue(value: any) {
  //   if (value.length) {
  //     value.forEach(e => {
  //       if (e.value5 === 'branchName') {
  //         this.branchName = e.value1;
  //       }
  //       if (e.value5 === 'cbsBranchId') {
  //         this.cbsBranchId = e.value1;
  //       }
  //     });
  //     this.sigAdInfoBtn = 'Update';
  //   }
  // }

  maxLengthInfoValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        // Set values to the form controls directly
        if (e.value5 === 'branchName') {
          this.branchForm.get('branchName').setValue(e.value1);
        }
        if (e.value5 === 'cbsBranchId') {
          this.branchForm.get('cbsBranchId').setValue(e.value1);
        }
        if (e.value5 === 'adCode') {
          this.branchForm.get('adCode').setValue(e.value1);
        }
        if (e.value5 === 'routingNumber') {
          this.branchForm.get('routingNumber').setValue(e.value1);
        }
        if (e.value5 === 'displayName') {
          this.roleForm.get('displayName').setValue(e.value1);
        }
        if (e.value5 === 'desc') {
          this.roleForm.get('desc').setValue(e.value1);
        }
        if (e.value5 === 'firstName') {
          this.userForm.get('firstName').setValue(e.value1);
        }
        if (e.value5 === 'empId') {
          this.userForm.get('empId').setValue(e.value1);
        }
        if (e.value5 === 'lastName') {
          this.userForm.get('lastName').setValue(e.value1);
        }
        if (e.value5 === 'phoneNumber') {
          this.userForm.get('phoneNumber').setValue(e.value1);
        }
        if (e.value5 === 'branch') {
          this.userForm.get('branch').setValue(e.value1);
        }
        if (e.value5 === 'designation') {
          this.userForm.get('designation').setValue(e.value1);
        }
        if (e.value5 === 'nid') {
          this.userForm.get('nid').setValue(e.value1);
        }
        if (e.value5 === 'securityQuestion') {
          this.questionForm.get('securityQuestion').setValue(e.value1);
        }
        if (e.value5 === 'securityQuestionAnswer') {
          this.questionForm.get('securityQuestionAnswer').setValue(e.value1);
        }
        if (e.value5 === 'institutionName') {
          this.institutionForm.get('institutionName').setValue(e.value1);
        }
        if (e.value5 === 'domain') {
          this.institutionForm.get('domain').setValue(e.value1);
        }
        if (e.value5 === 'numberUser') {
          this.institutionForm.get('numberUser').setValue(e.value1);
        }
        if (e.value5 === 'numberGenUser') {
          this.institutionForm.get('numberGenUser').setValue(e.value1);
        }
        if (e.value5 === 'empId') {
          this.signatoryForm.get('empId').setValue(e.value1);
        }
        if (e.value5 === 'name2') {
          this.signatoryForm.get('name2').setValue(e.value1);
        }
        if (e.value5 === 'designation') {
          this.signatoryForm.get('designation').setValue(e.value1);
        }
        if (e.value5 === 'approval') {
          this.signatoryForm.get('approval').setValue(e.value1);
        }
        if (e.value5 === 'address') {
          this.signatoryForm.get('address').setValue(e.value1);
        }
        if (e.value5 === 'department') {
          this.signatoryForm.get('department').setValue(e.value1);
        }
        if (e.value5 === 'phone') {
          this.signatoryForm.get('phone').setValue(e.value1);
        }
        if (e.value5 === 'nid') {
          this.signatoryForm.get('nid').setValue(e.value1);
        }
        if (e.value5 === 'displayNameP') {
          this.permissionForm.get('displayNameP').setValue(e.value1);
        }
        if (e.value5 === 'descP') {
          this.permissionForm.get('descP').setValue(e.value1);
        }
        if (e.value5 === 'remarks') {
          this.userForm.get('remarks').setValue(e.value1);
        }




      });
      // Update the button text after processing
      this.checkFormValue(this.selectedForm);
    }
  }
  // maxLengthInfoValue(value: any) {
  //   if (value.length) {
  //     value.forEach(e => {
  //       if (e.value5 === 'branchName') {
  //         this.branchName = e.value1;
  //       }
  //       if (e.value5 === 'cbsBranchId') {
  //         this.cbsBranchId = e.value1;
  //       }
  //       // if (e.value5 === 'displayName') {
  //       //   this.displayName = e.value1;
  //       // }
  //       if (e.value5 === 'desc') {
  //         this.desc = e.value1;
  //       }
  //       if (e.value5 === 'empId') {
  //         this.empId = e.value1;
  //       }
  //       if (e.value5 === 'name2') {
  //         this.name2 = e.value1;
  //       }
  //       if (e.value5 === 'designation') {
  //         this.designation = e.value1;
  //       }
  //       if (e.value5 === 'approval') {
  //         this.approval = e.value1;
  //       }
  //       if (e.value5 === 'address') {
  //         this.address = e.value1;
  //       }
  //       if (e.value5 === 'department') {
  //         this.department = e.value1;
  //       }
  //       if (e.value5 === 'nid') {
  //         this.nid = e.value1;
  //       }
  //       if (e.value5 === 'phone') {
  //         this.phone = e.value1;
  //       }
  //       if (e.value5 === 'firstName') {
  //         this.firstName = e.value1;
  //       }
  //       if (e.value5 === 'lastName') {
  //         this.lastName = e.value1;
  //       }
  //       if (e.value5 === 'phoneNumber') {
  //         this.phoneNumber = e.value1;
  //       }
  //       if (e.value5 === 'branch') {
  //         this.branch = e.value1;
  //       }
  //       if (e.value5 === 'designationU') {
  //         this.designationU = e.value1;
  //       }
  //       if (e.value5 === 'nidU') {
  //         this.nidU = e.value1;
  //       }
  //       if (e.value5 === 'securityQuestion') {
  //         this.securityQuestion = e.value1;
  //       }
  //       if (e.value5 === 'securityQuestionAnswer') {
  //         this.securityQuestionAnswer = e.value1;
  //       }
  //       if (e.value5 === 'institutionName') {
  //         this.institutionName = e.value1;
  //       }
  //       if (e.value5 === 'domain') {
  //         this.domain = e.value1;
  //       }
  //       if (e.value5 === 'adCode') {
  //         this.adCode = e.value1;
  //       }
  //       if (e.value5 === 'routingNumber') {
  //         this.routingNumber = e.value1;
  //       }
  //       if (e.value5 === 'numberUser') {
  //         this.numberUser = e.value1;
  //       }
  //       if (e.value5 === 'numberGenUser') {
  //         this.numberGenUser = e.value1;
  //       }
  //     });
  //     // Update the button text after processing
  //     this.sigAdInfoBtn = 'Update';
  //   }
  // }

  setLastUserInfoValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        if (e.value5 === 'LAST_LOGIN') {
          this.lastLogin = e.value1;
        }
        if (e.value5 === 'LAST_CHANGE_PASS') {
          this.lastChangePass = e.value1;
        }

      });
      this.lastUserInfoBtn = 'Update';
    }
  }


  setMaxLengthValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        if (e.value5 === 'NAME') {
          this.name = e.value1;
        }
        if (e.value5 === 'EMAIL') {
          this.email = e.value1;
        }
        if (e.value5 === 'NUMBER') {
          this.number = e.value1;
        }
      });
      this.lastLengthInfoBtn = 'Update';
    }
  }
  

  alertSuccess(action: string): any {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `${action} success`,
      timer: 5000,
    });
  }
  
  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: super.getErrorMsg(res),
        timer: 5000,
      }).then(() => { return; });
      return;
    }
    else if (res.header.referance === 'SELECT_SIG') {
      let value = res.payload;
      if (!(value instanceof Array)) {
        value = [value];
      }
      this.alertSuccess(this.sigAdInfoBtn).then(() => {
        if (this.saveRef === 'SIG_AD_INFO') {
          this.name = this.email = this.number = null;
          this.setSigAdInfoValue(value);
        }
        else if (this.saveRef === 'LAST_USER_INFO') {
          this.lastLogin = this.lastChangePass = null;
          this.setLastUserInfoValue(value);
        } 

        
      });



    }else if (res.header.referance === 'PASSWORD_ENCREPT') {
      console.log(res.payload)
      this.encriptPasswordResponse=res.payload.password;
    }
  }

  public encriptPasswordResponse:any;

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
