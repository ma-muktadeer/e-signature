import { Component, OnInit } from '@angular/core';
import { footerFabAnimations } from './footer-fab.animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-footer-fab',
  templateUrl: './footer-fab.component.html',
  styleUrls: ['./footer-fab.component.scss'],
  animations : footerFabAnimations
})
export class FooterFabComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  fabButtons = [
    {
      icon: 'timeline',
      name : 'footerFabTimeline'
    },
    {
      icon: 'chat',
      name : 'chat'
    },
    {
      icon: 'room',
      name : 'footerFabRoom'
    },
    {
      icon: 'lightbulb_outline',
      name : 'footerFabOutline'
    },
    {
      icon: 'lock',
      name : 'footerFabLock'
    }
  ];
  buttons = [];
  fabTogglerState = 'inactive';

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  onFooterFabMenuClick(item : any){
    console.log(item);
    console.log(this.router.url);
    if(item.name == 'chat'){
      this.router.navigate(['chat']);
    }
  }

}
