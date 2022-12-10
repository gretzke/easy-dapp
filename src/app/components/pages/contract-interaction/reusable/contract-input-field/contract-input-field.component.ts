import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BigNumber } from 'ethers';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ContractDataType, VariableType } from 'src/types/abi';

@Component({
  selector: 'app-contract-input-field',
  templateUrl: './contract-input-field.component.html',
  styleUrls: ['./contract-input-field.component.scss'],
})
export class ContractInputFieldComponent implements OnInit, OnDestroy {
  @Input() type?: VariableType;
  @Output() valueUpdated = new EventEmitter<ContractDataType>();
  public form: FormGroup;
  private subscription: Subscription;
  private uintRegex = /^uint\d*$/;
  private intRegex = /^int\d*$/;
  private bytesRegex = /^bytes\d*$/;

  constructor() {
    this.form = new FormGroup({
      value: new FormControl('', [Validators.required]),
    });
    this.subscription = this.form.controls.value.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((newValue) => {
      if (this.form.valid) {
        this.valueUpdated.emit(this.transformValue(newValue));
      } else {
        this.valueUpdated.emit(undefined);
      }
    });
  }

  ngOnInit(): void {}

  // TODO: add validation and error handling
  get placeholder() {
    const t = this.type?.type;
    if (!t) return '';
    if (t === 'address') return '0xA1337b...';
    if (this.uintRegex.test(t)) return '1337';
    if (this.intRegex.test(t)) return '-1337';
    if (this.bytesRegex.test(t)) return '0x...';
    if (t === 'string') return 'Hello World';
    if (t === 'bool') return 'true';
    else return '';
  }

  private transformValue(value: string): ContractDataType {
    switch (this.type?.internalType) {
      case 'address':
        return value;
      case 'uint256':
        return BigNumber.from(value);
      case 'string':
        return value;
      default:
        return value;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
