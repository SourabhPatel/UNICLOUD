import { TestBed, inject } from '@angular/core/testing';

import { DropboxService } from './dropbox.service';

describe('DropboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropboxService]
    });
  });

  it('should be created', inject([DropboxService], (service: DropboxService) => {
    expect(service).toBeTruthy();
  }));
});
