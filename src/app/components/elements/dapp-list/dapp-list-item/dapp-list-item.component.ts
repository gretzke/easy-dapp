import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { IDapp } from 'src/types/abi';

@Component({
  selector: 'app-dapp-list-item',
  templateUrl: './dapp-list-item.component.html',
  styleUrls: ['./dapp-list-item.component.scss'],
})
export class DappListItemComponent implements OnInit {
  @Input() dapp?: IDapp;
  faArrowRight = faArrowRight;

  constructor(private router: Router) {}

  async navigate(dapp: IDapp) {
    this.router.navigate(['/app', dapp.owner, dapp.url], {});
  }

  ngOnInit(): void {}
}
