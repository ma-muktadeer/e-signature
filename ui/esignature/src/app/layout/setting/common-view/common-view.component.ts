import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-view',
  templateUrl: './common-view.component.html',
  styleUrls: ['./common-view.component.scss']
})
export class CommonViewComponent implements OnInit {

  @Input()
  file: any;
  @Input()
  imgFile: any;

  constructor(private actModel: NgbActiveModal) { 
    
  }

  ngOnInit(): void {
    if(!this.file || !this.imgFile){
      this.closePopup();
    }
  }

  closePopup() {
    this.actModel.close();
  }

}
