import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ContractDataType, VariableType } from 'src/types/abi';
import { StructInputComponent } from './struct-input/struct-input.component';

@Component({
  selector: 'app-struct-array-input',
  templateUrl: './struct-array-input.component.html',
  styleUrls: ['./struct-array-input.component.scss'],
})
export class StructArrayInputComponent implements OnInit {
  @ViewChildren(StructInputComponent) structInputs: QueryList<StructInputComponent> = new QueryList<StructInputComponent>();
  @Input() type?: VariableType;
  @Input() name?: string;
  @Input() length = 0;
  @Output() valueUpdated = new EventEmitter<{ [key: string]: ContractDataType }[]>();
  // helper to iterate in ngFor
  public arrayLength: number[] = [];
  public values: ({ [key: string]: ContractDataType } | undefined)[] = [];
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

  public updateValue(index: number, value: { [key: string]: ContractDataType } | undefined): void {
    if (this.length === 0) {
      if (this.arrayLength.length === index + 1 && value !== undefined) {
        this.values[index] = value;
        this.values.push(undefined);
        this.arrayLength.push(this.arrayLength.length);
      } else {
        this.values[index] = value;
      }
      this.update();
    } else {
      this.values[index] = value;
      this.update();
    }
  }

  removeAt(index: number): void {
    for (let i = index; i < this.values.length - 1; i++) {
      const struct = this.structInputs.get(i);
      const nextStruct = this.structInputs.get(i + 1);
      if (i === this.values.length - 2) {
        struct?.update(undefined);
      } else {
        struct?.update(nextStruct?.form.value);
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
}
