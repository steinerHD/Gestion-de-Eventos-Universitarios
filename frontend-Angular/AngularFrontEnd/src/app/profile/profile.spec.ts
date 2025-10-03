import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have user data in JSON format', () => {
    expect(component.userData).toBeTruthy();
    expect(component.userData.nombre).toBe('Pepito Alberto Diaz Castillo');
    expect(component.userData.tipoUsuario).toBe('Estudiante');
    expect(component.userData.email).toBe('Pepito@U.edu.co');
  });
});
