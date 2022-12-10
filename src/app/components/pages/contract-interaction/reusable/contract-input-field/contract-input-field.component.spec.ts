import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractInputFieldComponent } from './contract-input-field.component';

describe('ContractInputFieldComponent', () => {
  let component: ContractInputFieldComponent;
  let fixture: ComponentFixture<ContractInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractInputFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
