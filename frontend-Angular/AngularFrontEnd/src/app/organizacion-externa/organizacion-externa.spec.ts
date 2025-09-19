import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacionExterna } from './organizacion-externa';

describe('OrganizacionExterna', () => {
  let component: OrganizacionExterna;
  let fixture: ComponentFixture<OrganizacionExterna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizacionExterna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizacionExterna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
