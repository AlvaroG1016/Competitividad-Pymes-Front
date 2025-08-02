import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracterizacionEmpresaComponent } from './caracterizacion-empresa.component';

describe('CaracterizacionEmpresaComponent', () => {
  let component: CaracterizacionEmpresaComponent;
  let fixture: ComponentFixture<CaracterizacionEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaracterizacionEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaracterizacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
