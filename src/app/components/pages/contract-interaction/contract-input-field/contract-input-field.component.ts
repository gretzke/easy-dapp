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
    switch (this.type?.internalType) {
      case 'address':
        return '0xA1337b...';
      case 'uint256':
        return '1337';
      case 'string':
        return 'Hello World';
      default:
        return '';
    }
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
