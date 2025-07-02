import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionempresarialComponent } from './gestionempresarial.component';

describe('GestionempresarialComponent', () => {
  let component: GestionempresarialComponent;
  let fixture: ComponentFixture<GestionempresarialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionempresarialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionempresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
