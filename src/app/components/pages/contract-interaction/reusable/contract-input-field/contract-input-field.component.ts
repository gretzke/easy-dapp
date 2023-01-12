import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BigNumber, ethers } from 'ethers';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ContractDataType, InputsConfig, VariableType } from 'src/types/abi';
import { editSelector, enumSelector } from '../../store/contract.selector';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { InputType } from 'src/types';

@Component({
  selector: 'app-contract-input-field',
  templateUrl: './contract-input-field.component.html',
  styleUrls: ['./contract-input-field.component.scss'],
})
export class ContractInputFieldComponent implements OnInit, OnDestroy {
  @Input() type?: VariableType;
  @Input() config?: InputsConfig;
  @Output() valueUpdated = new EventEmitter<ContractDataType>();
  @Output() configUpdated = new EventEmitter<InputsConfig>();
  faCalendar = faCalendar;
  public form: FormGroup;
  public edit$ = this.store.select(editSelector);
  public inputType: InputType = 'default';
  public enum: string[] = [];
  private subscription: Subscription;
  private uintRegex = /^uint\d*$/;
  private intRegex = /^int\d*$/;
  private bytesRegex = /^bytes\d*$/;
  private currentTimestamp = (Date.now() / 1000).toFixed(0);
  public timestamp = new Date();
  public minDate = this.toDate(0);
  public tmpDate = new Date();
  public showDatePicker = false;
  private debounce = new Date();

  constructor(private store: Store<{}>) {
    this.form = new FormGroup({
      value: new FormControl('', [Validators.required]),
    });
    this.subscription = this.form.controls.value.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((newValue) => {
      if (this.form.valid) {
        this.valueUpdated.emit(this.transformValue(newValue));
        if (this.config?.formatter === 'timestamp') {
          this.tmpDate = this.toDate(newValue);
          this.timestamp = this.tmpDate;
        }
      } else {
        this.valueUpdated.emit(undefined);
      }
    });
  }

  ngOnInit(): void {
    if (this.type?.internalType.substring(0, 5) === 'enum ') {
      this.subscription.add(
        this.store.select(enumSelector(this.type.internalType.slice(5))).subscribe((enumConfig) => {
          if (enumConfig.length > 0) {
            this.inputType = 'enum';
          } else {
            this.inputType = 'default';
          }
          this.enum = enumConfig;
        })
      );
    }
  }

  get name() {
    if (this.config === undefined) return this.type?.name;
    return this.config.name === undefined ? this.type?.name : this.config.name;
  }

  setName(name: string) {
    this.configUpdated.emit({ ...this.config, name });
  }

  setConfig(config: InputsConfig) {
    this.configUpdated.emit({ ...this.config, ...config });
  }

  get placeholder() {
    const t = this.type?.type;
    if (!t) return '';
    if (t === 'address') return '0xA1337b...';
    if (this.uintRegex.test(t)) {
      if (!this.config || this.config.formatter === undefined) return '1337';
      if (this.config.formatter === 'timestamp') return this.currentTimestamp;
      if (this.config.formatter === 'decimals') return '12.34';
    }
    if (this.intRegex.test(t)) return '-1337';
    if (this.bytesRegex.test(t)) return '0x...';
    if (t === 'string') return 'Hello World';
    if (t === 'bool') return 'true';
    else return '';
  }

  isNumber(type: string) {
    return this.uintRegex.test(type);
  }

  private transformValue(value: string): ContractDataType {
    switch (this.type?.internalType) {
      case 'address':
        return value;
      case 'uint256':
        if (this.config && this.config.formatter === 'decimals') {
          return ethers.utils.parseUnits(value, this.config.decimals ?? 18);
        }
        return BigNumber.from(value);
      case 'string':
        return value;
      default:
        return value;
    }
  }

  setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;
    const unix = (timestamp.getTime() / 1000).toFixed(0);
    this.form.controls.value.setValue(unix);
  }

  registerSelect(event: Date) {
    if (
      event.getDate() !== this.tmpDate.getDate() ||
      event.getMonth() !== this.tmpDate.getMonth() ||
      event.getFullYear() !== this.tmpDate.getFullYear() ||
      (event.getTime() === this.tmpDate.getTime() && new Date().getTime() - this.debounce.getTime() > 300)
    ) {
      this.showDatePicker = false;
    }
    this.tmpDate = event;
    this.debounce = new Date();
  }

  toDate(unix: number) {
    return new Date(unix * 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
