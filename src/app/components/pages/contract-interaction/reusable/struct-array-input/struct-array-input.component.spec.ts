import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructArrayInputComponent } from './struct-array-input.component';

describe('StructArrayInputComponent', () => {
  let component: StructArrayInputComponent;
  let fixture: ComponentFixture<StructArrayInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructArrayInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructArrayInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
