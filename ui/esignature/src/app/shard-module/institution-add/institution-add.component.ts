import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INSTITUTION_TYPE, InstitutionType } from 'src/app/layout/admin/moder/institution_type';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-institution-add',
  templateUrl: './institution-add.component.html',
  styleUrls: ['./institution-add.component.scss']
})
export class InstitutionAddComponent extends Softcafe implements OnInit, Service {

  @Input() insInfo: any;
  @Input() btnRef!: string;
  tooltip: string = 'Close';
  type: string = '';
  institutionId: any;
  institutionName: string;
  numberUser: number;
  numberGenUser: number;
  institutionTypeList: InstitutionType[] = INSTITUTION_TYPE;
  click: boolean = false;
  appPermission = AppPermission;
  exitMasterUser: number;
  domain: string;
  institutionConfigList: any;
nameMaxLength: any;
domainMaxLength: any;
numberUserMaxLength: any;
numberGenUserMaxLength: any;


  constructor(
    private modelRef: NgbActiveModal,
    private cs: CommonService,
    public permissionStoreService: PermissioinStoreService,
  ) {
    super();

  }


  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    console.log('getting value ', this.insInfo);
    if (this.insInfo && typeof this.insInfo != 'string') {
      this.type = this.insInfo.type;
      this.institutionName = this.insInfo?.institutionName;
      this.numberUser = this.insInfo?.numberUser;
      this.institutionId = this.insInfo?.institutionId;
      this.numberGenUser = this.insInfo?.numberGenUser;
      this.domain = this.insInfo?.domain;
    }
  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'INSTITUTION_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }
  closeModale(res: any) {
    this.closeModal(res);
  }

  submitWork() {
    this.click = true;
    debugger
    if (!this.institutionName || !this.type || !this.numberUser || !this.numberGenUser || !this.domain) {
      Swal.fire({
        title: 'Required',
        text: 'Please fill all the required field.',
        icon: 'error',
        timer: 5000,
      }).then(r => { return; });
      return;
    }

    const payload = {
      institutionId: this.institutionId ?? null,
      institutionName: this.institutionName,
      type: this.type,
      numberUser: this.numberUser ?? 0,
      numberGenUser: this.numberGenUser ?? 0,
      domain: this.domain,
      status: 'PEND_APPROVE',
    }
    this.sendRequest(payload, 'Save And Submit');
  }
  saveInstitution() {
    this.click = true;
    debugger
    if (!this.institutionName || !this.type || !this.numberUser || !this.numberGenUser || !this.domain) {
      Swal.fire({
        title: 'Required',
        text: 'Please fill all the required field.',
        icon: 'error',
        timer: 5000,
      }).then(r => { return; });
      return;
    }
    else {
      const payload = {
        institutionId: this.institutionId ?? null,
        institutionName: this.institutionName,
        type: this.type,
        numberUser: this.numberUser ?? 0,
        numberGenUser: this.numberGenUser ?? 0,
        domain: this.domain,
        status: this.btnRef === 'Save' ? 'NEW' : this.btnRef === 'Update' ? 'PEND_UPDATE' : 'NEW',
      }
      

      this.sendRequest(payload, this.btnRef);

    }
  }

  keyUp(event) {
    this.exitMasterUser = event.target.value as number;
  }
  changeMasterUserNum() {
    debugger
    // const payload ={
    //   numberUser: this.numberUser,
    // }
    if (this.institutionId && this.institutionId > 0) {
      const payload = {
        institutionId: this.institutionId,
      }

      this.cs.sendRequest(this, ActionType.CHECK_MASTER_USER, ContentType.User, 'CHECK_MASTER_USER', payload);
    }
  }



  sendRequest(payload: any, btnRef: string) {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: `Want to Submit?`,
      // text: `Are you want to ${btnRef} this Institution?`,
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
        this.cs.sendRequest(this, ActionType.SAVE, ContentType.Institution, 'SAVE', payload);
      } else {
        return;
      }
    });

  }

  closeModal(res: any) {
    debugger
    this.modelRef.close(res);
  }

  limitInput(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }

    if (input.name === 'numberUser') {
      this.numberUser = Number(input.value);
    } else if (input.name === 'numberGenUser') {
      this.numberGenUser = Number(input.value);
    }
  }
  
  onResponse(service: Service, req: any, res: any) {

    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }
    else if (res.header.referance == 'SAVE') {
      this.type = '';
      this.institutionId = null;
      this.institutionName = null;
      this.closeModal(res);
    }
    else if (res.header.referance == 'CHECK_MASTER_USER') {
      const response = res.payload;
      this.exitMasterUser = response.length;
    }
    else if (res.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Question Config Setup Response:', res);
      console.log('Reference:', res.header.referance);
      debugger;
      this.  institutionConfigList
      = res.payload;
    
      const maxLengthMapping = {
        institutionName: 'nameMaxLength',
        domain: 'domainMaxLength',
        numberUser: 'numberUserMaxLength',
        numberGenUser: 'numberGenUserMaxLength',
        
      };
    
      this.institutionConfigList.forEach(config => {
        const prop = maxLengthMapping[config.value5];
        if (prop) {
          this[prop] = config.value1;
          console.log(`Set ${prop} to:`, config.value1);
        }
      });
      Object.keys(maxLengthMapping).forEach(field => {
        if (!this[field]) {
          console.warn(`${field} is required.`);

        }
      });
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log('error ');

  }

}
