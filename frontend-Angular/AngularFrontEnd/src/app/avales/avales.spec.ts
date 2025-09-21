import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avales } from './avales';

describe('Avales', () => {
  let component: Avales;
  let fixture: ComponentFixture<Avales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
