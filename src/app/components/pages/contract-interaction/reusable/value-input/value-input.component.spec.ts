import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueInputComponent } from './value-input.component';

describe('ValueInputComponent', () => {
  let component: ValueInputComponent;
  let fixture: ComponentFixture<ValueInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValueInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
