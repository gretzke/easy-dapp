import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DappListItemComponent } from './dapp-list-item.component';

describe('DappListItemComponent', () => {
  let component: DappListItemComponent;
  let fixture: ComponentFixture<DappListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DappListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DappListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
