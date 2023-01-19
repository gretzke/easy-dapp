import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructInputComponent } from './struct-input.component';

describe('StructInputComponent', () => {
  let component: StructInputComponent;
  let fixture: ComponentFixture<StructInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
