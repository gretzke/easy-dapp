import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteFieldComponent } from './write-field.component';

describe('WriteFieldComponent', () => {
  let component: WriteFieldComponent;
  let fixture: ComponentFixture<WriteFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
