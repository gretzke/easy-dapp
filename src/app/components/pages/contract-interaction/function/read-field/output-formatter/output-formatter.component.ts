import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OutputsConfig, ValidDataType, VariableType } from 'src/types/abi';
import { enumSelector } from '../../../store/contract.selector';

type OutputType = 'default' | 'enum' | 'timestamp' | 'decimal';

@Component({
  selector: 'app-output-formatter',
  templateUrl: './output-formatter.component.html',
  styleUrls: ['./output-formatter.component.scss'],
})
export class OutputFormatterComponent implements OnInit, OnDestroy {
  @Input() type!: VariableType;
  @Input() value: ValidDataType = '';
  @Input() config?: OutputsConfig;
  public outputType: OutputType = 'default';
  private enumConfig: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    if (this.type.internalType.substring(0, 5) === 'enum ') {
      this.subscription.add(
        this.store.select(enumSelector(this.type.internalType.slice(5))).subscribe((enumConfig) => {
          this.outputType = enumConfig.length > 0 ? 'enum' : 'default';
          this.enumConfig = enumConfig;
        })
      );
    }
  }

  get name(): string {
    switch (this.outputType) {
      case 'enum':
        return this.type.internalType.slice(5);
      default:
        return this.type.name;
    }
  }

  get formattedValue() {
    switch (this.outputType) {
      case 'enum':
        const index = this.value as number;
        return index >= this.enumConfig.length ? index : this.enumConfig[index];
      case 'timestamp':
        return new Date((this.value as number) * 1000).toLocaleString();
      default:
        return this.value;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
