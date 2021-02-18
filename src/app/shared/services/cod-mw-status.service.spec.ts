import { TestBed } from '@angular/core/testing';

import { CodMwStatusService } from './cod-mw-status.service';

describe('CodMwStatusService', () => {
  let service: CodMwStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodMwStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
