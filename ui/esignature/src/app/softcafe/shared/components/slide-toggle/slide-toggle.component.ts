import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent implements OnInit {

  @Input("checked") checked: boolean = false
  @Input("width") width: boolean = false
  @Input("height") height: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  onChange(e){
    console.log(e);
  }

}
