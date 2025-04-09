import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-caracterizacion-usuario',
  standalone: false,
  templateUrl: './caracterizacion-usuario.component.html',
  styleUrl: './caracterizacion-usuario.component.css'
})
export class CaracterizacionUsuarioComponent {
  surveyForm: FormGroup;

  genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.surveyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      gender: ['', Validators.required],
      position: ['', Validators.required],
      seniority: ['', [Validators.required, Validators.min(0)]],
      institutionalEmail: ['', [Validators.required, Validators.email]],
      personalEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      console.log(this.surveyForm.value);
      // Aquí puedes agregar la lógica para enviar el formulario
    }
  }
  
}
