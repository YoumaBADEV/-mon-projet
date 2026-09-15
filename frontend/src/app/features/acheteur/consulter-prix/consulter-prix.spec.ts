import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterPrix } from './consulter-prix';

describe('ConsulterPrix', () => {
  let component: ConsulterPrix;
  let fixture: ComponentFixture<ConsulterPrix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulterPrix],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsulterPrix);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
