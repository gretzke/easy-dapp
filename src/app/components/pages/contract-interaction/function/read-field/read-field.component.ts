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
  NestedOutputsConfig,
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
    this.args = new Array(this.state.field.inputs?.length ?? 0);
    let config = { ...this.state.config } as IBaseFieldConfig;
    if (config.name === undefined) config.name = '';
    if (config.description === undefined) config.description = '';
    if (config.inputs === undefined) config.inputs = new Array(this.state.field.inputs?.length ?? 0).fill({});
    if (config.outputs === undefined) config.outputs = new Array(this.state.field.outputs?.length ?? 0).fill({});
    this.state = { ...this.state, config: config };
  }

  public sendTx() {
    if (this.allArgsValid) {
      this.store.dispatch(readContract({ src: ReadFieldComponent.name, signature: this.signature, args: [...this.args] }));
    }
  }

  setArg(index: number, val: ContractDataType) {
    const argsCopy = [...this.args];
    argsCopy[index] = val;
    this.args = argsCopy;
  }

  setInputConfig(index: number, config: InputsConfig) {
    this.store.dispatch(
      updateInputConfig({
        src: ReadFieldComponent.name,
        signature: this.signature,
        length: this.state.field.inputs?.length ?? 0,
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

  public outputConfig(index: number, key?: string): OutputsConfig | undefined {
    if (!this.state || !this.state.config || !this.state.config.outputs) return undefined;
    let config = this.state.config.outputs[index];
    if (key && (config as NestedOutputsConfig).nested === true) {
      config = (config as NestedOutputsConfig).configs[key];
    }
    return config as OutputsConfig;
  }

  setOutputConfig(index: number, config: OutputsConfig, key?: string) {
    if (key) {
      const newConfig: NestedOutputsConfig = {
        nested: true,
        configs: {
          ...(this.state.config?.outputs[index] as NestedOutputsConfig).configs,
          [key]: config,
        },
      };
      this.store.dispatch(
        updateOutputConfig({
          src: ReadFieldComponent.name,
          signature: this.signature,
          length: this.state.field.outputs?.length ?? 0,
          index: index,
          config: newConfig,
        })
      );
      return;
    }
    this.store.dispatch(
      updateOutputConfig({
        src: ReadFieldComponent.name,
        signature: this.signature,
        length: this.state.field.outputs?.length ?? 0,
        index: index,
        config,
      })
    );
  }

  getStructValue(val: ContractDataType, name: string): ValidDataType {
    return (val as any)[name];
  }

  getValue(val: ContractDataType, type: VariableType, index: number): ValidDataType {
    if (/[\[\]]/.test(type.type) || type.type == 'tuple') {
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
}
