import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSearchComponent } from './icon-search.component';

describe('IconSearchComponent', () => {
  let component: IconSearchComponent;
  let fixture: ComponentFixture<IconSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
