import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnologiasisComponent } from './tecnologiasis.component';

describe('TecnologiasisComponent', () => {
  let component: TecnologiasisComponent;
  let fixture: ComponentFixture<TecnologiasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TecnologiasisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnologiasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
