import { TestBed } from '@angular/core/testing';

import { HistoriquePrix } from './historique-prix';

describe('HistoriquePrix', () => {
  let service: HistoriquePrix;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriquePrix);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
