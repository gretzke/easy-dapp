import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { placeholder, transformValue } from 'src/helpers/util';
import { ContractDataType, InternalType } from 'src/types/abi';
import { ValueInputComponent } from '../value-input/value-input.component';

@Component({
  selector: 'app-array-input',
  templateUrl: './array-input.component.html',
  styleUrls: ['./array-input.component.scss'],
})
export class ArrayInputComponent implements OnInit {
  @ViewChildren(ValueInputComponent) arrayInputs: QueryList<ValueInputComponent> = new QueryList<ValueInputComponent>();
  @Input() type: InternalType = 'string';
  @Input() length = 0;
  @Output() valueUpdated = new EventEmitter<{ [key: string]: ContractDataType }[]>();
  public arrayLength: number[] = [];
  public values: (ContractDataType | undefined)[] = [];
  faTrash = faTrash;

  constructor() {}

  ngOnInit(): void {
    this.values = new Array(this.length > 0 ? this.length : 1).fill(undefined);
    this.arrayLength = new Array(this.length > 0 ? this.length : 1).fill(0).map((_, i) => i);
    if (this.length === 0) {
      setTimeout(() => {
        this.valueUpdated.emit([]);
      });
    }
  }

  public updateValue(index: number, value?: string): void {
    const formattedValue = value !== undefined ? transformValue(this.type, value) : undefined;
    if (this.length === 0) {
      if (this.arrayLength.length === index + 1 && formattedValue !== undefined) {
        this.values[index] = formattedValue;
        this.values.push(undefined);
        this.arrayLength.push(this.arrayLength.length);
      } else {
        this.values[index] = formattedValue;
      }
      this.update();
    } else {
      this.values[index] = formattedValue;
      this.update();
    }
  }

  removeAt(index: number): void {
    for (let i = index; i < this.values.length - 1; i++) {
      const item = this.arrayInputs.get(i)?.form.controls.value;
      const nextItem = this.arrayInputs.get(i + 1)?.form.controls.value;
      if (i === this.values.length - 2) {
        item?.setValue(null);
        item?.markAsPristine();
      } else {
        item?.setValue(nextItem?.value);
      }
    }
    this.values.pop();
    this.arrayLength.pop();
    this.update();
  }

  update(): void {
    // remove last field that is undefined by default
    let tmpValues = this.values.slice();
    if (this.length === 0) {
      tmpValues = tmpValues.slice(0, tmpValues.length - 1);
    }
    if (tmpValues.includes(undefined)) {
      this.valueUpdated.emit(undefined);
    } else {
      this.valueUpdated.emit(tmpValues as { [key: string]: ContractDataType }[]);
    }
  }

  get placeholder(): string {
    return placeholder(this.type);
  }
}
