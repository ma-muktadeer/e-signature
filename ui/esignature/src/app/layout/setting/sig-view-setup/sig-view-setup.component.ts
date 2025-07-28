import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { SigViewSetupValue } from 'src/app/softcafe/constants/sig-view-setup-value';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-sig-view-setup',
  templateUrl: './sig-view-setup.component.html',
  styleUrls: ['./sig-view-setup.component.scss']
})
export class SigViewSetupComponent extends Softcafe implements Service, OnInit {

  spinnerManage: boolean = false;
  list: SigViewSetupValue[];
  filteredIntUnassignList: any[] = [];
  intUnassignList: any[] = [];
  filteredExtUnassignList: any[] = [];
  extUnassignList: any[] = [];
  assignExtList: any[] = [];
  assignIntList: any[] = [];

  selectedItem: string = 'INTERNAL_USER';


  constructor(private cs: CommonService) {
    super();
    this.list = SigViewSetupValue.getSetupList();
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  toggleAccordion(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }

  notificationMsg(icon: SweetAlertIcon, title: string, text: string, action?: string, showConfirmButton: boolean = false, showDenyButton: boolean = false) {
    return Swal.fire({
      icon: icon,
      title: title,
      text: `${text} ${action}?`,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: action,
      timer: (showConfirmButton || showDenyButton) ? null : 5000,
    });
  }

  onSearch(e, ref: string) {
    console.log(e);
    if (ref === 'INTERNAL_USER') {
      // this.intUnassignList = JSON.parse(JSON.stringify(this.filteredIntUnassignList));
      this.filteredIntUnassignList = this.searchItem(e, this.intUnassignList);
    } else {
      this.filteredExtUnassignList = this.searchItem(e, this.extUnassignList);
    }
    // if(!e.target.value){
    //   this.filteredUnassignRoleList = this.unassignRoleList
    // }
    // else{
    //   this.filteredUnassignRoleList = this.unassignRoleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1)
    // }

    // this.filteredUnassignRoleList = this.filteredUnassignRoleList.filter( x => this.assignRoleList.every( y=> y.roleId !=  x.roleId ))
  }
  searchItem(e: any, value: any[]): any[] {
    const list = JSON.parse(JSON.stringify(value));
    if (!e.target.value) {
      return value;
    }
    else {
      return list.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1)
    }
  }

  drop(event: CdkDragDrop<string[]>) {

    // if (!this.permissioinStoreService.hasAnyPermission([AppPermission.SAVE_USER])) {
    //   return;
    // }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  loadConfig() {
    const payload = {};

    this.cs.sendRequest(this, ActionType.SELECT_ALL_VIEW_SETUP, ContentType.SConfiguration, 'select', payload);
  }

  manageBtnClick(ref: string) {
    if (this.assignExtList?.length > 0 || this.assignIntList?.length > 0) {
      const configNameList = this.findConfigListByUser(ref);
      debugger
      const payload = {
        configNameList: configNameList,
        value5: ref,
      };

      this.spinnerManage = true;
      this.cs.sendRequest(this, ActionType.SAVE_SIG_VIEW_SETUP, ContentType.SConfiguration, 'select', payload);
    }

  }

  findConfigListByUser(forUser: string): any[] {
    let configNameList: any[] = [];
    if (forUser === 'INTERNAL_USER') {
      this.assignIntList.forEach(a => {
        configNameList.push(a.value);
      });
    } else {
      this.assignExtList.forEach(a => {
        configNameList.push(a.value);
      });
    }

    return configNameList;
  }

  buildValue(value: any[]) {
    // this.assignList = this.filteredUnassignList.filter(f=> value.some(v=> f.value === v.value1));
    // console.log('assignList ', this.assignList);
    // this.filteredUnassignList = this.filteredUnassignList.

    this.assignExtList = this.filteringValue(value, 'EXTERNAL_USER');
    this.assignIntList = this.filteringValue(value, 'INTERNAL_USER');

  }
  filteringValue(value: any[], ref: string): any[] {
    let a: any[] = [];
    let fList = JSON.parse(JSON.stringify((this.list)));
    value.forEach(v => {
      const index = fList.findIndex(l => l.value === v.value1 && v.value5 === ref);
      if (index !== -1) {
        a.push(fList[index]);
        fList.splice(index, 1);
      }
    });
    if (ref === 'INTERNAL_USER') {
      this.filteredIntUnassignList = fList;
      this.intUnassignList = fList;
    } else {
      this.filteredExtUnassignList = fList;
      this.extUnassignList = fList;
    }
    return a;
  }


  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      this.notificationMsg('error', 'Oppssss...', super.getErrorMsg(res));
      return;
    }
    debugger
    if (res.header.referance === 'select') {
      const value = res.payload;
      this.spinnerManage = false;
      if (value?.length > 0) {
        this.buildValue(value);
      } else {
        this.filteredExtUnassignList = this.list;
        this.filteredIntUnassignList = this.list;
      }

    }
  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
