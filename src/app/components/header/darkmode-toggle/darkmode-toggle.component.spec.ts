import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkmodeToggleComponent } from './darkmode-toggle.component';

describe('DarkmodeToggleComponent', () => {
  let component: DarkmodeToggleComponent;
  let fixture: ComponentFixture<DarkmodeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarkmodeToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkmodeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
