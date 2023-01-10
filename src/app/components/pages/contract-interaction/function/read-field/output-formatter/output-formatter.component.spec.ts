import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputFormatterComponent } from './output-formatter.component';

describe('OutputFormatterComponent', () => {
  let component: OutputFormatterComponent;
  let fixture: ComponentFixture<OutputFormatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputFormatterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
