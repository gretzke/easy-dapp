import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { placeholder, transformValue, uintRegex } from 'src/helpers/util';
import { InputType } from 'src/types';
import { ContractDataType, InputsConfig, InternalType, VariableType } from 'src/types/abi';
import { editSelector, enumSelector } from '../../store/contract.selector';
import { ValueInputComponent } from '../value-input/value-input.component';

@Component({
  selector: 'app-contract-input-field',
  templateUrl: './contract-input-field.component.html',
  styleUrls: ['./contract-input-field.component.scss'],
})
export class ContractInputFieldComponent implements OnInit, OnDestroy {
  @ViewChild(ValueInputComponent) defaultInput!: ValueInputComponent;
  @Input() type?: VariableType;
  @Input() config?: InputsConfig;
  @Output() valueUpdated = new EventEmitter<ContractDataType>();
  @Output() configUpdated = new EventEmitter<InputsConfig>();
  faCalendar = faCalendar;
  public edit$ = this.store.select(editSelector);
  public inputType: InputType = 'default';
  public enum: string[] = [];
  public arrayDataType: InternalType = 'string';
  public arrayLength = 0;
  private subscription = new Subscription();
  public timestamp = new Date();
  public minDate = this.toDate(0);
  public tmpDate = new Date();
  public showDatePicker = false;
  private debounce = new Date();

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    if (this.type?.type === 'tuple') {
      this.inputType = 'tuple';
    } else if (/[\[\]]/.test(this.type?.type ?? '')) {
      const match = /^(\w+)\[(\d*)\]$/.exec(this.type!.type);
      if (match === null || match[1] === '') return;
      if (match[1] === 'tuple') this.inputType = 'tuple[]';
      else {
        this.inputType = 'array';
        this.arrayDataType = match[1] as InternalType;
      }
      if (match[2] === '') return;
      this.arrayLength = parseInt(match[2]);
    } else if (this.type?.internalType.substring(0, 5) === 'enum ') {
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

  updateValue(value?: string) {
    if (this.type && value !== undefined) {
      if (this.config?.formatter === 'timestamp') {
        if (value === '') {
          this.valueUpdated.emit(undefined);
          return;
        }
        this.tmpDate = this.toDate(parseInt(value));
        this.timestamp = this.tmpDate;
      }
      this.valueUpdated.emit(transformValue(this.type.internalType, value, this.config));
    } else {
      this.valueUpdated.emit(undefined);
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
    return placeholder(this.type?.type, this.config?.formatter);
  }

  isNumber(type: string) {
    return uintRegex.test(type);
  }

  setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;
    const unix = (timestamp.getTime() / 1000).toFixed(0);
    this.defaultInput.form.controls.value.setValue(unix.toString());
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
