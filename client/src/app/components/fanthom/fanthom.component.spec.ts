import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanthomComponent } from './fanthom.component';

describe('FanthomComponent', () => {
  let component: FanthomComponent;
  let fixture: ComponentFixture<FanthomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanthomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanthomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
