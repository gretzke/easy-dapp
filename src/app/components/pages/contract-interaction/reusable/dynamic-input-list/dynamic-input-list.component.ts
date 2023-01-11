import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-input-list',
  templateUrl: './dynamic-input-list.component.html',
  styleUrls: ['./dynamic-input-list.component.scss'],
})
export class DynamicInputListComponent implements OnInit, OnDestroy {
  @ViewChildren('inputRef') inputRefs = new QueryList<ElementRef>();
  @Input() items: string[] = [];
  @Output() listChanged = new EventEmitter<string[]>();
  faTrash = faTrash;
  form: FormGroup;
  length = 0;
  private subscription: Subscription;

  constructor() {
    this.form = new FormGroup({
      items: new FormArray([]),
      appendItem: new FormControl(''),
    });
    this.subscription = this.form.controls.appendItem.valueChanges.subscribe((value) => {
      if (value) {
        const fa = this.form.controls.items as FormArray;
        const newControl = new FormControl(value);
        fa.push(newControl);
        this.form.controls.appendItem.setValue('');
        setTimeout(() => {
          this.inputRefs.last.nativeElement.focus();
        });
      }
    });
  }

  ngOnInit(): void {
    for (const item of this.items) {
      (this.form.controls.items as FormArray).push(new FormControl(item));
    }
    this.subscription.add(
      this.form.controls.items.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe(() => {
        this.update();
      })
    );
  }

  formItems(): FormControl<any>[] {
    return (this.form.controls.items as FormArray).controls as FormControl<any>[];
  }

  removeAt(index: number): void {
    (this.form.controls.items as FormArray).removeAt(index);
  }

  update(): void {
    const values = (this.form.controls.items.value as string[]).filter((v) => v);
    this.listChanged.emit(values);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
