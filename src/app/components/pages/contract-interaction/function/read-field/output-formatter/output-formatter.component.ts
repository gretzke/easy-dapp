import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { OutputType } from 'src/types';
import { OutputsConfig, ValidDataType, ValidReturnDataType, VariableType } from 'src/types/abi';
import { editSelector, enumSelector } from '../../../store/contract.selector';
import { EthersErr, parseEthersError } from 'src/helpers/errorMessages';

@Component({
  selector: 'app-output-formatter',
  templateUrl: './output-formatter.component.html',
  styleUrls: ['./output-formatter.component.scss'],
})
export class OutputFormatterComponent implements OnInit, OnDestroy {
  @Input() type!: VariableType;
  @Input() value: ValidReturnDataType = '';
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
    if (this.type.type === 'tuple') return 'tuple';
    if (/^tuple\[\d*\]$/.test(this.type.type)) return 'tuple[]';
    if (/[\[\]]/.test(this.type.type)) return 'array';
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
      case 'contract':
        return this.type.type === 'address' ? 'Contract' : this.type.internalType;
      default:
        return this.type.internalType;
    }
  }

  get isError(): boolean {
    if (!this.value) return false;
    return (this.value as EthersErr).reverted === true;
  }

  get formattedValue(): string {
    if (this.isError) {
      return parseEthersError((this.value as EthersErr).reason);
    }
    switch (this.outputType) {
      case 'enum':
        const index = this.value as number;
        return index >= this.enumConfig.length ? index.toString() : this.enumConfig[index];
      case 'timestamp':
        return new Date((this.value as number) * 1000).toLocaleString();
      case 'decimals':
        return ethers.utils.formatUnits(this.value.toString(), this.config?.decimals ?? '18');
      // case 'tuple':
      //   let result: string[] = [];
      //   const abi = this.type.components!;
      //   for (const struct of this.value as ValidDataType[]) {
      //     const items: string[] = [];
      //     for (const i of (struct as ValidDataType[]).keys()) {
      //       items.push(`${abi[i].name}: ${(struct as ValidDataType[])[i].toString()}`);
      //     }
      //     result.push('{' + items.join(', ') + '}');
      //   }
      //   return result.join(', ');
      case 'tuple[]':
        let res: string[] = [];
        const abiComponent = this.type.components!;
        for (const struct of this.value as ValidDataType[]) {
          const items: string[] = [];
          for (const i of (struct as ValidDataType[]).keys()) {
            items.push(`${abiComponent[i].name}: ${(struct as ValidDataType[])[i].toString()}`);
          }
          res.push('{' + items.join(', ') + '}');
        }
        return '[' + res.join(',') + ']';
      case 'array':
        const arr = this.value as ValidDataType[];
        if (arr.length === 0) return '[]';
        return `${arr.map((v) => v.toString()).join(', ')}`;
      default:
        return this.value?.toString();
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

  isAddress() {
    return this.type.type === 'address';
  }

  getUrl(): string[] {
    let url = ['/', 'new-dapp', this.formattedValue];
    if (this.outputType === 'contract' && this.config?.url) {
      if (/^(0$|0x[0-9a-fA-F]{0,40})\/\S+/g.test(this.config.url)) {
        const config = this.config.url.split('/');
        url = ['/', 'app', config[0], config[1], this.formattedValue];
      }
    }
    return url;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
