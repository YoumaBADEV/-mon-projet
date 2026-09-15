import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRecoltes } from './mes-recoltes';

describe('MesRecoltes', () => {
  let component: MesRecoltes;
  let fixture: ComponentFixture<MesRecoltes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesRecoltes],
    }).compileComponents();

    fixture = TestBed.createComponent(MesRecoltes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
