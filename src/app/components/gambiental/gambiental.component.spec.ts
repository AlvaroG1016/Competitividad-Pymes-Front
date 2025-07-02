import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GambientalComponent } from './gambiental.component';

describe('GambientalComponent', () => {
  let component: GambientalComponent;
  let fixture: ComponentFixture<GambientalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GambientalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GambientalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
