import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTxComponent } from './pending-tx.component';

describe('PendingTxComponent', () => {
  let component: PendingTxComponent;
  let fixture: ComponentFixture<PendingTxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingTxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
