import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip, Subscription } from 'rxjs';
import { placeholder, transformValue } from 'src/helpers/util';
import { ContractDataType, VariableType } from 'src/types/abi';

@Component({
  selector: 'app-struct-input',
  templateUrl: './struct-input.component.html',
  styleUrls: ['./struct-input.component.scss'],
  animations: [
    trigger('opacity', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('opacityTranslateY', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(1rem)' })),
      ]),
    ]),
  ],
})
export class StructInputComponent implements OnInit, OnDestroy {
  @Input() name?: string;
  @Input() type?: VariableType;
  @Output() valueUpdated = new EventEmitter<{ [key: string]: ContractDataType }>();
  public showModal = false;
  public form: FormGroup;
  public transformedValue = '';
  private subscription: Subscription = new Subscription();

  constructor() {
    this.form = new FormGroup({});
    this.subscription.add(
      this.form.valueChanges.pipe(debounceTime(50), distinctUntilChanged(), skip(1)).subscribe((newValue) => {
        if (newValue) this.update(newValue);
      })
    );
  }

  ngOnInit(): void {
    for (const component of this.type?.components ?? []) {
      this.form.addControl(component.name, new FormControl(''));
    }
  }

  get structPlaceholder() {
    if (!this.type || !this.type.components) return '';
    const items: string[] = [];
    for (const field of this.type.components) {
      items.push(`${field.name}: ${field.type}`);
    }
    return '{ ' + items.join(', ') + ' }';
  }

  placeholder(type: string) {
    return placeholder(type);
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  update(newValue?: { [key: string]: string }) {
    if (this.form.valid && this.type && this.type.components && newValue !== undefined) {
      const parsedValue: { [key: string]: ContractDataType } = {};
      for (const component of this.type.components) {
        const transformedValue = transformValue(component.type, newValue[component.name]);
        if (transformedValue === undefined) {
          this.valueUpdated.emit(undefined);
          this.transformedValue = '';
          return;
        }
        parsedValue[component.name] = transformedValue;
      }
      this.valueUpdated.emit(parsedValue);
      this.transformedValue = JSON.stringify(parsedValue);
    } else {
      if (newValue === undefined) {
        this.resetForm();
      }
      this.valueUpdated.emit(undefined);
      this.transformedValue = '';
    }
  }

  private resetForm() {
    this.form = new FormGroup({});
    this.subscription.add(
      this.form.valueChanges.pipe(debounceTime(200), distinctUntilChanged(), skip(1)).subscribe((newValue) => {
        this.update(newValue);
      })
    );
    for (const component of this.type?.components ?? []) {
      this.form.addControl(component.name, new FormControl(''));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
