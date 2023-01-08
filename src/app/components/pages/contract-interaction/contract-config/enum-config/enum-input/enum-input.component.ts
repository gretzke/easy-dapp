import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setEnumConfig } from '../../../store/contract.actions';
import { enumSelector } from '../../../store/contract.selector';

@Component({
  selector: 'app-enum-input',
  templateUrl: './enum-input.component.html',
  styleUrls: ['./enum-input.component.scss'],
})
export class EnumInputComponent implements OnInit {
  @Input() index: number = 0;
  @Input() enum: string = '';
  values$!: Observable<string[]>;

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.values$ = this.store.select(enumSelector(this.enum));
  }

  updateEnum(event: string[]): void {
    this.store.dispatch(setEnumConfig({ src: EnumInputComponent.name, name: this.enum, items: event }));
  }
}
