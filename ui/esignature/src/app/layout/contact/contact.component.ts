import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends Softcafe implements OnInit, Service {

  
  address: string = 'Adamjee Court Annex Building-2, 119-120, Motijheel C/A, Dhaka-1000, Bangladesh';
  phone: string = '+880 (2)223387265, +880 (2)223390747-8 PABX, +88 09610990000';
  fax: string = '880-2-55068685';
  email: string = 'info@primebank.com.bd';
  website: string = 'www.primebank.com.bd';
  swift: string = 'PRBLDDH';

  contact1:string='16218 or 02223383837';
  contact2:string='+88 09604016218 or +88 09612316218';
  email247: string = 'contactcenter@primebank.com.bd';


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
    });
    this.loadContactDetails();
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
    }
  }



  loadContactDetails(){
    const payload = {};

    this.cs.sendRequest(this, ActionType.SELECT_ALL_INFO, ContentType.ActivityLog, 'select_all', payload);
  }


  onResponse(service: Service, req: any, res: any) {
   
    if(!super.isOK(res)){
      Swal.fire(super.getErrorMsg(res));
    }else if(res.header.referance === 'select_all'){
      console.log('getting response');
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


 

}



