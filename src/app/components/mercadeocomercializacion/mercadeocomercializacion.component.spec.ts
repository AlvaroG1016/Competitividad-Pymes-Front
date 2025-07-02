import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MercadeocomercializacionComponent } from './mercadeocomercializacion.component';

describe('MercadeocomercializacionComponent', () => {
  let component: MercadeocomercializacionComponent;
  let fixture: ComponentFixture<MercadeocomercializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MercadeocomercializacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MercadeocomercializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
