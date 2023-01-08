import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInputListComponent } from './dynamic-input-list.component';

describe('DynamicInputListComponent', () => {
  let component: DynamicInputListComponent;
  let fixture: ComponentFixture<DynamicInputListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicInputListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicInputListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
