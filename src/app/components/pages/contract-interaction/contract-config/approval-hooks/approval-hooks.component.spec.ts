import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalHooksComponent } from './approval-hooks.component';

describe('ApprovalHooksComponent', () => {
  let component: ApprovalHooksComponent;
  let fixture: ComponentFixture<ApprovalHooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalHooksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalHooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
