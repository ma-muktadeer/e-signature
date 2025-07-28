import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent extends Softcafe implements OnInit, Service {

  @Input('data') data: any;

  showProgress: boolean = false;
  spinnerApproveBtn: boolean = false;
  spinnerSaveBtn: boolean = false;
  saveOrUpdate: string = "Save";

  freeTextId: number;
  textType: any;
  textGroup: any;
  textBody: any;
  textSubject: any;


  public groupList = [
    { name: "INWARD", value: "INWARD" },
    { name: "OUTWARD", value: "OUTWARD" }
  ]



  constructor(private modal: NgbActiveModal, private cs: CommonService) {
    super();
  }


  ngOnInit(): void {
    debugger
    this.data.freeTextId ? this.editForm(this.data) : console.log(this.data);
  }
  editForm(data: any) {
    this.saveOrUpdate = 'Update';
    console.log('requesting for update free text with value', data);
    this.freeTextId = data.freeTextId;
    this.textType = data.type;
    this.textGroup = data.textGroup;
    this.textBody = data.reqBody.length > 0 ? data.reqBody : data.body;
    this.textSubject = data.subject;
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    // uploadUrl: 'v1/image',
    // // upload: (file: File) => {  },
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ],
  };

  isFormValidation(): boolean {
    return (this.textBody && this.textSubject && this.textType);
  }
  saveOrUpdateBtn() {
    this.spinnerSaveBtn = this.isFormValidation();
    // this.saveOrUpdate = 'update';
    debugger

    if (!this.spinnerSaveBtn) {
      alert('Please provide all required information.');

      return true;
    }
    else {
      const payload = {
        freeTextId: this.freeTextId,
        subject: this.textSubject,
        reqBody: this.textBody,
        type: this.textType,
        textGroup: this.textGroup,
        actionStatus: this.saveOrUpdate,
      }

      this.cs.sendRequest(this, ActionType.SAVE, ContentType.FreeText, 'SAVE', payload);
    }
  }

  onApprove() {
    this.spinnerApproveBtn = !this.spinnerApproveBtn;
  }

  closeModal(msg: any) {
    this.modal.close(msg);
  }

  onResponse(service: Service, req: any, res: any) {
    this.spinnerSaveBtn = false;
    debugger
    if (!res.header.referance) {
      throw new Error('Method not implemented.');
    }
    else if (res.header.referance == 'SAVE') {
      const datas = res.payload;
      console.log("find list of text is ", datas);
      const payload = {
        freetextList: datas,
      }
      this.closeModal(payload);
    }
  }

  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
