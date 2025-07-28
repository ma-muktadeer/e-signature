import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-bic',
  templateUrl: './add-bic.component.html',
  styleUrls: ['./add-bic.component.scss']
})
export class AddBicComponent extends Softcafe implements OnInit, Service {

  profileForm = this.fb.group({
    swiftBicCodeKey: [null],
    bankName: [null],
    branchName: [null, Validators.required],
    bicCode: [null],
    bankCity: [null, Validators.required],
    bankCountry: [null, Validators.required],
    idLintedInRma: [null]
  });

  constructor(public fb: FormBuilder, public router: Router
    , private cs: CommonService, private userService: UserService) {
    super();
  }

  ngOnInit(): void {
  }

  onResponse(service: Service, req: any, response: any) {
    if (response.header.referance == 'save') {

    }
  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
