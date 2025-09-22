import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacionExternaComponent } from './organizacion-externa';


describe('OrganizacionExternaComponent', () => {
  let component: OrganizacionExternaComponent;
  let fixture: ComponentFixture<OrganizacionExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizacionExternaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizacionExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});