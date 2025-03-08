import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoginMode = true; // Controla si se muestra el formulario de inicio de sesión o registro
  submitted = false;
  loading = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      Nombre: ['', Validators.required],
      Sector: ['', Validators.required],
      CorreoUsuario: ['', [Validators.required, Validators.email]],
      PasswordUsuario: ['', Validators.required],
      Clasificacion: ['', Validators.required],
      Estado: ['', Validators.required],
    });
  }

  // Alternar al formulario de inicio de sesión
  switchToLogin(): void {
    this.isLoginMode = true;
  }

  // Alternar al formulario de registro
  switchToRegister(): void {
    this.isLoginMode = false;
  }

  // Manejar el envío del formulario de inicio de sesión
  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos',
      });
      return;
    }

    this.loading = true;
    console.log('Datos de inicio de sesión:', this.loginForm.value);
    // Aquí puedes agregar la lógica para autenticar al usuario
  }

  // Manejar el envío del formulario de registro
  onRegister(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Datos de registro:', this.registerForm.value);
    // Aquí puedes agregar la lógica para registrar al usuario
  }

  // Accesores para facilitar el acceso a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.registerForm.controls;
  }
}
