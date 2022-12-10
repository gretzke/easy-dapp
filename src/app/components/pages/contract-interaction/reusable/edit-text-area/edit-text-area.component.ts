import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: '[app-edit-text-area]',
  templateUrl: './edit-text-area.component.html',
  styleUrls: ['./edit-text-area.component.scss'],
})
export class EditTextAreaComponent implements OnInit {
  @Input() public value = '';
  @Input() public placeholder = '';
  @Input() public hint = '';
  @Output() valueUpdated = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  valueChanged() {
    this.valueUpdated.emit(this.value);
  }
}
