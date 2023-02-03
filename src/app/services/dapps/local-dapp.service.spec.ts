import { TestBed } from '@angular/core/testing';

import { LocalDappService } from './local-dapp.service';

describe('LocalDappService', () => {
  let service: LocalDappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
