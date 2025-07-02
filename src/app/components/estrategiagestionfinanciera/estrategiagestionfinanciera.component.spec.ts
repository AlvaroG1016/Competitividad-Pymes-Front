import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrategiagestionfinancieraComponent } from './estrategiagestionfinanciera.component';

describe('EstrategiagestionfinancieraComponent', () => {
  let component: EstrategiagestionfinancieraComponent;
  let fixture: ComponentFixture<EstrategiagestionfinancieraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstrategiagestionfinancieraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstrategiagestionfinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
