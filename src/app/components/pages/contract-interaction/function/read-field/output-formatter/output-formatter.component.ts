import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { OutputType } from 'src/types';
import { OutputsConfig, ValidDataType, VariableType } from 'src/types/abi';
import { editSelector, enumSelector } from '../../../store/contract.selector';

@Component({
  selector: 'app-output-formatter',
  templateUrl: './output-formatter.component.html',
  styleUrls: ['./output-formatter.component.scss'],
})
export class OutputFormatterComponent implements OnInit, OnDestroy {
  @Input() type!: VariableType;
  @Input() value: ValidDataType = '';
  @Input() config?: OutputsConfig;
  @Output() configUpdated = new EventEmitter<OutputsConfig>();
  public edit$ = this.store.select(editSelector);
  private uintRegex = /^uint\d*$/;
  private enumName?: string;
  private enumConfig: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    if (this.type.internalType.substring(0, 5) === 'enum ') {
      this.subscription.add(
        this.store.select(enumSelector(this.type.internalType.slice(5))).subscribe((enumConfig) => {
          this.enumName = enumConfig.length > 0 ? 'enum' : this.outputType;
          this.enumConfig = enumConfig;
        })
      );
    }
  }

  get outputType(): OutputType {
    if (this.enumName) return 'enum';
    return this.config?.formatter ?? 'default';
  }

  get name(): string {
    return this.config?.name ?? this.type.name;
  }

  get datatype(): string {
    switch (this.outputType) {
      case 'enum':
        return this.type.internalType.slice(5);
      case 'timestamp':
        return `Date (${this.type.internalType})`;
      case 'decimals':
        return `${this.config?.decimals ?? 18} decimals (${this.type.internalType})`;
      default:
        return this.type.internalType;
    }
  }

  get formattedValue() {
    switch (this.outputType) {
      case 'enum':
        const index = this.value as number;
        return index >= this.enumConfig.length ? index : this.enumConfig[index];
      case 'timestamp':
        return new Date((this.value as number) * 1000).toLocaleString();
      case 'decimals':
        return ethers.utils.formatUnits(this.value.toString(), this.config?.decimals ?? '18');
      default:
        return this.value;
    }
  }

  setName(name: string) {
    const config = { ...this.config, name };
    this.setConfig(config);
  }

  setConfig(config: OutputsConfig) {
    this.configUpdated.emit(config);
  }

  isNumber() {
    if (this.enumName) return false;
    return this.uintRegex.test(this.type.type);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
