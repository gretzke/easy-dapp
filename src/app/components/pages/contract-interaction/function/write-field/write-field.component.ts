import { Component, Input, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ApprovalConfig, ContractDataType, IFieldWithConfig, InputsConfig, IWriteFieldConfig } from 'src/types/abi';
import { sendContractTx, updateInputConfig } from '../../store/contract.actions';

@Component({
  selector: 'app-write-field',
  templateUrl: './write-field.component.html',
  styleUrls: ['./write-field.component.scss'],
})
export class WriteFieldComponent implements OnInit {
  faChevronUp = faChevronUp;
  @Input() signature: string = '';
  @Input() state!: IFieldWithConfig;
  public args: ContractDataType[] = [];
  private approvalHook: ApprovalConfig | undefined;

  constructor(private store: Store<{}>, private ethereum: EthereumService) {}

  ngOnInit(): void {
    this.args = new Array(this.state.field.inputs.length);
    let config = { ...this.state.config } as IWriteFieldConfig;
    this.approvalHook = config.approvalHook;
    if (config.name === undefined) config.name = '';
    if (config.description === undefined) config.description = '';
    if (config.inputs === undefined) config.inputs = new Array(this.state.field.inputs.length).fill({});
    if (config.outputs === undefined) config.outputs = new Array(this.state.field.outputs.length).fill({});
    this.state = { ...this.state, config: config };
  }

  public async sendTx() {
    if (this.allArgsValid) {
      if (this.approvalHook) {
        await this.ethereum.approve(this.approvalHook.address, this.approvalHook.token);
      }
      this.store.dispatch(sendContractTx({ src: WriteFieldComponent.name, method: this.state.field.name, args: this.args }));
    }
  }

  get allArgsValid(): boolean {
    for (const arg of this.args) {
      if (arg === undefined) {
        return false;
      }
    }
    return true;
  }

  setArg(index: number, val: ContractDataType) {
    const argsCopy = [...this.args];
    argsCopy[index] = val;
    this.args = argsCopy;
  }

  public config(index: number) {
    if (!this.state || !this.state.config || !this.state.config.inputs) return undefined;
    return this.state.config.inputs[index];
  }

  setConfig(index: number, config: InputsConfig) {
    this.store.dispatch(
      updateInputConfig({
        src: WriteFieldComponent.name,
        signature: this.signature,
        length: this.state.field.inputs.length,
        index: index,
        config,
      })
    );
  }
}
