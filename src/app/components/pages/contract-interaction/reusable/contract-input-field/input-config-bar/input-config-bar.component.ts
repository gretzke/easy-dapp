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
    this.update({ ...this.config, timestamp: this.config.timestamp === true ? undefined : !this.config.timestamp });
  }

  toggleDecimals() {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, timestamp: this.config.timestamp === false ? undefined : false });
  }

  setDecimals(decimals: string) {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, decimals });
  }

  private update(config: InputsConfig) {
    this.configUpdated.emit(config);
  }
}
