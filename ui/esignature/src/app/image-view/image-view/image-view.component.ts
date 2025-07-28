import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {


  @Input()
  imageSrc!: any;
  @Input()
  signatureInfo!: any;
  @Input()
  height: number = 320;
  @Input()
  isView: boolean = false;
  @Input()
  isPublic: boolean = false;

  constructor(
    private ngModel: NgbModal,
  ) {

  }

  ngOnInit(): void {
  }

  @Input()
  imageViewTemplate = ViewComponent;
  openSignatureView() {
    debugger
    if ((this.signatureInfo && this.signatureInfo?.signatureStatus === 'ACTIVE') || this.isPublic) {
      let res = this.ngModel.open(this.imageViewTemplate, { size: 'xl', backdrop: 'static' });
      res.componentInstance.isView = true;
      res.componentInstance.isPublic = this.isPublic;
      res.componentInstance.imageSrc = this.imageSrc;
      res.componentInstance.height = this.height;
    } else {
      return;
    }

  }


}
