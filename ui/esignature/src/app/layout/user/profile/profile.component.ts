import { Location } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { UserService } from '../../admin/services/user.service';

import { HttpEventType } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { DateConvertService } from 'src/app/service/date-convert.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { RegexFormValidationService } from 'src/app/service/regex-form-validation.service';
import { SconfigService } from 'src/app/service/sconfig.service';
import { InstitutionAddComponent } from 'src/app/shard-module/institution-add/institution-add.component';
import { AppRole } from 'src/app/softcafe/common/AppRole';
import { ProfileImageService } from 'src/app/softcafe/common/profile-image.service';
import { environment } from '../../../../environments/environment';
import { INSTITUTION_TYPE, InstitutionType } from '../../admin/moder/institution_type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends Softcafe implements OnInit, Service, OnChanges, OnDestroy, AfterContentChecked {

  user: any;
  passMatched = false;
  phoneNumberValidation = false;
  departmentValidation = false;
  type: string = '';
  institutionTypeList: InstitutionType[] = INSTITUTION_TYPE;

  userAdminMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_MAKER];
  userAdminChekerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_CHECKER];
  userAdminViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_VIEWER];

  appPermission = AppPermission;

  btnUpade = false;
  requestFrom: string;
  allowLoginFlag = false;
  hasMasterUser = true;
  showPassword = true;
  ldapLogin: boolean = false;
  branchList = [];
  public selectedDepartmentList = [];
  departmentList = []
  departmentIdList = []
  roleIdList = [];
  ispresentRoleList = [];
  institutionList = [];
  roleList = [];
  selectedInstitutionName: any;
  selectedRoleName: any;
  public userId: number;
  public userType: string = '';
  institutionName: string;


  dropdownSettingsDepartment: IDropdownSettings = {
    singleSelection: true,
    idField: 'configId',
    textField: 'value1',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 20,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  }
  ldapUser: any;
  searchLdapUser: boolean = false;
  selectIntsMasteruser: number = 0;
  numberOfMasterUser: number = 0;
  addUser: boolean = false;
  extraInfo: any;
  selectedInstitution: any;
  selectedRole: any;
  selectedBranchName: any;
  email: string;
  blockToCamel = blockToCamel;
  profileImage: any = localStorage.getItem('profileImage') ?? 'assets/images/pro/1.png';
  userConfigList: any;
  ldapDomain: any;
  spinnerManage = false;
  // selectedRoleList: any;
  selectedRoleList: any[] = [];
  allRoleList: any;
  institutionId: any = null;
  dropdownSettingsBranch: any;
  selectedBranch: any;

  onDepartment(e) {
    console.log(e)
  }


  onDeselect(e) {
    this.profileForm.get('departmentId').setValue(null);
    debugger
    this.selectedDepartmentList = this.selectedDepartmentList.filter(f => f.configId != e.configId);
  }


  deselectAllDep() {
    this.selectedDepartmentList.length = 0;
  }


  profileForm = this.fb.group({
    userId: [null],
    email: [null, [Validators.required, this.regexFormValidationService.emailValidator()]],
    empId: [null,[Validators.required]],
    firstName: [null, [Validators.required, this.regexFormValidationService.nameValidator()]],
    lastName: [null, [this.regexFormValidationService.nameValidator()]],
    fullName: [null],
    phoneNumber: [null, [Validators.required, this.regexFormValidationService.allPhoneNumberValidator()]],
    // firstName: [null, [Validators.pattern('[A-Za-z0-9]{3,30}')]],
    // password: [null, Validators.required],
    // confirmpassword: [null, Validators.required],
    nid: [null],
    dob: [null],
    ldapLogin: [null],
    logingMethod: [environment.LOGIN_METHOD_DB],
    branchId: [null, Validators.required],
    // department: [null],
    designation: [null, [this.regexFormValidationService.nameValidator()]],
    remarks: [null],
    userStatus: [null],
    userType: [null, [Validators.required]],
    institutionId: [null, Validators.required],
    isMasterUser: [null],
    loginName: [null],
    extBranchName: [null, Validators.required],
    departmentId: [null],
    rejectCause: ['']
  });
  loaderConfig: any = {
    loader: 'twirl',
    position: 'right',
    color: 'white',
    background: '#fff',
    padding: '10px',
    height: .6,
    opacity: 1,
    speed: 1000,
    padButton: false,
  }

  constructor(public fb: FormBuilder, public router: Router,
    private cs: CommonService, private userService: UserService,
    private location: Location, public branchServicek: BranchService,
    private sconfigService: SconfigService,
    private modalService: NgbModal,
    public permissioinStoreService: PermissioinStoreService,
    private cdref: ChangeDetectorRef,
    private regexFormValidationService: RegexFormValidationService,
    private dateConvert: DateConvertService,
    private route: ActivatedRoute,
    private pr: ProfileImageService,

  ) {
    super();
    // // debugger
    this.requestFrom = route.snapshot.url[0]['path'];
    console.log('requestFrom is: ', this.requestFrom);
  }
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
  ngOnChanges() {
    this.cdref.detectChanges();

  }
  ngOnDestroy() {
    this.userService.changeCurrentUser({});
  }
  showSameUserBtn = false
  isView: boolean = false;
  isSupperAdmin: boolean = false;
  loginUser: any;
  isViewUser: boolean = false;

  notShowStatus: boolean = true;

  accept: string[] = ['.png', '.jpeg', '.jpg', '.PNG', '.JPEG', '.JPG'];
  fileSize: number = 500;
  ngOnInit() {
    // this.initializeDropdownSettingsInstitution();
    this.initializeDropdownSettings();
    // this.loadRole();
    this.loadCharecterMaxLengthConfig();
    this.loadDepartment();
    var payload = this.userService.getCurrentUser();
    this.isViewUser = this.userService.isView;
    // // debugger
    if (this.requestFrom === 'profile2' && !payload?.userId) {
      this.location.back();
      return;
    }
    this.loginUser = this.cs.loadLoginUser();
    this.addUser = this.userService.addUser;
    // this.addUser = this.userService.addUser;
    if (this.addUser) {
      this.isView = false;
      this.userType = this.loginUser?.userType;
    } else {
      this.isView = true;

    }
    // // debugger
    // this.loadbranch();
    // this.branchList = this.branchService.branchList;
    if (payload.allowLogin == 0) {
      this.allowLoginFlag = true;
    }
    this.userId = payload.userId;
    this.isSupperAdmin = this.cs.loadLoginUser().roleList.filter(f => f.roleName === 'SUPER_ADMIN').length > 0;

    var user = this.cs.isSameUser(payload.userId);

    if (!user) {
      this.showSameUserBtn = true
    }

    if (!this.addUser) {

      // this.profileForm.patchValue(payload);
    }

    this.loadValue(payload);

    if (this.addUser && !this.isSupperAdmin) {
      this.loadExtraInfo();

    }
  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'USER_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }

  loadbranch() {
    var payload1 = {};
    if (this.branchList.length) {
      return;
    }
    // this.cs.sendRequestPublic(this, ActionType.SELECT_ALL, ContentType.Branch, "BRUNCH_LIST_DROP_DOWN", payload1);
    return this.cs.execute(ActionType.SELECT_ALL, ContentType.Branch, payload1);

  }

  ldapLoginNameCheck() {
    if (this.searchLdapUser) {
      return;
    }
    this.searchLdapUser = true;
    this.ldapUser = null;
    const lName = this.profileForm.get('loginName').value;
    if (!lName) {
      Swal.fire('Login Name Is Requird.');
      return;
    }
    // // debugger
    var payload = {
      loginName: this.profileForm.value.loginName
    }

    this.cs.sendRequest(this, ActionType.LDAP_LOGIN_NAME_CHECK, ContentType.User, 'ldapLoginNameCheck', payload);

  }

  loadValue(payload) {

    let source = [];
    source.push(this.loadInstitution());
    source.push(this.loadRole());
    source.push(this.loadbranch());


    if (payload?.userId) {
      source.push(this.loadUserInfo(payload));
    }
    // // debugger
    if (payload.userStatus === 'MODIFIED' || payload.userStatus === 'PEND_APPROVE') {
      this.notShowStatus = false;
    }

    forkJoin(source)
      .pipe(
        map(([institution, role, branch, userInfo, extraInfo]) => (
          {
            institution, 
            role,
            branch,
            userInfo
          }
        )),
      )
      .subscribe((res: any) => {
        // // debugger
        this.institutionList = res['institution']?.payload;
        if (res['role']) {
          this.allRoleList = res['role']?.payload;
        }
        if (res['branch']) {
          this.branchList = res['branch'].payload;
        }
        // this.roleList = res['role']?.payload;
        console.log("Role List:", this.roleList);
        if (res['userInfo']) {
          this.buildUser(res['userInfo']);
        }
      });


    // this.profileForm.patchValue(this.user ?? {});


  }
  loadExtraInfo() {
    const payload = {
      institutionId: this.user?.institutionId,
    }
    this.cs.sendRequest(this, ActionType.LOAD_EXTRA, ContentType.User, 'LOAD_EXTRA', payload);
  }

  loadUserInfo(payload) {
    return this.cs.execute(ActionType.SELECT_SINGLE, ContentType.User, payload);
  }

  loadInstitution() {
    const payload = {
      institutionName: 'Prime Bank',
      status: 'APPROVED',
    }
    return this.cs.execute(ActionType.SELECT_ALL_WITHOUT_PRIME, ContentType.Institution, payload);
  }
  dropdownSettingsRole = {
    // singleSelection: false,
    // idField: 'roleId',
    // textField: 'displayName',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    // itemsShowLimit: 20,
    // allowSearchFilter: true,
  };


  dropdownSettingsInstitution: IDropdownSettings = {
    singleSelection: true,
    idField: 'institutionId',
    textField: 'institutionName',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search Institution',
    noDataAvailablePlaceholderText: 'No institution found'
  };

  loadRole() {
    const payload = {
      status: 'APPROVED',
    }
    return this.cs.execute(ActionType.SELECT_ALL_ROLE, ContentType.User, payload);
  }


  // manageRoleBtnClick() {
  //   if (this.spinnerManage) {
  //     return;
  //   }
  //   this.user.roleList = this.selectedRoleList;
  //   this.user.status = 'APPROVED';
  //   const payload = {
  //     roleList: this.user.roleList,
  //     status: this.user.status,
  //   };
  //   console.log("Payload being sent:", JSON.stringify(payload));
  //   this.cs.sendRequest(this, ActionType.MANAGE_ROLE, ContentType.User, 'MANAGE_ROLE', payload);
  //   this.spinnerManage = true;
  // }


  onRoleSelect(event) {
    // console.log('Selected Role:', event);
    // for (const role of this.selectedRoleList) {
    //   console.log('Before pushing to the array value is :', role.roleName);
    // }

    this.selectedRoleList.push(event);

    for (const role of this.selectedRoleList) {
      console.log('After pushing to the array value is :', role.displayName);
    }
  }

  getbranchId(event: any) {
    this.selectedBranchName = event.branchName;
    // // debugger
    if (this.userType && this.userType === 'INTERNAL_USER') {
      // const selectBranch = this.branchList.find(f => f.branchName.trim() === this.selectedBranchName.trim());
      this.profileForm.get('branchId').setValue(event?.branchId ?? null);
      // this.profileForm.get('branchId').setValue(selectBranch?.branchId ?? null);
      this.profileForm.get('extBranchName').setValue(null);
    } else {
      this.profileForm.get('extBranchName').setValue(this.selectedBranchName);
      this.profileForm.get('branchId').setValue(null);
    }
  }

  onBranchDeselect() {
    this.selectedBranchName = null;
    this.profileForm.get('branchId').setValue(null);
  }

  // onRoleDeselect(event) {
  //   debugger
  //   const index = this.selectedRoleList.findIndex(role => role.roleId === event.roleId);
  //   if (index > -1) {
  //     this.selectedRoleList.splice(index, 1);
  //   }
  //   console.log('Deselected Role:', event);
  // }

  onSelectAll(items) {
    this.selectedRoleList = [...items];
  }

  // Handle deselect all
  onDeselectAll(items) {
    this.selectedRoleList = [];

  }

  uploadProfileImg(event: any) {
    let fileElement = event.target as HTMLInputElement;
    let pFile = fileElement.files[0];
    if (!pFile) {
      return;
    }
    const f = pFile.name.split('.');
    if (!this.accept.includes(`.${f[f.length - 1]}`)) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: `.${f[f.length - 1]} Image not allow.` });
      return;
    }
    if (pFile.size > this.fileSize * 1000) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: `Image size not more than ${this.fileSize}KB` });
      fileElement.value = '';
      return;
    }
    // // debugger
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: `Are you want to save ${pFile.name} image?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Upload',
      confirmButtonColor: 'btn btn-primary'
    }).then(r => {
      if (r.isConfirmed) {
        let formDate: FormData = new FormData();
        formDate.append('profileImage', pFile);

        this.cs.filePostBySecure('/upload/profile/image', formDate, undefined, 'text').subscribe({
          next: (res: any) => {
            if (res?.type === HttpEventType.Response) {
              Swal.fire(`Upload Successful.`);
              this.profileImage = res.body;
              localStorage.setItem('profileImage', res.body);
              this.pr.callMethodInComponent();
            }
          },
          error: (err: any) => {
            Swal.fire(`${err?.message ?? 'Faild to upload image'}`);
          }
        });
      } else {
        fileElement.value = '';
        return;
      }
    })
  }

  test: any;
  addInstitution() {
    this.openModal();
  }

  // saveInstitution() {
  //   // // debugger
  //   const payload = {
  //     name: this.institutionName,
  //     type: this.type,
  //   }

  //   this.cs.sendRequest(this, ActionType.SAVE, ContentType.Institution, 'SAVE', payload);
  // }

  checkUserType(userType: string) {
    this.ldapLogin = false;
    this.userType = userType;
    // this.profileForm.get('institutionId').setValue(null);
    this.profileForm.reset();
    this.profileForm.get('userType').setValue(userType);
    this.selectedInstitutionName = null;
    debugger
    this.roleList = this.allRoleList.filter(f => userType.includes(f.roleType));
  }

  markAsMasterUser(event) {
    // // debugger
    console.log(event);
    let checked = event.target.checked;

    this.profileForm.get('isMasterUser').setValue(checked ? 1 : 0);

  }

  onProfileUpdateBtnClick() {
    debugger
    if (this.showProgress) {
      return;
    }
    var payload = this.profileForm.value;
    if (payload?.userStatus == 'CLOSED' || payload?.userStatus == 'PEND_CLOSE') {
      Swal.fire('Close does not perform here. Please try to User List section.');
      return
    }
    payload.fullName = payload.firstName + " " + payload.lastName;
    let counter = 0;
    for (const role of this.selectedRoleList) {
      console.log(`${role} is selected`);
    }
    payload.roleList = this.selectedRoleList;
    payload.status = 'APPROVED';
    payload.branchId = payload.branchId == '0' ? null : payload.branchId

    /*  if (!payload.branchId && !this.selectedDepartmentList.length) {
       Swal.fire("Branch O Depertment both can't select");
       return;
     } */
    if (this.userType && this.userType != 'EXTERNAL_USER' && !payload.branchId && !this.selectedDepartmentList.length) {
      Swal.fire("Branch or Depertment must be selected");
      return
    }
    if (payload.ldapLogin) {
      payload.logingMethod = environment.LOGIN_METHOD_LDAP;
    }

    if (this.profileForm.controls.email?.invalid) {
      Swal.fire("Email Is Invalid or Empty!");
      return;
    }

    if (this.profileForm.controls.phoneNumber?.invalid) {
      Swal.fire("Phone Number Is Invalid or Empty!");
      return;
    }

    if (this.profileForm.controls.fullName?.invalid) {
      Swal.fire("Full Name Is Required!");
      return;
    }

    if (this.profileForm.controls.firstName?.invalid) {
      Swal.fire("First Name Is Required!");
      return;
    }
    if (this.profileForm.controls.lastName?.invalid) {
      Swal.fire("Last Name Is Required!");
      return;
    }

    // if(!payload.branchId){
    //   Swal.fire("Branch not selected");
    //   return;
    // }

    //to do 
    // if (this.selectedDepartmentList) {

    //  /*  var depIdList = []
    //   this.selectedDepartmentList.forEach(i => {
    //     depIdList.push(i.configId);
    //   }) 
    //     payload.departmentIdList = depIdList;
    //   */
    //   payload.departmentId = this.selectedDepartmentList[0].configId

    // }
    // Adding department ID(s) to the payload if available
    if (this.selectedDepartmentList && this.selectedDepartmentList.length > 0) {
      payload.departmentId = this.selectedDepartmentList[0].configId;
      /* 
      // Uncomment the following if you need multiple department IDs
      var depIdList = this.selectedDepartmentList.map(i => i.configId);
      payload.departmentIdList = depIdList;
      */
    }
    // // debugger
    this.clicked = true
    this.showProgress = true
    this.cs.sendRequest(this, ActionType.UPDATE, ContentType.User, 'onProfileUpdateBtnClick', payload);

  }

  loadDepartment() {
    this.sconfigService.selectByGroupAndSubGroupStatus("ORG_UNIT", "DEPARTMENT", "APPROVED").subscribe((res: any) => {
      console.log('depertment list ', res.payload);
      this.departmentList = res.payload
      // // debugger
      if (this.departmentIdList?.length) {
        this.selectedDepartmentList = this.departmentList.filter(d => this.departmentIdList.some(sd => d.configId == sd));
      }
    })
  }

  selectedGender: string;

  radioButtonClicked(g: string) {
    // Handle the radio button click event here
    console.log(`Selected gender: ${g}`);
  }

  showApproveBtn() {
    return this.readOnly && this.btnUpade && this.allowLoginFlag && this.showSameUserBtn && this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_APPROVER);

  }



  onConfirmPassChanged(e) {
    if (!this.profileForm.get("password").value) {
      this.passMatched = false;
      return;
    }
    if (this.profileForm.get("password").value != this.profileForm.get("confirmpassword").value) {
      this.passMatched = false;
    }
    else {
      this.passMatched = true;
    }
  }
  clicked = false;
  showProgress = false;
  isSearch = false;
  selectInsDrop: any

  getInstitutionId(event) {
    this.isSearch = true;
    debugger
    this.selectedInstitutionName = event['institutionName'];
    // this.selectedInstitution = this.institutionList.find(f => f.institutionName === this.selectedInstitutionName);
    this.selectedInstitution = this.institutionList.find(f => f.institutionId == event['institutionId']);

    const selectedInstitutionId = this.selectedInstitution?.institutionId;
    this.selectIntsMasteruser = this.selectedInstitution?.numberUser;
    console.log('selectedInstitutionId', selectedInstitutionId);
    if (selectedInstitutionId) {
      this.profileForm.get('institutionId').setValue(selectedInstitutionId ?? null);
      this.checkMasterUser(selectedInstitutionId);
    } else {
      this.selectedInstitutionName = null;
      this.selectIntsMasteruser = 0;
      this.hasMasterUser = true;
    }
    // payload.institutionId = selectedInstitutionId;
  }
  getRoleId() {
    this.isSearch = true;
    // // debugger;

    // Find the selected role by comparing names
    this.selectedRole = this.roleList.find(r => r.roleName === this.selectedRoleName);

    // Extract the roleId and other information if the role is found
    const selectedRoleId = this.selectedRole?.roleId;
    // const selectedRolePermissions = this.selectedRole?.permissions;

    // console.log('selectedRoleId', selectedRoleId);
    // console.log('selectedRolePermissions', selectedRolePermissions);

    // // Set the form control value for roleId if a matching role was found
    // if (selectedRoleId) {
    //   this.profileForm.get('roleId').setValue(selectedRoleId ?? null);
    //   this.loadRolePermissions(selectedRolePermissions);  // Example function to handle permissions
    // } else {
    //   // Reset if no matching role is found
    //   this.selectedRoleName = null;
    //   this.profileForm.get('roleId').setValue(null);
    // }
  }

  initializeDropdownSettings() {
    this.dropdownSettingsRole = {
      singleSelection: false,
      idField: 'roleId',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true,
    };

    this.dropdownSettingsBranch = {
      singleSelection: true,
      idField: 'branchId',
      textField: 'branchName',
      itemsShowLimit: 20,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
  }

  onInstitutionSelect(item: any) {
    this.institutionId = item.institutionId;
  }

  buildEmail(event: any) {
    const eml = `${event.target.value}@${this.selectedInstitution?.domain}`;
    console.log('email is:', eml);
    this.profileForm.get('email').setValue(eml);


  }

  checkMasterUser(selectedInstitutionId: any) {
    const payload = {
      institutionId: selectedInstitutionId,
    }

    this.cs.sendRequest(this, ActionType.CHECK_MASTER_USER, ContentType.User, 'CHECK_MASTER_USER', payload);
  }

  onProfileSaveBtnClick() {
    this.clicked = true
    // // debugger
    var payload = this.profileForm.value;

    // const selectedInstitutionId = this.institutionList.find(f=>f.name ===this.selectedInstitutionName)?.institutionId;
    // console.log('selectedInstitutionId', selectedInstitutionId);

    // payload.institutionId = selectedInstitutionId;


    payload.branchId = payload.branchId == '0' ? null : payload.branchId
   
    // if (!this.profileForm.value.empId) {
    //   Swal.fire("Employee ID Is Required!");
    //   return;
    // }
    if (this.userType === 'INTERNAL_USER' && !this.profileForm.value.empId) {
      Swal.fire("Employee ID Is Required!");
      return;
    }
    


    if (!payload.branchId && !this.selectedDepartmentList.length && this.userType != 'EXTERNAL_USER') {
      Swal.fire("Branch or Department must be selected");
      return;
    }

    if (payload.ldapLogin || this.ldapLogin) {
      payload.logingMethod = environment.LOGIN_METHOD_LDAP;
    } else {
      payload.logingMethod = 'DB';
    }
    // if (!this.ldapLogin) {
    //   if (!payload.password || (payload.password != payload.confirmpassword)) {
    //     Swal.fire("'*' Fileds can not be empty!");
    //     return;
    //   }
    // }
    // // debugger
    console.log(this.profileForm.controls.phoneNumber?.invalid)
    // if (payload.phoneNumber != null) {
    //   payload.phoneNumber = payload.phoneNumber;
    //   if (payload.phoneNumber.length < 11) {
    //     this.phoneNumberValidation = true;
    //     return;
    //   }
    // }

    if (this.profileForm.controls.phoneNumber?.invalid) {
      Swal.fire("Phone Number Is Invalid or Empty!");
      return;
    }

    if (this.profileForm.controls.firstName?.invalid) {
      Swal.fire("First Name Is Invalid or Empty!");
      return;
    }

    // if (this.profileForm.controls.lastName?.invalid) {
    //   Swal.fire("Last Name Is Invalid or Empty!");
    //   return;
    // }

    if (this.profileForm.controls.email?.invalid) {
      Swal.fire("Email Is Invalid or Empty!");
      return;
    }

    if (this.userType === 'EXTERNAL_USER') {
      if (this.profileForm.controls.extBranchName?.invalid) {
        Swal.fire("Branch Name Is Required!");
        return;
      }

    } else if (this.userType === 'INTERNAL_USER') {
      if (this.profileForm.controls.branchId?.invalid) {
        Swal.fire("Branch Name Is Required!");
        return;
      }
    }


    if (this.profileForm.controls.fullName?.invalid) {
      Swal.fire("Full Name Is Required!");
      return;
    }
    if (this.profileForm.controls.userType?.invalid) {
      Swal.fire("User Type Is Required!");
      return;
    }
    if (this.profileForm.controls.loginName?.invalid) {
      Swal.fire("User Id Is Required!");
      return;
    }

    if (!payload.branchId && this.selectedDepartmentList.length <= 0 && this.userType != 'EXTERNAL_USER') {
      this.departmentValidation = true;
      return;
    }

    if (!this.hasMasterUser && this.selectIntsMasteruser >= this.numberOfMasterUser &&
      (!this.profileForm.get('isMasterUser').value || this.profileForm.get('isMasterUser').value === 0)) {
      Swal.fire('Please select Master User Checkbox.');
      return true;
    }
    // // debugger
    // if (this.selectedDepartmentList) {
    //   payload.departmentId = this.selectedDepartmentList[0].configId
    // }
    if (this.selectedDepartmentList && this.selectedDepartmentList.length > 0) {
      payload.departmentId = this.selectedDepartmentList[0].configId;
    }
    if (this.userType != 'EXTERNAL_USER') {

      payload.institutionId = this.cs.loadLoginUser()?.institutionId;
    }
    else {

      if (!this.profileForm.value.institutionId) {
        Swal.fire("Institution is Required!");
        return;
      }
      payload.loginName = payload.email;
    }
    debugger
    // payload.fullName = payload.firstName + " " + payload.lastName;
    if (payload.lastName) {
      payload.fullName = payload.firstName + " " + payload.lastName;
    } else {
      payload.fullName = payload.firstName;
    }
    payload.roleList = this.selectedRoleList;
    payload.status = 'APPROVED';

    Swal.fire({
      icon: 'info',
      title: 'Attention',
      text: `Want to Submit?`,
      // text: 'Are you want to Create User?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No',
    }).then((r) => {
      if (r.isConfirmed) {
        this.showProgress = true;
        this.cs.sendRequest(this, ActionType.NEW, ContentType.User, 'onProfileSaveBtnClick', payload);
      }
    });
  }

  onProfileBackBtnClick() {
    debugger
    this.userService.isView = false;
    this.location.back();
  }

  onPermanentDistChange($event) {
    console.log($event);
  }

  buildUser(response: any) {
    this.ldapDomain = '';
    // // debugger
    this.user = response.payload[0];
    this.userType = this.user.userType;
    this.user.dob = this.dateConvert.convertDb2Date(this.user?.dob);
    const ems = this.user['email']?.split('@');
    this.email = ems[0];
    this.ldapDomain = ems[1];

    debugger
    this.roleList = this.allRoleList.filter(f => this.userType.includes(f?.roleType));
    if (this.user.logingMethod == 'LDAP') {
      this.user.ldapLogin = true
      this.ldapLogin = true;
      this.ldapUser = this.user;
    }
    if (response.payload) {

      this.departmentIdList = response.payload[0].departmentIdList
      if (this.departmentList.length) {
        this.selectedDepartmentList = this.departmentList.filter(d => this.departmentIdList.some(sd => d.configId == sd));
      }

      this.roleIdList = response.payload[0].roleIdList;
      if (this.roleIdList.length) {
        this.selectedRoleList = this.roleList.filter(d => this.roleIdList.some(sd => d.roleId == sd));
      }
      debugger
      if (this.branchList.length) {
        this.selectedBranch = this.branchList.filter(f => f.branchId == this.user.branchId);
      }

      this.profileForm.patchValue(this.user);
    }

    if (this.isView) {
      this.readOnly = true;
    }
    if (this.userType === 'EXTERNAL_USER') {
      this.selectedBranchName = this.user?.extBranchName;
    }
    if (this.userType === 'INTERNAL_USER') {
      const branch = this.branchList.find(b => b.branchId === this.user.branchId);
      this.selectedBranchName = branch ? branch.branchName : null;
    }

    this.btnUpade = true;
    this.showPassword = false;

    this.selectedInstitution = this.institutionList.find(f => f.institutionId == this.user?.institutionId);
    this.selectedRole = this.roleList.find(f => f.roleId == this.user?.roleId);
    this.selectedInstitutionName = this.selectedInstitution?.institutionName;
    this.selectInsDrop = [this.selectedInstitution];

    this.cdref.detectChanges();

  }

  //onLdapLoginChecked(e: MatCheckboxChange){
  onLdapLoginChecked(e) {

    var obj = this.profileForm.value;
    // // debugger
    // if(e.checked){
    if (obj.ldapLogin) {
      this.ldapLogin = true;
      this.showPassword = false;
    }
    else {
      this.ldapLogin = false;
      if (!this.btnUpade) {
        this.showPassword = true;
        var p = {
          password: environment.LDAP_PASSWORD,
          confirmpassword: environment.LDAP_PASSWORD,
        }
        this.profileForm.patchValue(p);
      }
      else {
        this.showPassword = false;
      }
    }
  }
  readOnly = false;

  /* onApprovedBtnClick(){
    // // debugger

    var payload={
      userId:this.userId
    }

    this.cs.sendRequest(this,ActionType.APPROVE_USER,ContentType.User,"APPROVE_USER",payload);
  

  } */

  isPresentRole(activeOrInactive) {

    /*  var payload={
       fromId:this.userId
       
     }  */
    var payload = {
      userId: this.userId,
      allowLogin: activeOrInactive == 'No' ? 1 : 0,
      commonActivity: activeOrInactive == 'No' ? "ACTIVE" : "INACTIVE"
    }
    //this.cs.sendRequest(this,ActionType.IS_ASSIGN_ROLE,ContentType.GenericMap,"IS_ASSIGN_ROLE",payload);
    // payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
    this.cs.sendRequestAdmin(this, ActionType.TOGGLE_ACTIVATION, ContentType.User, 'activeToggleUser', payload);

  }


  onResponse(service: Service, req: any, response: any) {
    this.clicked = false
    this.showProgress = false
    this.searchLdapUser = false;
    this.type = '';
    // // debugger
    if (!super.isOK(response)) {
      Swal.fire(super.getErrorMsg(response));

      // this.ldapUser = {'email' : 'test@gm.com', 'loginName': this.profileForm.get('loginName').value, 'phoneNumber':'01748374837'};
      // this.profileForm.patchValue(this.ldapUser);
      return;
    }
    else if (response.header.referance == 'SELECT_SINGLE') {
      this.buildUser(response);

    }
    else if (response.header.referance == 'onProfileUpdateBtnClick') {
      this.router.navigate(['/admin']);
    }
    // else if (response.header.referance == 'SAVE') {
    //   this.institutionList = response.payload;
    //   Swal.fire('Institution Save Success.').then(t => {
    //     // this.closeModale();
    //   });
    // }
    // else if (response.header.referance == 'SELECT_ALL') {
    //   this.institutionList = response.payload;
    // }
    else if (response.header.referance == 'onProfileSaveBtnClick') {
      // // debugger
      this.router.navigate(['/admin']);
    }
    else if (response.header.referance == 'LOAD_EXTRA') {
      this.extraInfo = response.payload;
    }
    else if (response.header.referance == 'BRUNCH_LIST_DROP_DOWN') {

      this.branchList = response.payload;
      console.log('branch list', this.branchList);
    } else if (response.header.referance == 'SELECT_2') {
      this.departmentList = response.payload
    } else if (response.header.referance == 'USER_APPROVER') {
      this.router.navigate(['/admin']);
    }
    else if (response.header.referance == 'CHECK_MASTER_USER') {
      const res = response.payload;
      if (res.length > 0) {
        this.numberOfMasterUser = res.length;
        this.hasMasterUser = this.numberOfMasterUser > 0;
      }
      else {
        this.hasMasterUser = false;
      }
    }
    else if (response.header.referance == 'activeToggleUser') {
      var user = response.payload;
      // // debugger
      if (user.commonActivity == "ROLE_NOT_FOUND") {
        Swal.fire({ title: "No Role Found.", toast: true, timer: 5000 });
        return;
      } else {
        this.router.navigate(['/admin']);
      }


    }
    else if (response.header.referance == 'ldapLoginNameCheck') {
      // // debugger
      const lu = response.payload;
      if (lu == undefined || lu == null || lu == 'undefined') {
        this.profileForm.reset();
        Swal.fire({
          title: 'User Not Found!',
          text: 'Valid User Not Found...',
          icon: 'error',
          timer: 5000,
        });
        this.ldapLogin = false;
      } else {
        this.ldapUser = lu;
        this.ldapLogin = true;
        this.profileForm.patchValue(this.ldapUser);

        const em = this.ldapUser?.email?.split('@');
        this.email = em[0];
        this.ldapDomain = em[1];
        // this.selectedInstitution.domain = em[1];

      }

    }
    else if (response.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', response);
      console.log('Reference:', response.header.referance);
      // // debugger;
      this.userConfigList = response.payload;

      const maxLengthMapping = {
        firstName: 'firstNameMaxLength',
        lastName: 'lastNameMaxLength',
        phoneNumber: 'phoneNumberMaxLength',
        branch: 'branchMaxLength',
        designation: 'designationUMaxLength',
        nid: 'nidMaxLength',
        remarks: 'remarksMaxLength',
        empId: 'empIdMaxLength',

      };

      this.userConfigList.forEach(config => {
        const prop = maxLengthMapping[config.value5];
        if (prop) {
          this[prop] = config.value1;
          console.log(`Set ${prop} to:`, config.value1);
        }
      });

      [
        'firstName', 'lastName', 'phoneNumber', 'branch',
        'designationU', 'nidU'
      ].forEach(field => this.profileForm.get(field)?.updateValueAndValidity());
    }


  }

  onError(service: Service, req: any, response: any) {
    console.log('error');
    // this.closeModale();
  }

  hasRole(role) {
    return this.cs.hasAnyRole(role);
  }


  @Input() component = InstitutionAddComponent;
  institutionModel: NgbModalRef;

  openModal() {
    // // debugger
    this.institutionModel = this.modalService.open(this.component,
      { backdrop: 'static', size: 'lg', backdropClass: 'light-blue-backdrop' }
    );
    this.institutionModel.componentInstance.insInfo = 'i am ref';
    this.institutionModel.componentInstance.btnRef = 'Save';

    this.institutionModel.result.then(res => {
      console.log(res);

      if (res && typeof res !== 'string') {
        this.institutionList = res.payload;
        Swal.fire('Institution Save Success.');
      }
      console.log('all signature is, ', this.institutionList);
    });

  }

}
