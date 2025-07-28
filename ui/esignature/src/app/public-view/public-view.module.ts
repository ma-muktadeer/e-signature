import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageViewModule } from '../image-view/image-view.module';
import { PublicViewRoutingModule } from './public-view-routing.module';
import { PublicViewComponent } from './public-view/public-view.component';


@NgModule({
  declarations: [PublicViewComponent],
  imports: [
    CommonModule,
    PublicViewRoutingModule,
    ImageViewModule
  ]
})
export class PublicViewModule { }
