import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrecursoshumanosComponent } from './grecursoshumanos.component';

describe('GrecursoshumanosComponent', () => {
  let component: GrecursoshumanosComponent;
  let fixture: ComponentFixture<GrecursoshumanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrecursoshumanosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrecursoshumanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
