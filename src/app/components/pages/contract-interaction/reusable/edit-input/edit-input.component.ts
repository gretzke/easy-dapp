import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatchingType } from 'src/types';

@Component({
  selector: '[app-edit-input]',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
})
export class EditInputComponent implements OnInit {
  @Input() dataType: MatchingType = 'string';
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
