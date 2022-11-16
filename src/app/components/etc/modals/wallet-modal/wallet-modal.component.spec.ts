import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletModalComponent } from './wallet-modal.component';

describe('WalletModalComponent', () => {
  let component: WalletModalComponent;
  let fixture: ComponentFixture<WalletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
