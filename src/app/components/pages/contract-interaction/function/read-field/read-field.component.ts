import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OutputType } from 'src/types';
import {
  ContractDataType,
  IBaseFieldConfig,
  IContractState,
  IFieldWithConfig,
  InputsConfig,
  OutputsConfig,
  ValidDataType,
  VariableType,
} from 'src/types/abi';
import { readContract, updateInputConfig, updateOutputConfig } from '../../store/contract.actions';
import { contractStateSelector } from '../../store/contract.selector';

@Component({
  selector: 'app-read-field',
  templateUrl: './read-field.component.html',
  styleUrls: ['./read-field.component.scss'],
})
export class ReadFieldComponent implements OnInit {
  @Input() signature: string = '';
  @Input() state!: IFieldWithConfig;
  public args: ContractDataType[] = [];
  public contractState$: Observable<IContractState | undefined>;

  constructor(private store: Store<{}>) {
    this.contractState$ = this.store.select(contractStateSelector);
  }

  ngOnInit(): void {
    this.args = new Array(this.state.field.inputs.length);
    let config = { ...this.state.config } as IBaseFieldConfig;
    if (config.name === undefined) config.name = '';
    if (config.description === undefined) config.description = '';
    if (config.inputs === undefined) config.inputs = new Array(this.state.field.inputs.length).fill({});
    if (config.outputs === undefined) config.outputs = new Array(this.state.field.outputs.length).fill({});
    this.state = { ...this.state, config: config };
  }

  public sendTx() {
    if (this.allArgsValid) {
      this.store.dispatch(readContract({ src: ReadFieldComponent.name, signature: this.signature, args: [...this.args] }));
    }
  }

  setArg(index: number, val: ContractDataType) {
    this.args[index] = val;
  }

  setInputConfig(index: number, config: InputsConfig) {
    this.store.dispatch(
      updateInputConfig({
        src: ReadFieldComponent.name,
        signature: this.signature,
        length: this.state.field.inputs.length,
        index: index,
        config,
      })
    );
  }

  getOutputType(config?: OutputsConfig): OutputType {
    if (config && config.formatter) {
      return config.formatter;
    }
    return 'default';
  }

  setOutputConfig(index: number, config: OutputsConfig) {
    this.store.dispatch(
      updateOutputConfig({
        src: ReadFieldComponent.name,
        signature: this.signature,
        length: this.state.field.outputs.length,
        index: index,
        config,
      })
    );
  }

  getValue(val: ContractDataType, type: VariableType, index: number): ValidDataType {
    if (/[\[\]]/.test(type.type)) {
      return val as ValidDataType;
    }
    if (Array.isArray(val)) return val[index];
    return val;
  }

  get allArgsValid(): boolean {
    for (const arg of this.args) {
      if (arg === undefined) {
        return false;
      }
    }
    return true;
  }

  public inputConfig(index: number) {
    if (!this.state || !this.state.config || !this.state.config.inputs) return undefined;
    return this.state.config.inputs[index];
  }

  public outputConfig(index: number) {
    if (!this.state || !this.state.config || !this.state.config.outputs) return undefined;
    return this.state.config.outputs[index];
  }
}
