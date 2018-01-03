import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcloudComponent } from './addcloud.component';

describe('AddcloudComponent', () => {
  let component: AddcloudComponent;
  let fixture: ComponentFixture<AddcloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
