import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadFieldComponent } from './read-field.component';

describe('ReadFieldComponent', () => {
  let component: ReadFieldComponent;
  let fixture: ComponentFixture<ReadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
