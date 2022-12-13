import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputConfigBarComponent } from './input-config-bar.component';

describe('InputConfigBarComponent', () => {
  let component: InputConfigBarComponent;
  let fixture: ComponentFixture<InputConfigBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputConfigBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputConfigBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
