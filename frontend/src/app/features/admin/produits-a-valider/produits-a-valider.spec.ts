import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsAValider } from './produits-a-valider';

describe('ProduitsAValider', () => {
  let component: ProduitsAValider;
  let fixture: ComponentFixture<ProduitsAValider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsAValider],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitsAValider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
