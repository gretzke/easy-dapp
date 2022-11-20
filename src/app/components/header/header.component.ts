import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenu = false;
  links = [
    { name: 'Dashboard', path: '/' },
    { name: 'About', path: '/about' },
  ];

  constructor() {}

  toggleMenu() {
    this.isMenu = !this.isMenu;
  }
}
