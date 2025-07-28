import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { SconfigService } from 'src/app/service/sconfig.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { Toast } from 'src/app/softcafe/common/Toast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends Softcafe implements OnInit, Service {
  departmentList = []
  departmentIdList = []
  selectedDepartmentList = []
  departmentForm: FormGroup;
  buttonSaveOrUpdate
  spinnerSaveBtn = false
  showError
  displayStyle = "none"

  ORG_UNIT = "ORG_UNIT"
  DIVISION = "DIVISION"
  DEPARTMENT = "DEPARTMENT"

  constructor(
    private fb: FormBuilder,
    private sconfigService: SconfigService,
    public permissioinStoreService : PermissioinStoreService
  ) {
    super()
    this.initDepartmentForm();
  }

  initDepartmentForm() {
    this.departmentForm = this.fb.group({
      name: [null, Validators.required],
      shortName: [null],
      configId: [null]
    })
  }

  ngOnInit(): void {
    this.loadDepartment();
  }

  loadDepartment() {
    this.sconfigService.selectByGroupAndSubGroup("ORG_UNIT", "DEPARTMENT").subscribe((res: any) => {
      debugger
      console.log(res)
      this.departmentList = res.payload

    })

  }

  onAddDepartment() {
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Save"
  }

  onClickGroupItem($event, department) { }

  openEdit(e, arg) {
    debugger
    e.stopPropagation();
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Update"
    var payload = {
      configId: arg.configId,
      name: arg.value1,
      shortName: arg.value2,
    }
    this.departmentForm.patchValue(payload)

  }

  onSave() {
    debugger

    var payload = {
      configGroup: this.ORG_UNIT,
      configSubGroup: this.DEPARTMENT,
      configName: this.DIVISION,
      value1: this.departmentForm.value.name,
      value2: this.departmentForm.value.shortName,
      configId: this.departmentForm.value.configId ? this.departmentForm.value.configId : null,

    }

    this.sconfigService.save(payload).subscribe((res: any) => {

      if(!this.isOK(res)){
        Swal.fire(this.getErrorMsg(res));
        return;
      }
      console.log(res);
      this.displayStyle = "none"
      this.loadDepartment();

    });

  }

  onApprove(e, arg){
    debugger
    e.stopPropagation();
    this.sconfigService.approve(arg).subscribe((res: any) => {
      Toast.show("Successfully Approved")
      console.log(res);
      this.loadDepartment();

    });
  }


  closePopup() {
    this.displayStyle = "none"
    this.departmentForm.reset();
  }



  onResponse(service: Service, req: any, response: any) {
    // this.spinnerSaveBtn = false
    debugger


  }

  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
