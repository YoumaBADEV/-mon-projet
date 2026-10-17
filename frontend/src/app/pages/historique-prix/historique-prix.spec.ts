import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePrix } from './historique-prix';

describe('HistoriquePrix', () => {
  let component: HistoriquePrix;
  let fixture: ComponentFixture<HistoriquePrix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriquePrix],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriquePrix);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
