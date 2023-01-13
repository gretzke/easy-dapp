import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressOutputConfigBarComponent } from './address-output-config-bar.component';

describe('AddressInputConfigBarComponent', () => {
  let component: AddressOutputConfigBarComponent;
  let fixture: ComponentFixture<AddressOutputConfigBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressOutputConfigBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressOutputConfigBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
