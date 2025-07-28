import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, AfterViewInit {

  @Input()
  imageSrc!: any;
  @Input()
  height: number = 320;
  width: number;
  @Input()
  isView: boolean = false;
  @Input()
  isPublic: boolean = false;
  @Input()
  signatureInfo: any;

  scaleFactor: number = 1;

  private img: HTMLImageElement;


  constructor(
    private activeModel: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    console.log('getting signature information: ',  this.signatureInfo);

  }

  ngAfterViewInit(): void {
    this.img = document.getElementById('img') as HTMLImageElement;
    this.width = this.img.width;
  }

  closeModal(res: any) {
    this.activeModel.close();
  }





}
