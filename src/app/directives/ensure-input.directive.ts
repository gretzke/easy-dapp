import { Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputsConfig, InternalType } from 'src/types/abi';

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
  @Input() dataType: InternalType = 'string';
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
    if (value === null) {
      return '';
    }
    const matchedValue = value.match(this.regex());
    value = matchedValue === null ? '' : matchedValue[0];
    this._elementRef.nativeElement.value = value;
    this.onValueChange.emit(value);
    return value;
  }

  private regex() {
    switch (this.dataType) {
      case 'address':
        return /^(0$|0x[0-9a-fA-F]{0,40})/g;
      case 'uint256':
        if (this.config && this.config.formatter === 'decimals') {
          return new RegExp(`^[0-9]*(.[0-9]{0,${this.config.decimals ?? 18}})?`);
        }
        return /^([0-9]{0,256})/g;
      case 'string':
        return /.*/g;
      default:
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
