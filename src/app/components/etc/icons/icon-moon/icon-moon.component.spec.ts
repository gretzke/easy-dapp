import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMoonComponent } from './icon-moon.component';

describe('IconMoonComponent', () => {
  let component: IconMoonComponent;
  let fixture: ComponentFixture<IconMoonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconMoonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconMoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
