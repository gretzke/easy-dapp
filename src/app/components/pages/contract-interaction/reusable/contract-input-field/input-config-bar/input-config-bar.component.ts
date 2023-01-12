import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { InputsConfig } from 'src/types/abi';
import { editSelector } from '../../../store/contract.selector';

@Component({
  selector: '[app-input-config-bar]',
  templateUrl: './input-config-bar.component.html',
  styleUrls: ['./input-config-bar.component.scss'],
})
export class InputConfigBarComponent implements OnInit {
  @Input() config?: InputsConfig;
  @Output() configUpdated = new EventEmitter<InputsConfig>();
  public edit$ = this.store.select(editSelector);

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {}

  toggleTimestamp() {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, formatter: this.config.formatter === 'timestamp' ? undefined : 'timestamp' });
  }

  toggleDecimals() {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, formatter: this.config.formatter === 'decimals' ? undefined : 'decimals' });
  }

  setDecimals(decimals: string) {
    if (this.config === undefined) this.config = {};
    if (decimals === '') decimals = '0';
    this.update({ ...this.config, decimals });
  }

  private update(config: InputsConfig) {
    this.configUpdated.emit(config);
  }
}
