import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { EthereumService } from 'src/app/services/ethereum.service';
import { nativeCurrency } from 'src/helpers/chainConfig';
import { ApprovalConfig, ContractDataType, IFieldWithConfig, InputsConfig, IWriteFieldConfig } from 'src/types/abi';
import { sendContractTx, updateInputConfig } from '../../store/contract.actions';

@Component({
  selector: 'app-write-field',
  templateUrl: './write-field.component.html',
  styleUrls: ['./write-field.component.scss'],
})
export class WriteFieldComponent implements OnInit, OnDestroy {
  faChevronUp = faChevronUp;
  @Input() signature: string = '';
  @Input() state!: IFieldWithConfig;
  public args: ContractDataType[] = [];
  public payableForm = new FormControl('');
  private subscription = new Subscription();
  private approvalHook: ApprovalConfig | undefined;

  constructor(private store: Store<{}>, private ethereum: EthereumService) {}

  ngOnInit(): void {
    this.args = new Array(this.state.field.inputs?.length ?? 0);
    let config = { ...this.state.config } as IWriteFieldConfig;
    this.approvalHook = config.approvalHook;
    if (config.name === undefined) config.name = '';
    if (config.description === undefined) config.description = '';
    if (config.inputs === undefined) config.inputs = new Array(this.state.field.inputs?.length ?? 0).fill({});
    if (config.outputs === undefined) config.outputs = new Array(this.state.field.outputs?.length ?? 0).fill({});
    this.state = { ...this.state, config: config };
  }

  public async sendTx() {
    if (this.allArgsValid) {
      if (this.approvalHook) {
        await this.ethereum.approve(this.approvalHook.address, this.approvalHook.token);
      }
      let value = undefined;
      if (this.state.field.stateMutability === 'payable' && this.payableForm.value && this.payableForm.value !== '') {
        value = { value: ethers.utils.parseEther(this.payableForm.value) };
      }
      this.store.dispatch(sendContractTx({ src: WriteFieldComponent.name, method: this.state.field.name, args: this.args, opt: value }));
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
        length: this.state.field.inputs?.length ?? 0,
        index: index,
        config,
      })
    );
  }

  get nativeDecimals(): string {
    return nativeCurrency[this.ethereum.chainId]?.decimals.toString() ?? '18';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
