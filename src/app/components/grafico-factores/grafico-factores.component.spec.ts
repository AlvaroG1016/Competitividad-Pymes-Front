import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoFactoresComponent } from './grafico-factores.component';

describe('GraficoFactoresComponent', () => {
  let component: GraficoFactoresComponent;
  let fixture: ComponentFixture<GraficoFactoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoFactoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoFactoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
