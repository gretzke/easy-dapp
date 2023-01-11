import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ApprovalConfig, IWriteFieldConfig, TokenType } from 'src/types/abi';
import { updateFunctionConfig } from '../../store/contract.actions';
import { configSelector } from '../../store/contract.selector';
@Component({
  selector: 'app-approval-hooks',
  templateUrl: './approval-hooks.component.html',
  styleUrls: ['./approval-hooks.component.scss'],
})
export class ApprovalHooksComponent implements OnInit, OnDestroy {
  public writeFunctions: string[] = [];
  public checked: { [key: string]: boolean } = {};
  public config: { [key: string]: ApprovalConfig } = {};
  public tokenTypes: TokenType[] = ['ERC20', 'ERC721', 'ERC1155'];
  public form: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<{}>) {
    this.form = new FormGroup({});
    this.subscription.add(
      this.store.select(configSelector).subscribe((config) => {
        if (config) {
          const writeFunctions = config?.write.order || [];
          for (const signature of writeFunctions) {
            const c = config.functionConfig[signature] as IWriteFieldConfig;
            if (c && c.approvalHook) {
              if (this.form.controls[signature] === undefined) {
                this.form.addControl(signature, new FormControl(c.approvalHook.address));
                this.subscription.add(
                  this.form.controls[signature].valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value) => {
                    this.update(signature, value);
                  })
                );
              }
              this.config[signature] = c.approvalHook;
              this.checked[signature] = true;
            } else {
              this.config[signature] = { address: '', token: 'ERC20' };
            }
          }
          this.writeFunctions = writeFunctions;
        }
      })
    );
  }

  ngOnInit(): void {}

  toggleChecked(index: number) {
    const signature = this.writeFunctions[index];
    if (!this.checked[signature]) {
      if (!this.form.contains(signature)) {
        this.form.addControl(signature, new FormControl(''));
        this.subscription.add(
          this.form.controls[signature].valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value) => {
            this.update(signature, value);
          })
        );
      }
      this.checked[signature] = true;
      this.update(signature, this.form.controls[signature].value);
    } else {
      this.checked[signature] = false;
      this.update(signature, '');
    }
  }

  editTokenType(signature: string, token: TokenType) {
    this.config = { ...this.config, [signature]: { ...this.config[signature], token } };
    this.store.dispatch(
      updateFunctionConfig({
        src: ApprovalHooksComponent.name,
        signature,
        key: 'approvalHook',
        value: { address: this.config[signature].address, token },
      })
    );
  }

  update(signature: string, value: string) {
    if (ethers.utils.isAddress(value)) {
      this.form.controls[signature].setErrors(null);
      this.store.dispatch(
        updateFunctionConfig({
          src: ApprovalHooksComponent.name,
          signature,
          key: 'approvalHook',
          value: { address: value, token: this.config[signature].token },
        })
      );
    } else {
      this.form.controls[signature].setErrors({ invalid: true });
      this.store.dispatch(
        updateFunctionConfig({
          src: ApprovalHooksComponent.name,
          signature,
          key: 'approvalHook',
          value: undefined,
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
