import { TestBed } from '@angular/core/testing';

import { Omdb } from './omdb';

describe('Omdb', () => {
  let service: Omdb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Omdb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
