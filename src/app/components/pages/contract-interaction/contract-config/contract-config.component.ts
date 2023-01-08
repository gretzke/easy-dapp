import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { enumComponentsSelector } from '../store/contract.selector';

@Component({
  selector: 'app-contract-config',
  templateUrl: './contract-config.component.html',
  styleUrls: ['./contract-config.component.scss'],
})
export class ContractSettingsComponent implements OnInit {
  enums$: Observable<string[]>;

  constructor(private store: Store<{}>) {
    this.enums$ = this.store.select(enumComponentsSelector);
  }

  ngOnInit(): void {}
}
