import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { enumComponentsSelector } from '../../store/contract.selector';

@Component({
  selector: 'app-enum-config',
  templateUrl: './enum-config.component.html',
  styleUrls: ['./enum-config.component.scss'],
})
export class EnumConfigComponent implements OnInit {
  @Input() enums: string[] = [];
  enums$: Observable<string[]>;

  constructor(private store: Store<{}>) {
    this.enums$ = this.store.select(enumComponentsSelector);
  }

  ngOnInit(): void {}
}
