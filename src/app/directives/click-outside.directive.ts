import { Directive, ElementRef, EventEmitter, HostListener, Output, OnInit, ViewChild } from '@angular/core';
import { fromEvent, take } from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  private captured = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => (this.captured = true));
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    if (!this.captured) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
