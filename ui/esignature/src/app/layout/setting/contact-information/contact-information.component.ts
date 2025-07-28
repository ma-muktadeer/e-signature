import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss']
})
export class ContactInformationComponent extends Softcafe implements Service, OnInit {
  saveRef: string;
  contAdInfoBtn: string = 'Save';
  panels = [
    {
      title: 'Contact Head Office Information',
      content: 'This is the content of the first section.'
    },
    {
      title: 'Contact 24/7 Information',
      content: 'This is the content of the second section.'
    }
  ];
  isOpen = new Array(this.panels.length).fill(true); // Keeps track of open/closed state
  contHeadInfoBtn: string = 'Save';
  cont247InfoBtn: string = 'Save';
  address: any;
  phone: any;
  fax: any;
  email: any;
  website: any;
  swift: any;

  contact1: any;
  contact2: any;
  email247: any;


  constructor(private cs: CommonService) {
    super();

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    debugger
    forkJoin([this.loadHeadAdInfo(), this.load247Info()]).subscribe(f => {
      console.log('value ', f);
      this.setHeadInfoValue(f[0]['payload']);
      this.set247InfoValue(f[1]['payload']);
    })
  }
  loadHeadAdInfo() {
    const payload = {
      configGroup: `HEAD_OFFICE_INFO_GROUP`,
      configSubGroup: `HEAD_OFFICE_INFO_SUBGROUP`,
    }

    return this.cs.execute(ActionType.SELECT_ALL_CONTACT_INFO, ContentType.SConfiguration, payload);
  }

  load247Info() {
    const payload = {
      configGroup: `24_INFO_GROUP`,
      configSubGroup: `24_INFO_SUBGROUP`,
    }

    return this.cs.execute(ActionType.SELECT_ALL_CONTACT_INFO, ContentType.SConfiguration, payload);
  }

  
  setHeadInfoValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        if (e.value5 === 'ADDRESS') {
          this.address = e.value1;
        }
        else if (e.value5 === 'PHONE') {
          this.phone = e.value1;
        }
        else if (e.value5 === 'FAX') {
          this.fax = e.value1;
        }
        else if (e.value5 === 'EMAIL') {
          this.email = e.value1;
        }
        else if (e.value5 === 'SWIFT') {
          this.swift = e.value1;
        }
        else if (e.value5 === 'WEBSITE') {
          this.website = e.value1;
        }
      });
      this.contHeadInfoBtn = 'Update';
    }
  }

  set247InfoValue(value: any) {
    if (value.length) {
      value.forEach(e => {
        if (e.value5 === 'CONTACT1') {
          this.contact1 = e.value1;
        }
        else if (e.value5 === 'CONTACT2') {
          this.contact2 = e.value1;
        }
        else if (e.value5 === 'EMAIL247') {
          this.email247 = e.value1;
        }

      });
      this.cont247InfoBtn = 'Update';
    }
  }


  togglePanel(index: number) {
    debugger
    this.isOpen[index] = true;
  }

  save(ref: string) {
    if (ref === 'HEAD_OFFICE_INFO') {
      this.saveRef = ref;
      this.buildContAdInfo();
    }
    else if (ref === '24_INFO') {
      this.saveRef = ref;
      this.buildContInfo();
    }
  }

  buildContAdInfo() {
    // const info: string[] = [this.address, this.phone, this.fax, this.email, this.swift, this.website];
    const infoMap: Map<string, string> = new Map();
    infoMap.set('ADDRESS', this.address ?? '');
    infoMap.set('PHONE', this.phone ?? '');
    infoMap.set('FAX', this.fax ?? '');
    infoMap.set('EMAIL', this.email ?? '');
    infoMap.set('SWIFT', this.swift ?? '');
    infoMap.set('WEBSITE', this.website ?? '');

    const payload = {
      requestData: this.buildInfo(infoMap),
    };

    debugger
    Swal.fire({
      icon: 'question',
      title: 'Attention',
      // text: `Are you want to ${this.saveRef === 'HEAD_OFFICE_INFO' ? this.contHeadInfoBtn : ''} information?`,
      text: `Want to Submit?`,
      showConfirmButton: true,
      confirmButtonText: `Confirm`,
      // confirmButtonText: `${this.saveRef === 'HEAD_OFFICE_INFO' ? this.contHeadInfoBtn : ''}`,
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(r => {
      if (r.isConfirmed) {
        this.cs.sendRequest(this, ActionType.SAVE_APP_CONFIG, ContentType.SConfiguration, 'SELECT_SIG', payload);
      }
    });
  }

  buildContInfo() {
    const infoMap: Map<string, string> = new Map();
    infoMap.set('CONTACT1', this.contact1 ?? '');
    infoMap.set('CONTACT2', this.contact2 ?? '');
    infoMap.set('EMAIL247', this.email247 ?? '');
   
    const payload = {
      requestData: this.buildInfo(infoMap)
    };
    const ref = `${this.saveRef === 'HEAD_OFFICE_INFO' ? this.contHeadInfoBtn : this.saveRef === '24_INFO'
      ? this.cont247InfoBtn : ''}`;
    debugger
    Swal.fire({
      icon: 'question',
      title: 'Attention',
      // text: `Are you want to ${ref} information?`,
      text: `Want to Submit?`,
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

  // buildLastInfo(lastLogin: number, lastChangePass: number): any {
  //   let payload: any[] = [];
  //   if (lastLogin) {
  //     payload.push(this.build(lastLogin, 'LAST_LOGIN'));
  //   }
  //   if (lastChangePass) {
  //     payload.push(this.build(lastChangePass, 'LAST_CHANGE_PASS'));
  //   }

  //   return payload;
  // }

  buildInfo(info: Map<string, string>): any {
    let payload: any[] = [];

    info.forEach((v, k) => {
      payload.push(this.build(v, k));
    })

    // if (name) {
    //   payload.push(this.build(name, 'NAME'));
    // }
    // if (email) {
    //   payload.push(this.build(email, 'EMAIL'));
    // }
    // if (number) {
    //   payload.push(this.build(number, 'NUMBER'));
    // }
    return payload;
  }

  build(value1: string | number, value5: string): any {
    return {
      configGroup: `${this.saveRef}_GROUP`,
      configSubGroup: `${this.saveRef}_SUBGROUP`,
      value1: value1,
      value5: value5,
    };
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
    debugger
    if(!super.isOK(res)){
      Swal.fire(super.getErrorMsg(res));
    }
    
    else if (res.header.referance === 'SELECT_SIG') {
      let value = res.payload;
      if (!(value instanceof Array)) {
        value = [value];
      }
      this.alertSuccess(this.contAdInfoBtn).then(() => {
        if (this.saveRef === 'HEAD_OFFICE_INFO') {
          // this.name = this.email = this.number = null;
          this.setHeadInfoValue(value);
        }
        else if (this.saveRef === '24_INFO') {
          // this.lastLogin = this.lastChangePass = null;
          this.set247InfoValue(value);
        }
      });



    }


  }


  onError(service: Service, req: any, res: any) {
    console.log('error ', super.getErrorMsg(res));

  }


}
