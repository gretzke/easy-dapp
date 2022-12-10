import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronUp, faEye, faEyeSlash, faUpDown } from '@fortawesome/free-solid-svg-icons';
import { ABIItem, FunctionType } from 'src/types/abi';

@Component({
  selector: '[app-function]',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss'],
  animations: [
    trigger('collapse', [
      transition(':enter', [style({ height: '0', opacity: 0 }), animate('200ms ease-in', style({ height: '*', opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ height: '0', opacity: 0 }))]),
    ]),
    trigger('iconRotation', [
      state('open', style({ transform: 'rotate(0)' })),
      state('closed', style({ transform: 'rotate(180deg)' })),
      transition('open => closed', [animate('200ms ease-in')]),
      transition('closed => open', [animate('200ms ease-in')]),
    ]),
  ],
})
export class FunctionComponent implements OnInit {
  faChevronUp = faChevronUp;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faUpDown = faUpDown;
  @Input() type: FunctionType = 'read';
  @Input() signature: string = '';
  @Input() field?: ABIItem;
  @Input() edit = false;
  @Input() hidden = false;
  @Input() collapsed = false;
  @Output() hide = new EventEmitter<boolean>();
  @Output() moveable = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggleHidden() {
    this.hidden = !this.hidden;
    this.hide.emit(this.hidden);
  }

  clickPressed() {
    this.moveable.emit(true);
  }

  clickReleased() {
    this.moveable.emit(false);
  }
}
