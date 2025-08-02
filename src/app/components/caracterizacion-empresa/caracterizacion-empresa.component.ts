import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonsLibService } from '../../services/commons-lib.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressLockService } from '../../services/progress-lock.service'; // AGREGAR ESTA LÍNEA

@Component({
  selector: 'app-caracterizacion-empresa',
  standalone: false,
  templateUrl: './caracterizacion-empresa.component.html',
  styleUrl: './caracterizacion-empresa.component.css',
})
export class CaracterizacionEmpresaComponent implements OnInit {
  surveyForm: FormGroup;
  esCaracterizado: boolean = false;
  isSubmitting: boolean = false;
  showSuccessIndicator: boolean = false;
  dataCaracterizacion: any = null;
  isLoading: boolean = true;
  private successTimeout: any;

  clasificacionOptions = [
    { label: 'Microempresa', value: 'micro' },
    { label: 'Pequeña empresa', value: 'small' },
    { label: 'Mediana empresa', value: 'medium' },
    { label: 'Gran empresa', value: 'large' },
  ];

  constructor(
    private fb: FormBuilder,
    private commonsService: CommonsLibService,
    private readonly dialog: MatDialog,
    private progressService: ProgressLockService // AGREGAR ESTA LÍNEA
  ) {}

  async ngOnInit() {
    this.initializeForm();
    await this.loadExistingData();
  }

  private async loadExistingData(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('🔄 Cargando datos de caracterización existente...');
      
      await this.validateCaracterizacionEmpresa();
      
      if (this.esCaracterizado && this.dataCaracterizacion) {
        this.loadDataToForm();
        console.log('✅ Datos cargados al formulario');
      } else {
        console.log('📝 No hay caracterización previa, formulario en blanco');
      }
      
      this.isLoading = false;
      
    } catch (error) {
      console.error('💥 Error al cargar datos existentes:', error);
      this.isLoading = false;
    }
  }

  private loadDataToForm(): void {
    if (!this.dataCaracterizacion) return;

    console.log('📋 Cargando datos al formulario:', this.dataCaracterizacion);

    this.surveyForm.patchValue({
      name: this.dataCaracterizacion.nombreEmpresa || '',
      location: this.dataCaracterizacion.ciudad || '',
      address: this.dataCaracterizacion.direccion || '',
      institutionalEmail: this.dataCaracterizacion.correo || '',
      presencia: this.dataCaracterizacion.tiempoMercado || '',
      clasificacion: this.dataCaracterizacion.clasificacionEmpresa || '',
      telefono: this.dataCaracterizacion.telefono || ''
    });

    this.surveyForm.markAsPristine();
    console.log('✅ Formulario cargado con datos existentes');
  }

  private initializeForm(): void {
    this.surveyForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\.\-\_0-9]+$/),
        ],
      ],
      presencia: [
        '',
        [
          Validators.required,
          Validators.minLength(1)
        ],
      ],
      clasificacion: ['', Validators.required],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9+\-\s\(\)]+$/)
      ]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      address: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
      institutionalEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
    });

    this.surveyForm.valueChanges.subscribe(() => {
      this.validateForm();
      this.handleFormCompletion();
    });
  }

  private async validateCaracterizacionEmpresa(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.commonsService.getWithHandling(
        'CaracterizacionEmpresa/GetCaracterizacionEmpresaByIdEmpresa',
        (response: any) => {
          console.log('📥 Respuesta de validación:', response);
          
          if (response?.ok && response?.data && response.data.length > 0) {
            const data = response.data[0];
            this.esCaracterizado = data.caracterizado || false;
            this.dataCaracterizacion = data;
            
            console.log(`✅ Caracterización ${this.esCaracterizado ? 'EXISTE' : 'NO EXISTE'}`);
            
            if (this.esCaracterizado) {
              console.log('📋 Datos encontrados:', this.dataCaracterizacion);
            }
          } else {
            this.esCaracterizado = false;
            this.dataCaracterizacion = null;
            console.log('⚠️ Respuesta sin datos válidos');
          }
          
          resolve();
        },
        (validationErrors) => {
          console.warn('⚠️ Errores de validación al consultar caracterización:', validationErrors);
          this.esCaracterizado = false;
          this.dataCaracterizacion = null;
          resolve();
        },
        (errors) => {
          console.error('💥 Error al consultar caracterización:', errors);
          this.esCaracterizado = false;
          this.dataCaracterizacion = null;
          resolve();
        }
      );
    });
  }

  private handleFormCompletion(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }

    if (this.surveyForm.valid) {
      this.showSuccessIndicator = true;
      this.successTimeout = setTimeout(() => {
        this.showSuccessIndicator = false;
      }, 3000);
    } else {
      this.showSuccessIndicator = false;
    }
  }

  private validateForm(): void {
    Object.keys(this.surveyForm.controls).forEach((key) => {
      const control = this.surveyForm.get(key);
      if (control && control.invalid && control.touched) {
        control.markAsTouched();
      }
    });
  }

  getFormProgress(): number {
    const totalFields = Object.keys(this.surveyForm.controls).length;
    let validFields = 0;

    Object.keys(this.surveyForm.controls).forEach((key) => {
      const control = this.surveyForm.get(key);
      if (
        control &&
        control.valid &&
        control.value &&
        control.value.toString().trim() !== ''
      ) {
        validFields++;
      }
    });

    return Math.round((validFields / totalFields) * 100);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.surveyForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.surveyForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'El nombre de la empresa es requerido';
        if (errors['minlength']) return 'El nombre debe tener al menos 3 caracteres';
        if (errors['pattern']) return 'El nombre contiene caracteres no válidos';
        break;

      case 'telefono':
        if (errors['required']) return 'El teléfono es requerido';
        if (errors['pattern']) return 'Formato de teléfono no válido';
        break;

      case 'location':
        if (errors['required']) return 'La ciudad es requerida';
        if (errors['minlength']) return 'La ciudad debe tener al menos 2 caracteres';
        break;

      case 'address':
        if (errors['required']) return 'La dirección es requerida';
        if (errors['minlength']) return 'La dirección debe tener al menos 5 caracteres';
        break;

      case 'presencia':
        if (errors['required']) return 'El tiempo de presencia es requerido';
        break;

      case 'clasificacion':
        if (errors['required']) return 'Debe seleccionar la clasificación';
        break;

      case 'institutionalEmail':
        if (errors['required']) return 'El correo institucional es requerido';
        if (errors['email'] || errors['pattern']) return 'Ingrese un correo electrónico válido';
        break;
    }

    return 'Campo inválido';
  }

  async onSubmit(): Promise<void> {
    if (this.surveyForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      var data = this.prepareFormData();
      console.log('📤 Enviando datos:', data);
      
      if (this.esCaracterizado) {
        console.log('🔄 Actualizando caracterización existente...');
      } else {
        console.log('➕ Creando nueva caracterización...');
        await this.createCaracterizacion(data);
      }

      this.showSuccessMessage();
      
      // SOLO AGREGAR ESTAS DOS LÍNEAS:
      console.log('🔄 Actualizando progreso del menú...');
      this.progressService.completeStep('configuration', 'company-characterization', 100);
      
      await this.loadExistingData();
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.showErrorMessage();
    } finally {
      this.isSubmitting = false;
    }
  }

  private async createCaracterizacion(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.commonsService.postWithHandling(
        'CaracterizacionEmpresa/CrearCaracterizacionEmpresa',
        data,
        (response: any) => {
          console.log('✅ Caracterización creada exitosamente');
          resolve(response);
        },
        (validationErrors) => {
          console.error('❌ Errores de validación:', validationErrors);
          this.showErrorMessage();
          reject(validationErrors);
        },
        (errors) => {
          console.error('💥 Error al crear:', errors);
          this.showErrorMessage();
          reject(errors);
        }
      );
    });
  }

  private prepareFormData(): any {
    const formValue = this.surveyForm.value;

    return {
      nombreEmpresa: formValue.name,
      ciudad: formValue.location,
      direccion: formValue.address,
      correo: formValue.institutionalEmail,
      tiempoMercado: formValue.presencia,
      clasificacionEmpresa: formValue.clasificacion,
      telefono: formValue.telefono,
    };
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.surveyForm.controls).forEach((key) => {
      const control = this.surveyForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private showSuccessMessage(): void {
    const mensaje = this.esCaracterizado ? 
      'Caracterización actualizada exitosamente' : 
      'Caracterización creada exitosamente';
      
    this.commonsService.openResultModal(
      this.dialog,
      true,
      null,
      null,
      true,
      false,
      mensaje
    );
  }

  private showErrorMessage(): void {
    this.commonsService.openResultModal(
      this.dialog,
      false,
      [`Error al procesar la caracterización. Intente nuevamente.`],
      null,
      true
    );
  }

  getSubmitButtonText(): string {
    if (this.isSubmitting) {
      return this.esCaracterizado ? 'Actualizando...' : 'Guardando...';
    }

    if (this.surveyForm.valid) {
      return this.esCaracterizado ? 'Actualizar Caracterización' : 'Guardar Caracterización';
    }

    return `Complete todos los campos (${this.getFormProgress()}%)`;
  }

  getFormTitle(): string {
    if (this.isLoading) {
      return 'Cargando...';
    }
    return this.esCaracterizado ? 
      'Editar Caracterización de Empresa' : 
      'Caracterización de Empresa';
  }

  shouldShowLoader(): boolean {
    return this.isLoading;
  }

  onFieldChange(fieldName: string): void {
    const field = this.surveyForm.get(fieldName);

    if (field && field.valid && field.touched) {
      console.log(`Campo ${fieldName} válido:`, field.value);
    }
  }

  clearFieldError(fieldName: string): void {
    const field = this.surveyForm.get(fieldName);
    if (field) {
      field.markAsUntouched();
    }
  }
}