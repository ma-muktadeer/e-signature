import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { parseBoolean } from 'angular-slickgrid';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { SconfigService } from 'src/app/service/sconfig.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-setup',
  templateUrl: './application-setup.component.html',
  styleUrls: ['./application-setup.component.scss']
})
export class ApplicationSetupComponent implements OnInit {

  public applicationSetup: FormGroup | any;

  showProgress1
  public appPermission = AppPermission;

  APPLICATION_SUTUP = "APPLICATION_SUTUP"
  LOGIN = "LOGIN"

  ENABLE_LOGIN_ATTEMPT = "ENABLE_LOGIN_ATTEMPT"
  BLOCK_LOGIN_ATTEMPT = "BLOCK_LOGIN_ATTEMPT"
  SESSION_TIME_OUT = "SESSION_TIME_OUT"


  configEnableLoginAttempt
  configBlockLoginAttempt
  configsessionTimeout

  btnRef: string = 'Save';

  constructor(
    private fb: FormBuilder,
    private sconfigService: SconfigService,
    public permissioinStoreService: PermissioinStoreService,
  ) {

    this.applicationSetup = this.fb.group({
      enableLoginAttempt: [0],//checkbock
      blockLoginAttempt: [null, [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],

      // blockLoginAttempt: [null, [Validators.required, Validators.pattern('[1-9]*')]],//number field
      sessionTimeout: [null]
    });
  }

  ngOnInit(): void {

    this.loadSetup();
  }

  loadSetup() {
    this.sconfigService.selectByGroupAndSubGroupConfigName(this.APPLICATION_SUTUP, this.LOGIN,
      [this.ENABLE_LOGIN_ATTEMPT, this.BLOCK_LOGIN_ATTEMPT, this.SESSION_TIME_OUT])
      .subscribe({
        next: (res: any) => {
          const value: any[] = res.payload;
          if (value) {
            let enableLoginAttempt;
            let blockLoginAttempt;
            let sessionTimeout;
            value.some(s => {
              if (s.configName === this.ENABLE_LOGIN_ATTEMPT) {
                this.configEnableLoginAttempt = s;
                enableLoginAttempt = parseBoolean(this.configEnableLoginAttempt.value1);
              }
              else if (s.configName === this.BLOCK_LOGIN_ATTEMPT) {
                this.configBlockLoginAttempt = s;
                blockLoginAttempt = this.configBlockLoginAttempt.value1;
              }

              else if (s.configName === this.SESSION_TIME_OUT) {
                this.configsessionTimeout = s;
                sessionTimeout = this.configsessionTimeout.value1;
              }
            });

            const patchValue = {
              enableLoginAttempt: enableLoginAttempt,
              blockLoginAttempt: blockLoginAttempt,
              sessionTimeout: sessionTimeout,
            };
            this.applicationSetup.patchValue(patchValue);
            this.btnRef = 'Update';
          }
        },
        error: (err: any) => {
          console.log(err);

        }
      })
  }
  onSave() {
    debugger

    var payloadconfigEnableLoginAttempt = {
      configGroup: this.APPLICATION_SUTUP,
      configSubGroup: this.LOGIN,
      configName: this.ENABLE_LOGIN_ATTEMPT,
      value1: this.applicationSetup.value.enableLoginAttempt,
      configId: this.configEnableLoginAttempt ? this.configEnableLoginAttempt.configId : null

    };


    var payloadcconfigBlockLoginAttempt = {
      configGroup: this.APPLICATION_SUTUP,
      configSubGroup: this.LOGIN,
      configName: this.BLOCK_LOGIN_ATTEMPT,
      value1: this.applicationSetup.value.blockLoginAttempt,
      configId: this.configBlockLoginAttempt ? this.configBlockLoginAttempt.configId : null

    };

    var payloadConfigsessionTimeout = {
      configGroup: this.APPLICATION_SUTUP,
      configSubGroup: this.LOGIN,
      configName: this.SESSION_TIME_OUT,
      value1: this.applicationSetup.value.sessionTimeout,
      configId: this.configsessionTimeout ? this.configsessionTimeout.configId : null
    };

    const requestData = [payloadconfigEnableLoginAttempt, payloadConfigsessionTimeout];
    if (this.applicationSetup.value.blockLoginAttempt > 0) {
      requestData.push(payloadcconfigBlockLoginAttempt);
    }
    const payload = {
      requestData: requestData,
    }

    Swal.fire({
      title: 'Info',
      icon: 'info',
      // text: 'Are you want to save?',
      text: `Want to Submit?`,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Save Setting',
      denyButtonText: 'Don\'t Save',
    }).then(r => {
      if (r.isConfirmed) {
        this.sconfigService.saveApplicationSetup(payload).subscribe(
          {
            next: (res: any) => {
              console.log(res);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Save Success.',
                timer: 5000,
              }).then(r => {
                this.configsessionTimeout = res.payload
              });
            },
            error: (err: any) => {
              console.log('getting error: ', err);

            }
          }

        );
      } else {
        return;
      }
    });

  }

}