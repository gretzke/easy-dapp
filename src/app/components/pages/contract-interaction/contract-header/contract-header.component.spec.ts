import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractHeaderComponent } from './contract-header.component';

describe('ContractHeaderComponent', () => {
  let component: ContractHeaderComponent;
  let fixture: ComponentFixture<ContractHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
