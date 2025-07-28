import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { UserService } from '../admin/services/user.service';
import { CommonService } from 'src/app/softcafe/common/common.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends Softcafe implements OnInit, Service{
 loginUser: any;
  constructor(public router: Router, private userService: UserService,public cs: CommonService) {
    super();
  }
  onResponse(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.loginUser = this.cs.loadLoginUser();
  }


  onClickHeaderProfile() {
    debugger
    this.reloadProfile(false);
    this.router.navigate(['/user/profile2']);
}


reloadProfile(addUser: boolean) {
  debugger
  this.userService.changeCurrentUser(this.cs.loadLoginUser());
  // this.userService.addUser = false;
  // this.router.navigate(['/user/profile']);
  this.isAddUser(addUser);
}

isAddUser(addUser: boolean) {
  this.userService.addUser = addUser;
  // this.reloadProfile();
}


}
