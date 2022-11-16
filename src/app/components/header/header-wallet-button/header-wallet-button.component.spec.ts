import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWalletButtonComponent } from './header-wallet-button.component';

describe('HeaderWalletButtonComponent', () => {
  let component: HeaderWalletButtonComponent;
  let fixture: ComponentFixture<HeaderWalletButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderWalletButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderWalletButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
