import { style, transition, trigger, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
  animations: [trigger('opacityLeave', [transition(':leave', [style({ opacity: 1 }), animate('100ms ease-in', style({ opacity: 0 }))])])],
})
export class SelectMenuComponent implements OnInit {
  @Input() list: string[] = [];
  @Input() initialValue?: number | string;
  @Input() placeholder = 'Select';
  @Output() onSelect = new EventEmitter<number>();
  faCaretDown = faCaretDown;
  faCheck = faCheck;

  isSelect = false;
  current?: number;
  highlight: number | undefined;

  constructor(public ui: UIService) {}

  ngOnInit(): void {
    if (this.initialValue === undefined) return;
    if (typeof this.initialValue === 'number') {
      this.current = this.initialValue;
      return;
    } else {
      this.current = this.list.findIndex((item) => item === this.initialValue);
      return;
    }
  }

  toggleSelect() {
    this.isSelect = !this.isSelect;
  }

  select(index: number) {
    this.current = index;
    this.onSelect.emit(index);
    this.toggleSelect();
  }

  setHighlight(index: number) {
    this.highlight = index;
  }

  highlightClasses(i: number) {
    const highlight = this.ui.theme === 'dark' ? 'bg-custom-dark-600' : 'bg-custom-light-500';
    return {
      'text-gray-100': this.highlight === i,
      [highlight]: this.highlight === i,
    };
  }

  checkmarkClasses(i: number) {
    const highlight = this.ui.theme === 'dark' ? 'text-custom-dark-500' : 'text-custom-light-500';
    return {
      'text-gray-100': this.highlight === i,
      [highlight]: this.highlight !== i,
    };
  }
}
