import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-caracterizacion-usuario',
  standalone: false,
  templateUrl: './caracterizacion-usuario.component.html',
  styleUrl: './caracterizacion-usuario.component.css'
})
export class CaracterizacionUsuarioComponent implements OnInit {
  surveyForm: FormGroup;
  isSubmitting: boolean = false;
  showSuccessIndicator: boolean = false;
  private successTimeout: any;

  genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no especificar', value: 'not_specified' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.surveyForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
      ]],
      age: ['', [
        Validators.required, 
        Validators.min(18), 
        Validators.max(100)
      ]],
      gender: ['', Validators.required],
      position: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      seniority: ['', [
        Validators.required, 
        Validators.min(0),
        Validators.max(50)
      ]],
      institutionalEmail: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });

    // Suscribirse a cambios del formulario para validaciones en tiempo real
    this.surveyForm.valueChanges.subscribe(() => {
      this.validateForm();
      this.handleFormCompletion();
    });
  }

  /**
   * Maneja la lógica cuando el formulario se completa
   */
  private handleFormCompletion(): void {
    // Limpiar timeout anterior si existe
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }

    // Si el formulario es válido, mostrar mensaje temporal
    if (this.surveyForm.valid) {
      this.showSuccessIndicator = true;
      
      // Ocultar el mensaje después de 3 segundos
      this.successTimeout = setTimeout(() => {
        this.showSuccessIndicator = false;
      }, 3000);
    } else {
      this.showSuccessIndicator = false;
    }
  }

  private validateForm(): void {
    // Validaciones personalizadas adicionales si es necesario
    Object.keys(this.surveyForm.controls).forEach(key => {
      const control = this.surveyForm.get(key);
      if (control && control.invalid && control.touched) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Calcula el progreso del formulario basado en campos válidos
   * @returns Porcentaje de progreso (0-100)
   */
  getFormProgress(): number {
    const totalFields = Object.keys(this.surveyForm.controls).length;
    let validFields = 0;

    Object.keys(this.surveyForm.controls).forEach(key => {
      const control = this.surveyForm.get(key);
      if (control && control.valid && control.value && control.value.toString().trim() !== '') {
        validFields++;
      }
    });

    return Math.round((validFields / totalFields) * 100);
  }

  /**
   * Verifica si un campo específico tiene errores
   * @param fieldName Nombre del campo
   * @returns boolean
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.surveyForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error específico para un campo
   * @param fieldName Nombre del campo
   * @returns string con el mensaje de error
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.surveyForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    
    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'El nombre es requerido';
        if (errors['minlength']) return 'El nombre debe tener al menos 3 caracteres';
        if (errors['pattern']) return 'El nombre solo puede contener letras y espacios';
        break;
      
      case 'age':
        if (errors['required']) return 'La edad es requerida';
        if (errors['min']) return 'La edad mínima es 18 años';
        if (errors['max']) return 'La edad máxima es 100 años';
        break;
      
      case 'gender':
        if (errors['required']) return 'Debe seleccionar un género';
        break;
      
      case 'position':
        if (errors['required']) return 'El cargo es requerido';
        if (errors['minlength']) return 'El cargo debe tener al menos 2 caracteres';
        break;
      
      case 'seniority':
        if (errors['required']) return 'El tiempo de antigüedad es requerido';
        if (errors['min']) return 'La antigüedad no puede ser negativa';
        if (errors['max']) return 'La antigüedad máxima es 50 años';
        break;
      
      case 'institutionalEmail':
        if (errors['required']) return 'El correo institucional es requerido';
        if (errors['email'] || errors['pattern']) return 'Ingrese un correo electrónico válido';
        break;
    }
    
    return 'Campo inválido';
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    if (this.surveyForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // Simular procesamiento del formulario
      await this.processFormSubmission();
      
      console.log('Datos del formulario:', this.surveyForm.value);
      
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      // Por ejemplo: await this.userService.submitCharacterization(this.surveyForm.value);
      
      this.showSuccessMessage();
      this.resetForm();
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.showErrorMessage();
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.surveyForm.controls).forEach(key => {
      const control = this.surveyForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Simula el procesamiento del formulario
   */
  private processFormSubmission(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // Simula 2 segundos de procesamiento
    });
  }

  /**
   * Muestra mensaje de éxito (puedes implementar con toast, modal, etc.)
   */
  private showSuccessMessage(): void {
    // Implementar notificación de éxito
    console.log('¡Formulario enviado exitosamente!');
    // Ejemplo con PrimeNG Toast:
    // this.messageService.add({
    //   severity: 'success', 
    //   summary: 'Éxito', 
    //   detail: 'Caracterización enviada correctamente'
    // });
  }

  /**
   * Muestra mensaje de error
   */
  private showErrorMessage(): void {
    // Implementar notificación de error
    console.error('Error al enviar el formulario');
    // Ejemplo con PrimeNG Toast:
    // this.messageService.add({
    //   severity: 'error', 
    //   summary: 'Error', 
    //   detail: 'Error al enviar la caracterización. Intente nuevamente.'
    // });
  }

  /**
   * Resetea el formulario después del envío exitoso
   */
  private resetForm(): void {
    this.surveyForm.reset();
    this.showSuccessIndicator = false;
    
    // Limpiar timeout si existe
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    
    // Marcar todos los campos como no tocados
    Object.keys(this.surveyForm.controls).forEach(key => {
      const control = this.surveyForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  /**
   * Verifica si el formulario está listo para enviar
   */
  isFormReadyToSubmit(): boolean {
    return this.surveyForm.valid && !this.isSubmitting;
  }

  /**
   * Obtiene el texto del botón según el estado del formulario
   */
  getSubmitButtonText(): string {
    if (this.isSubmitting) {
      return 'Enviando...';
    }
    
    if (this.surveyForm.valid) {
      return 'Enviar Encuesta';
    }
    
    return `Complete todos los campos (${this.getFormProgress()}%)`;
  }

  /**
   * Maneja cambios en campos específicos para validaciones personalizadas
   */
  onFieldChange(fieldName: string): void {
    const field = this.surveyForm.get(fieldName);
    
    if (field && field.valid && field.touched) {
      // Implementar lógica adicional si es necesario
      console.log(`Campo ${fieldName} válido:`, field.value);
    }
  }

  /**
   * Limpia errores de un campo específico
   */
  clearFieldError(fieldName: string): void {
    const field = this.surveyForm.get(fieldName);
    if (field) {
      field.markAsUntouched();
    }
  }
}