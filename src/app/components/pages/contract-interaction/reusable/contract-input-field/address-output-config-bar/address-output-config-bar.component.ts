import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { OutputsConfig } from 'src/types/abi';
import { editSelector } from '../../../store/contract.selector';

@Component({
  selector: '[app-address-output-config-bar]',
  templateUrl: './address-output-config-bar.component.html',
  styleUrls: ['./address-output-config-bar.component.scss'],
})
export class AddressOutputConfigBarComponent implements OnInit {
  @Input() config?: OutputsConfig;
  @Output() configUpdated = new EventEmitter<OutputsConfig>();
  public edit$ = this.store.select(editSelector);

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    if (this.config === undefined) this.config = {};
  }

  toggleContract() {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, formatter: this.config.formatter === 'contract' ? undefined : 'contract' });
  }

  setUrl(url: string) {
    if (this.config === undefined) this.config = {};
    this.update({ ...this.config, url });
  }

  private update(config: OutputsConfig) {
    this.configUpdated.emit(config);
  }
}
