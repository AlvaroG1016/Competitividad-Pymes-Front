import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service.ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoginMode = true; 
  submitted = false;
  loading = false;
  showPassword: boolean = false;
  activeIndex: number = -1; 
  isEmpresaInfoSection: boolean = false; 

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToNextStep(): void {

    if (
      this.registerForm.get('Nombre')?.valid &&
      this.registerForm.get('Sector')?.valid &&
      this.registerForm.get('Clasificacion')?.valid &&
      this.registerForm.get('Estado')?.valid
    ) {
      this.activeIndex = 1; 
      this.isEmpresaInfoSection = false; 
    } else {
      this.registerForm.get('Nombre')?.markAsTouched();
      this.registerForm.get('Sector')?.markAsTouched();
      this.registerForm.get('Clasificacion')?.markAsTouched();
      this.registerForm.get('Estado')?.markAsTouched();
    }
  }
  
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  items = [
    { label: 'Información de la Empresa' },
    { label: 'Datos del Usuario' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const API_TOKEN = localStorage.getItem(environment.localStoragetoken);
    if (API_TOKEN) {
      this.authService.logout();
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      hasErrorPassword: new FormControl(false),
      hasErrorInvalid: new FormControl(false),
    });

    this.registerForm = this.fb.group({
      Nombre: ['', Validators.required],
      Sector: ['', Validators.required],
      Clasificacion: ['', Validators.required],
      Estado: ['', Validators.required],
      CorreoUsuario: ['', [Validators.required, Validators.email]],
      PasswordUsuario: ['', Validators.required],
    });
  }

  // Cambiar el índice del paso activo
  onActiveIndexChange(index: number): void {
    this.activeIndex = index;
    this.isEmpresaInfoSection = index === 0; 
  }

  // Alternar al formulario de inicio de sesión
  switchToLogin(): void {
    this.isLoginMode = true;
    this.activeIndex = -1; 
    this.isEmpresaInfoSection = false; 
  }

  // Alternar al formulario de registro y establecer el índice inicial
  switchToRegister(): void {
    this.isLoginMode = false;
    this.activeIndex = 0; 
    this.isEmpresaInfoSection = true; 
  }

  // Manejar el envío del formulario de inicio de sesión
  async onLogin() {
    this.submitted = true;
    this.loading = true;

    const formData = this.loginForm.value;
    try {
      const res = await this.authService.login(formData.username, formData.password);
      if (res.ok) {
        this.loading = false;
        this.authService.setAuthentication(true);
        this.router.navigateByUrl(`/home`);
      }
    } catch (error: any) {
      this.loading = false;
      this.clearLoginErrors();
      this.handleLoginErrors(error.error.message);
    }
  }

  // Manejar el envío del formulario de registro
  async onRegister() {
    this.submitted = true;
    this.loading = true;

    const formData = this.registerForm.value;
    try {
      const res = await this.authService.register(formData);
      if (res.ok) {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Empresa creada exitosamente',
          detail: 'Ya puede iniciar sesión con los datos registrados',
        });
        this.switchToLogin();
        this.registerForm.reset();
      }
    } catch (error: any) {
      this.loading = false;
      this.clearLoginErrors();
      this.handleLoginErrors(error.error.message);
    }
  }

  // Accesores para facilitar el acceso a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.registerForm.controls;
  }

  private clearLoginErrors() {
    this.loginForm.get('hasErrorUserName')?.setValue(false);
    this.loginForm.get('hasErrorPassword')?.setValue(false);
    this.loginForm.get('hasErrorInvalid')?.setValue(false);
    this.loginForm.get('hasErrorCompany')?.setValue(false);
  }

  private handleLoginErrors(errorMessage: string) {
    const errorMapping = {
      'Correo o contraseña incorrectos': {
        errorKey: 'hasErrorPassword',
        controlKey: 'password',
      },
      'Usuario se encuentra inactivo': {
        errorKey: 'hasErrorInvalid',
        controlKey: 'username',
      },
      'Empresa no cuenta con la ultima versión, por favor comuniquese con el administrador': {
        errorKey: 'hasErrorCompany',
        controlKey: 'IdEmpresa',
      },
    };

    for (const [key, { errorKey, controlKey }] of Object.entries(errorMapping)) {
      if (errorMessage.includes(key)) {
        this.loginForm.get(errorKey)?.setValue(true);
        this.loginForm.get(controlKey)?.markAsTouched();
        break;
      }
    }
  }
}