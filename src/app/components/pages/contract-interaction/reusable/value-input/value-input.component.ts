import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { InputsConfig, InternalType } from 'src/types/abi';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { walletSelector } from 'src/app/store/app.selector';
import { notify } from 'src/app/store/app.actions';

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
  public walletAddress = '';
  public checked = false;
  public form!: FormGroup;
  private subscription = new Subscription();
  faWallet = faWallet;

  constructor(private store: Store<{}>) {}

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
    if (this.isAddress()) {
      this.subscription.add(
        this.store.select(walletSelector).subscribe((wallet) => {
          this.walletAddress = wallet?.address ?? '';
        })
      );
    }
  }

  toggleChecked(): void {
    this.checked = !this.checked;
    this.valueUpdated.emit(this.checked.toString());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isAddress(): boolean {
    return this.type === 'address' || this.type === 'address payable';
  }

  fillAddress(): void {
    if (!this.walletAddress) {
      this.store.dispatch(
        notify({
          src: ValueInputComponent.name,
          message: 'Please connect your wallet to fill in your wallet address',
          notificationType: 'info',
        })
      );
      return;
    }
    this.form.controls.value.setValue(this.walletAddress);
  }
}
