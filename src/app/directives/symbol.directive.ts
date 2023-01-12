import { Directive, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { chainIdSelector } from '../store/app.selector';
import { nativeCurrency } from '../../helpers/chainConfig';

@Directive({
  selector: '[appSymbol]',
})
export class SymbolDirective {
  private symbol: string = '';

  constructor(private el: ElementRef, private store: Store<{}>) {
    this.store.select(chainIdSelector).subscribe((chainId) => {
      this.symbol = nativeCurrency[chainId].symbol;
      this.el.nativeElement.innerHTML = this.symbol;
    });
  }

  ngOnInit() {}
}
