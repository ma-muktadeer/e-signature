import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { routerTransition } from '../router.animations';
import { EncrDecrService } from '../service/encr-decr.service';
import { Softcafe } from '../softcafe/common/Softcafe';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent extends Softcafe implements OnInit, Service {

    regiForm: FormGroup;
    userType: String = 'INTERNAL_USER';
    configGroup: string = 'QUESTION';
    configSubGroup: string = 'QUESTION_ANS';


    domain = environment.domain;
    clicked = false;
    showProgress = false;
    isPassMatch: boolean = null;

    logoName = environment.logoName;

    private _onDestroy = new Subject<void>();
    public filteredRecordType: [] = [];
    public branchControl: FormControl = new FormControl();
    public branchFilterCtrl: FormControl = new FormControl();
    public branchList = [];
    public filterBranchList = [];
    public selectedSecurityQueList = [];
    securityQueList: any;
    questionAnsList: any;

    constructor(public fb: FormBuilder, public router: Router,
        public cs: CommonService, private encrDecr: EncrDecrService) {
        super();
        this.generateCapture();

    }

    ngOnInit() {
        // if (this.branchService.branchList.length == 0) {
        //     this.branchService.loadBranchAsync().subscribe((res: any) => {
        //         this.branchService.branchList = res.payload
        //         this.branchList = this.branchService.branchList
        //         this.filterBranchList = this.branchList;
        //     });
        // }
        // else{
        //     this.branchList = this.branchService.branchList
        //     this.filterBranchList = this.branchList;
        // }


        this.regiForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,}$')]],
            lastName: [''],
            middleName: [''],
            // lastName: ['', Validators.pattern('^[a-zA-Z]{1,}$')],
            // middleName: ['', Validators.pattern('^[a-zA-Z]{1,}$')],
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]],
            loginName: ['', [Validators.required]],
            branchId: [0, [Validators.required]],
            password: [null, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')]],
            cnofPassword: ['', Validators.required],
            logingMethod: environment.LOGIN_METHOD_LDAP,
            phoneNum: ['', [Validators.pattern('^[0-9]{11,}$')]],
            defaultAdPass: '',
            fullName: '',
            branchName: '',
            securityQuestionList: [''],
            // selectedSecurityQueList
            capture: ['', Validators.required],
        });

        this.branchFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterRecord();
            });
        this.loadSecurityQuestion();
        // this.loadAnswer();

    }

    setStatus(): boolean {
        return (!this.regiForm.get('securityQuestionList').value || this.regiForm.get('securityQuestionList').value?.length < 3);
    }

    private filterRecord() {
        if (!this.branchList) {
            return;
        }

        let search = this.branchFilterCtrl.value;
        if (!search) {
            this.filterBranchList = this.branchList;
            return;
        } else {
            this.filterBranchList = this.branchList.filter(branch => branch.brunchName.toUpperCase().indexOf(search.toUpperCase()) > -1);
        }
    }

    loadSecurityQuestion() {
        const payload = {};
        this.cs.sendRequestPublic(this, ActionType.SELECT, ContentType.SecurityQuestion, 'SELECT', payload);
    }

    loadAnswer() {
        const payload = {
            configGroup: this.configGroup,
            configSubGroup: this.configSubGroup,
        }
        this.cs.sendRequestPublic(this, ActionType.SELECT_ALL_ANS, ContentType.SConfiguration, 'SELECT_ALL_ANS', payload);
    }

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

    onItemSelect(item: any) {
        debugger
        console.log('onItemSelect', item);

    }

    onEmailBlur(e) {
        console.log(e);
    }

    onUserNameBlur(e) {
        var value = e.target.value;
        if (value) {
            var p = {
                email: value + this.domain
            }
            this.regiForm.patchValue(p);
        }
    }

    // onRegiBtnClick(regiForm: FormGroup) {

    //     debugger
    //     var payload = this.regiForm.value;
    //     debugger
    //     payload.defaultAdPass = environment.LDAP_PASSWORD;
    //     debugger
    //     if (!payload.loginName || !payload.password || !payload.branchId || !payload.email) {
    //         Swal.fire('All fields are mandatory');
    //         return;
    //     }
    //     this.clicked = true;
    //     this.showProgress = true;
    //     this.cs.sendRequestPublic(this, ActionType.REGISTER, ContentType.User, 'register', payload);
    // }

    checkSelectedQuestionList() {
        debugger
        console.log('selected question list', this.selectedSecurityQueList);
        if (this.selectedSecurityQueList?.length > 3) {
            Swal.fire('You can select only any three security question.');
            this.selectedSecurityQueList.pop();
            return;
        }
    }

    checkUser(event) {
        this.regiForm.reset();
        debugger
        console.log(event);
        this.userType = event;
        if (this.userType != 'INTERNAL_USER') {
            this.regiForm.value.branchId = null;
        }
    }

    submitted: boolean = false;

    register() {
        debugger
        var payload = this.regiForm.value;
        payload.userType = this.userType;
        // payload.defaultAdPass = environment.LDAP_PASSWORD;
        console.log('form value is: ', payload);

        this.submitted = true;

        if (!this.validatForm()) {
            alert('Please enter all requird information.')
            return;
        }


        if (this.regiForm.value.password) {
            payload.password = this.encryptPassword(this.regiForm.value.password);
        } else {
            alert('Please enter password.');
            return;
        }

        // payload.password = this.regiForm.value.password ? this.encryptPassword(this.regiForm.value.password): alert('Please enter password.');
        var decrypted = this.decryptPassword(payload.password);

        debugger

        if (payload.userType == 'INTERNAL_USER') {
            const enp = this.encryptPassword(environment.LDAP_PASSWORD);
            payload.defaultAdPass = enp;
            console.log('decrypted value: ', this.decryptPassword(enp));

            let internalUserValidation = this.checkInternalUserValidation(payload);
            if (!internalUserValidation) {
                alert('Please enter the branch.')
                return;
            }
        } else {

            if (!this.isPassMatch) {
                alert('Password not match.')
                return;
            }
        }

        if (!this.checkQuestionValidation()) {
            return alert('Please enter all question answer.')
        }

        if (this.checkCapture()) {
            // alert('Please enter the Capture answer');
            this.checkCaptureValidation();
            this.generateCapture();
            return;
        }

        this.clicked = true;
        this.showProgress = true;
        this.cs.sendRequestPublic(this, ActionType.REGISTER, ContentType.User, 'register', payload);


    }

    validatForm(): boolean {
        // frist name, loging name, email
        return this.regiForm.get('firstName').errors
            || this.regiForm.get('loginName').errors
            || this.regiForm.get('email').errors ? false : true;
    }

    //question validation 
    checkQuestionValidation(): boolean {
        if (this.selectedSecurityQueList?.length == 3) {
            return this.checkAnswer(this.selectedSecurityQueList);
        } else {
            alert('Please select at least three question.')
            return false;
        }
        // return this.selectedSecurityQueList?.length == 3 ? this.checkAnswer(this.selectedSecurityQueList) : false;
    }
    checkAnswer(questionList): boolean {
        let hasNoAnswer = questionList.filter(e => !e.securityQuestionAnswer);
        if (hasNoAnswer.length > 0) {
            alert('Please answer all the selected question.')
            return false;
        } else {
            return true;
        }
        // return hasNoAnswer.length > 0 ? false : true;
    }

    checkInternalUserValidation(payload: any): boolean {
        return (payload.branchId <= 0 || payload.branchId.length <= 0) ? false : true;
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

    checkCapture(): boolean {
        return this.regiForm.get('capture').hasError('required')
            || (this.regiForm.get('capture').value != this.captureSum
                || this.regiForm.get('capture').value?.length <= 0);
    }


    v: string;
    onKey(value: any) {
        this.v = value;
        debugger
        console.log('key pass value:, ', value);
        this.checkPassMatch(value, this.regiForm.value.password)
    }
    checkPassMatch(checkPass, pass): boolean {
        return this.isPassMatch = pass === checkPass;
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


    onResponse(service: Service, req: any, response: any) {
        this.showProgress = false;
        this.clicked = false;
        console.log('success');
        debugger
        if (!super.isOK(response)) {
            //alert(super.getErrorMsg(response));
            Swal.fire(super.getErrorMsg(response));
            return;
        }
        if (response.header.referance == 'register') {
            Swal.fire('Your user has been created. Please contact your administrator for activation.');
            this.regiForm.reset();
            this.router.navigate(['/login']);
        } else if (response.header.referance == 'SELECT') {
            this.securityQueList = response.payload.allQuestion;
            console.log('security question liat', this.securityQueList);
            this.loadAnswer();
        } else if (response.header.referance == 'SELECT_ALL_ANS') {
            this.questionAnsList = response.payload;
            console.log('security question liat', this.questionAnsList);
        }

    }
    onError(service: Service, req: any, response: any) {
        this.showProgress = false;
        console.log('error');
    }

    captureSum: number;
    n1: number;
    n2: number;
    imageName: number = 0;

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

    interval = setInterval(() => {
        if (true) {
            console.log('ok');
            this.generateCapture();
            console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
            this.loadCapture();
        }
    }, 3 * 60 * 1000);

}
