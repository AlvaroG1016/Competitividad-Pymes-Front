import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaPreguntasComponent } from './tarjeta-preguntas.component';

describe('TarjetaPreguntasComponent', () => {
  let component: TarjetaPreguntasComponent;
  let fixture: ComponentFixture<TarjetaPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarjetaPreguntasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
