import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizacionExternaComponent } from './organizacion-externa';
import { By } from '@angular/platform-browser';

describe('OrganizacionExternaComponent', () => {
  let component: OrganizacionExternaComponent;
  let fixture: ComponentFixture<OrganizacionExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizacionExternaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizacionExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const titleElement = fixture.debugElement.query(By.css('.org-title')).nativeElement;
    expect(titleElement.textContent).toContain('Organizaciones');
  });

  it('should add a new organization when addOrganizacion is called', () => {
    const initialCount = component.organizaciones().length;
    component.addOrganizacion('Nueva Org', '555555');
    expect(component.organizaciones().length).toBe(initialCount + 1);
    expect(component.organizaciones()[initialCount].nombre).toBe('Nueva Org');
  });
});
