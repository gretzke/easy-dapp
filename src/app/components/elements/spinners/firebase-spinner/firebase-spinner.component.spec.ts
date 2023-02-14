import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseSpinnerComponent } from './firebase-spinner.component';

describe('FirebaseSpinnerComponent', () => {
  let component: FirebaseSpinnerComponent;
  let fixture: ComponentFixture<FirebaseSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseSpinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirebaseSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
