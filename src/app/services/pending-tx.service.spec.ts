import { TestBed } from '@angular/core/testing';

import { PendingTxService } from './pending-tx.service';

describe('PendingTxService', () => {
  let service: PendingTxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingTxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
