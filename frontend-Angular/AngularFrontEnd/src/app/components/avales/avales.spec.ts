import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvalesComponent } from './avales';

describe('Avales', () => {
  let component: AvalesComponent;
  let fixture: ComponentFixture<AvalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});