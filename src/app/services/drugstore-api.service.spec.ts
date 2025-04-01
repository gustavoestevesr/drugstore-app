import { TestBed } from '@angular/core/testing';

import { DrugstoreApiService } from './drugstore-api.service';

describe('DrugstoreApiService', () => {
  let service: DrugstoreApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugstoreApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
