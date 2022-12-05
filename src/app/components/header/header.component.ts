import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  showMenu = false;
  links = [
    { name: 'Dashboard', path: '/' },
    { name: 'New Dapp', path: '/new-dapp' },
  ];

  constructor() {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
