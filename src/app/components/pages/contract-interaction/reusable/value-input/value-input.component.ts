import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { InputsConfig, InternalType } from 'src/types/abi';

@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.scss'],
})
export class ValueInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = '';
  @Input() type: InternalType = 'string';
  @Input() config?: InputsConfig;
  @Output() valueUpdated = new EventEmitter<string | undefined>();
  public checked = false;
  public form!: FormGroup;
  private subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    const validators = [];
    if (this.type !== 'string') {
      validators.push(Validators.required);
    }
    this.form = new FormGroup({
      value: new FormControl('', validators),
    });
    this.subscription.add(
      (this.subscription = this.form.controls.value.valueChanges.pipe(debounceTime(50)).subscribe((newValue) => {
        if (this.form.valid) {
          this.valueUpdated.emit(newValue);
        } else {
          this.valueUpdated.emit(undefined);
        }
      }))
    );

    if (this.type === 'string') {
      setTimeout(() => {
        this.valueUpdated.emit('');
      });
    } else if (this.type === 'bool') {
      setTimeout(() => {
        this.valueUpdated.emit('false');
      });
    }
  }

  toggleChecked(): void {
    this.checked = !this.checked;
    this.valueUpdated.emit(this.checked.toString());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
