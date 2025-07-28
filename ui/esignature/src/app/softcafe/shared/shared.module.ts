import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoSpecialCharactersDirective } from '../common/no-special-characters.directive';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { RedStarComponent } from './red-star/red-star.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule  ],
  declarations: [SlideToggleComponent, RedStarComponent, NoSpecialCharactersDirective],
  exports : [SlideToggleComponent, RedStarComponent, NoSpecialCharactersDirective], 
})
export class SharedModule { }
