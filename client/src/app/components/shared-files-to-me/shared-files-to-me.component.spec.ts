import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFilesToMeComponent } from './shared-files-to-me.component';

describe('SharedFilesToMeComponent', () => {
  let component: SharedFilesToMeComponent;
  let fixture: ComponentFixture<SharedFilesToMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedFilesToMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFilesToMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
