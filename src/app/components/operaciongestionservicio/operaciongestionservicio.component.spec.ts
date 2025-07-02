import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperaciongestionservicioComponent } from './operaciongestionservicio.component';

describe('OperaciongestionservicioComponent', () => {
  let component: OperaciongestionservicioComponent;
  let fixture: ComponentFixture<OperaciongestionservicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperaciongestionservicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperaciongestionservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
