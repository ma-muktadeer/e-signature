import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivityLogService } from '../layout/activity-log/activity-log.service';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { Softcafe } from '../softcafe/common/Softcafe';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Component({
  selector: 'app-user-unlock',
  templateUrl: './user-unlock.component.html',
  styleUrls: ['./user-unlock.component.scss']
})
export class UserUnlockComponent extends Softcafe implements OnInit, Service {

  @Input()
  loginName: string;

  validUser: any;
  otpCode: any;
  otpMessage: string;
  showProgress: boolean = false;
  timerSubscription: any;
  countdown: number = 0;
  showButton: boolean = false;
  isResend: boolean = false;
  // msg: string;


  constructor(
    private model: NgbActiveModal,
    private cs: CommonService,
    private activityLogService: ActivityLogService,
  ) {
    super();
  }


  ngOnInit(): void {
    debugger
    if (!this.loginName) {
      this.model.close('Invalid request.');
    }

    this.internalUserUnlock();

  }

  internalUserUnlock(resend: boolean = false) {
    this.isResend = resend;
    debugger
    const payload = {
      loginName: this.loginName,
    };

    this.cs.sendRequestPublic(this, ActionType.INTERNAL_USER_UNLOCK_OTP, ContentType.User, 'INTERNAL_USER_UNLOCK_OTP', payload);
  }

  closePopup() {
    this.model.close();
  }

  onOtpInput(event: any) {
    debugger
    const value = event.target.value;
    // Remove any non-numeric characters
    this.otpCode = value.replace(/\D/g, '');
    event.target.value = this.otpCode;
    if (value && value.length < 6) {
      this.otpMessage = 'OTP should be 6 digits';
    }
    else if (value && value.length === 6) {
      this.otpMessage = '';
    }
  }

  submitOtp() {
    if (this.showProgress) {
      return;
    }
    this.showProgress = true;

    const payload = {
      loginName: this.loginName,
      otp: this.otpCode,
      userId: this.validUser?.userId,
    };

    this.cs.sendRequestPublic(this, ActionType.UNLOCK_INTERNAL_USER, ContentType.User, 'UNLOCK_INTERNAL_USER', payload);

  }

  startCountdown() {
    this.timerSubscription = interval(1000).subscribe((seconds) => {
      this.countdown = 180 - seconds;
      if (this.countdown <= 0) {
        this.showButton = true;

        this.timerSubscription.unsubscribe();
      } else {
        this.showButton = false;
      }
    });
  }
  // msg: string;
  onResponse(service: Service, req: any, res: any) {
    this.isResend = false;
    this.showProgress = false;
    if (!super.isOK(res)) {
      // this.msg = res;
     Swal.fire(super.getErrorMsg(res));
      this.closePopup();
      return;
    }

    else if (res.header.referance == 'INTERNAL_USER_UNLOCK_OTP') {

      Swal.fire({
        timer: 5000,
        title: 'Success',
        // text: 'A OTP send to your mail',
        text: 'An OTP will be sent to your registered e-mail.',
        icon: 'success'
      }).then(() => {
        this.validUser = res.payload;
        this.startCountdown();
      });

    }
    else if (res.header.referance == 'UNLOCK_INTERNAL_USER') {

      Swal.fire({
        timer: 5000,
        title: 'Success',
        text: 'User unlock success',
        icon: 'success'
      }).then(() => {
        // this.validUser = res.payload;
        // this.openOtpPopup();

        this.model.close('User unlock success. Please try to login.');

      });

    }
  }
  onError(service: Service, req: any, res: any) {
    this.isResend = false;
    this.showProgress = false;
    throw new Error('Method not implemented.');
  }

}
