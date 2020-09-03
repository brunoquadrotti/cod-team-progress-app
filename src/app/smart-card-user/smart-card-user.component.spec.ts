import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCardUserComponent } from './smart-card-user.component';

describe('SmartCardUserComponent', () => {
  let component: SmartCardUserComponent;
  let fixture: ComponentFixture<SmartCardUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartCardUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
