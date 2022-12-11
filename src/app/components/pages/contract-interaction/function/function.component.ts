import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronUp, faEye, faEyeSlash, faUpDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FunctionType, IFieldWithConfig } from 'src/types/abi';
import { updateFunctionConfig } from '../store/contract.actions';
import { editSelector, fieldSelector } from '../store/contract.selector';

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
  public edit$: Observable<boolean>;
  public field$!: Observable<IFieldWithConfig>;
  @Input() type: FunctionType = 'read';
  @Input() signature: string = '';
  @Input() hidden = false;
  @Input() collapsed = false;
  @Output() moveable = new EventEmitter<boolean>();

  constructor(private store: Store<{}>) {
    this.edit$ = this.store.select(editSelector);
  }

  ngOnInit(): void {
    this.field$ = this.store.select(fieldSelector(this.signature));
  }

  toggleHidden() {
    this.hidden = !this.hidden;
    this.store.dispatch(
      updateFunctionConfig({ src: FunctionComponent.name, signature: this.signature, key: 'hidden', value: this.hidden })
    );
  }

  clickPressed() {
    this.moveable.emit(true);
  }

  clickReleased() {
    this.moveable.emit(false);
  }
}
