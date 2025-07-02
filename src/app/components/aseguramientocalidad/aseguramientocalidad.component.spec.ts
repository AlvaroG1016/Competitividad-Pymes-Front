import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AseguramientocalidadComponent } from './aseguramientocalidad.component';

describe('AseguramientocalidadComponent', () => {
  let component: AseguramientocalidadComponent;
  let fixture: ComponentFixture<AseguramientocalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AseguramientocalidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AseguramientocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
