import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UintInputConfigBarComponent } from './uint-input-config-bar.component';

describe('InputConfigBarComponent', () => {
  let component: UintInputConfigBarComponent;
  let fixture: ComponentFixture<UintInputConfigBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UintInputConfigBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UintInputConfigBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
