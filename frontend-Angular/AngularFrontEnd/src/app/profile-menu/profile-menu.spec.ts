import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileMenuComponent } from './profile-menu';

describe('PerfilComponent', () => {
  let component: ProfileMenuComponent;
  let fixture: ComponentFixture<ProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el título "Perfil"', () => {
    // Verifica que la vista (HTML) contenga el título esperado.
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Perfil');
  });

  // Prueba de que la función de cierre de sesión es invocada correctamente (HU 3.5)
  it('debería llamar a cerrarSesion cuando se pulsa el botón', () => {
    spyOn(component, 'cerrarSesion');
    const compiled = fixture.nativeElement;
    const cerrarSesionBtn = compiled.querySelectorAll('.opcion-btn')[1]; // Segundo botón
    cerrarSesionBtn.click();
    expect(component.cerrarSesion).toHaveBeenCalled();
  });

  // Se agregarían más pruebas aquí para validar que se cumplan los Criterios de Aceptación.
});