import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseenrollComponent } from './houseenroll.component';

describe('HouseenrollComponent', () => {
  let component: HouseenrollComponent;
  let fixture: ComponentFixture<HouseenrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseenrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseenrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
