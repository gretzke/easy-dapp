import { Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { intRegex, uintRegex, bytesRegex } from 'src/helpers/util';
import { MatchingType } from 'src/types';
import { InputsConfig } from 'src/types/abi';

@Directive({
  selector: '[appEnsureInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnsureInputDirective),
      multi: true,
    },
  ],
})
export class EnsureInputDirective {
  @Input() dataType: MatchingType = 'string';
  @Input() config?: InputsConfig;
  private _onChange?: (value: any) => {};
  public onValueChange = new EventEmitter<string>();
  constructor(private _elementRef: ElementRef) {}

  @HostListener('input') onInput() {
    let value = this._elementRef.nativeElement.value;
    let newValue = this.setInputValue(value);
    if (this._onChange) {
      this._onChange(newValue);
    }
  }
  private setInputValue(value: string): string {
    if (!value) {
      return '';
    }
    const matchedValue = value.match(this.regex());
    value = matchedValue === null ? '' : matchedValue[0];
    this._elementRef.nativeElement.value = value;
    this.onValueChange.emit(value);
    return value;
  }

  private regex() {
    if (this.dataType === 'address' || this.dataType === 'address payable') {
      return /^0x[0-9a-fA-F]{0,40}|^0/g;
    } else if (uintRegex.test(this.dataType)) {
      if (this.config && this.config.formatter === 'decimals') {
        return new RegExp(`^[0-9]+(\.[0-9]{0,${this.config.decimals ?? 18}})?`);
      }
      return /^([0-9]{0,256})/g;
    } else if (intRegex.test(this.dataType)) {
      if (this.config && this.config.formatter === 'decimals') {
        return new RegExp(`^(-?[0-9]+(\.[0-9]{0,${this.config.decimals ?? 18}})?)?`);
      }
      return /^(-?[0-9]{0,256})/g;
    } else if (this.dataType === 'bool') {
      return /^true|^tru|^tr|^t|^false|^fals|^fal|^fa|^f/g;
    } else if (this.dataType === 'url') {
      return /^0x[0-9a-fA-F]{40}\/\S+|^0x[0-9a-fA-F]{40}\/$|^(0$|0x[0-9a-fA-F]{0,40})/g;
    } else if (this.dataType === 'bytes') {
      return /^0x[0-9a-fA-F]+|^0x|^0/g;
    } else if (bytesRegex.test(this.dataType)) {
      const length = parseInt(this.dataType.replace('bytes', ''));
      return new RegExp(`^0x[0-9a-fA-F]{0,${length * 2}}|^0x|^0`);
    } else if (this.dataType === 'string') {
      return /.*/g;
    } else {
      return /.*/g;
    }
  }

  writeValue(value: string): void {
    this.setInputValue(value);
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {}
}
