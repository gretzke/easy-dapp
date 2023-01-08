import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumInputComponent } from './enum-input.component';

describe('EnumInputComponent', () => {
  let component: EnumInputComponent;
  let fixture: ComponentFixture<EnumInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnumInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnumInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
