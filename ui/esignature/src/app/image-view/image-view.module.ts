import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from './image-view/image-view.component';
import { ViewComponent } from './view/view.component';



@NgModule({
  declarations: [ImageViewComponent, ViewComponent],
  imports: [
    CommonModule,
    NgbTooltipModule
  ],
  exports: [
    ImageViewComponent
  ],
  providers: [
    NgbActiveModal
  ]
})
export class ImageViewModule { }
