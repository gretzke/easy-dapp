import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DappListComponent } from './dapp-list.component';

describe('DappListComponent', () => {
  let component: DappListComponent;
  let fixture: ComponentFixture<DappListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DappListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DappListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
