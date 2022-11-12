import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSunComponent } from './icon-sun.component';

describe('IconSunComponent', () => {
  let component: IconSunComponent;
  let fixture: ComponentFixture<IconSunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSunComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
