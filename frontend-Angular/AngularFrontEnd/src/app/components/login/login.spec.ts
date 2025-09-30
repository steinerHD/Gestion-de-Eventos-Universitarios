import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to signin menu', () => {
    expect(component.selectedMenu).toBe('signin');
  });

  it('should switch to signup when selectedMenu changes', () => {
    component.selectedMenu = 'signup';
    fixture.detectChanges();
    expect(component.selectedMenu).toBe('signup');
  });

  it('should call onSignIn()', () => {
    spyOn(component, 'onSignIn');
    component.onSignIn();
    expect(component.onSignIn).toHaveBeenCalled();
  });

  it('should call onSignUp()', () => {
    spyOn(component, 'onSignUp');
    component.onSignUp();
    expect(component.onSignUp).toHaveBeenCalled();
  });
});
