import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumConfigComponent } from './enum-config.component';

describe('EnumConfigComponent', () => {
  let component: EnumConfigComponent;
  let fixture: ComponentFixture<EnumConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnumConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnumConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
