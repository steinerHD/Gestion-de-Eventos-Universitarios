import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizacionExternaComponent } from './organizacion-externa';
import { By } from '@angular/platform-browser';
import { OrganizationService, ExternalOrganization } from '../../services/organization.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('OrganizacionExternaComponent', () => {
  let component: OrganizacionExternaComponent;
  let fixture: ComponentFixture<OrganizacionExternaComponent>;
  let organizationServiceSpy: jasmine.SpyObj<OrganizationService>;

  const mockOrganizations: ExternalOrganization[] = [
    { id: 1, name: 'Org A', contact: '111' },
    { id: 2, name: 'Org B', contact: '222' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OrganizationService', ['getOrganizations', 'searchOrganizations']);

    await TestBed.configureTestingModule({
      imports: [
        OrganizacionExternaComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: OrganizationService, useValue: spy }
      ]
    }).compileComponents();

    organizationServiceSpy = TestBed.inject(OrganizationService) as jasmine.SpyObj<OrganizationService>;
    organizationServiceSpy.getOrganizations.and.returnValue(of(mockOrganizations));
    organizationServiceSpy.searchOrganizations.and.returnValue(of([mockOrganizations[0]]));

    fixture = TestBed.createComponent(OrganizacionExternaComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load organizations on init', () => {
    fixture.detectChanges(); // ngOnInit is called here
    expect(organizationServiceSpy.getOrganizations).toHaveBeenCalled();
    expect(component.organizations.length).toBe(2);
    expect(component.filteredOrganizations.length).toBe(2);
    expect(component.organizations[0].name).toBe('Org A');
  });

  it('should filter organizations when searching', () => {
    fixture.detectChanges();
    component.searchQuery = 'Org A';
    component.searchOrganizations();
    expect(organizationServiceSpy.searchOrganizations).toHaveBeenCalledWith('Org A');
    expect(component.filteredOrganizations.length).toBe(1);
    expect(component.filteredOrganizations[0].name).toBe('Org A');
  });

  it('should select an organization and emit an event', () => {
    spyOn(component.organizationSelected, 'emit');
    fixture.detectChanges();

    const orgToSelect = mockOrganizations[0];
    component.selectOrganization(orgToSelect);

    expect(component.selectedOrganizations.length).toBe(1);
    expect(component.selectedOrganizations[0]).toBe(orgToSelect);
    expect(component.organizationSelected.emit).toHaveBeenCalledWith(orgToSelect);
  });

  it('should not select an organization if it is already selected', () => {
    fixture.detectChanges();
    component.selectedOrganizations = [mockOrganizations[0]];
    component.selectOrganization(mockOrganizations[0]);
    expect(component.selectedOrganizations.length).toBe(1);
  });
});
