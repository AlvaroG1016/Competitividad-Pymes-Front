import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracterizacionUsuarioComponent } from './caracterizacion-usuario.component';

describe('CaracterizacionUsuarioComponent', () => {
  let component: CaracterizacionUsuarioComponent;
  let fixture: ComponentFixture<CaracterizacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaracterizacionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaracterizacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
