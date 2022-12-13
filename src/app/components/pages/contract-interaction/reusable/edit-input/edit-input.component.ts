import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InternalType } from 'src/types/abi';

@Component({
  selector: '[app-edit-input]',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
})
export class EditInputComponent implements OnInit {
  @Input() dataType: InternalType = 'string';
  @Input() public value = '';
  @Input() public placeholder = '';
  @Input() public hint = '';
  @Input() public error = '';
  @Output() valueUpdated = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  valueChanged() {
    this.valueUpdated.emit(this.value);
  }
}
