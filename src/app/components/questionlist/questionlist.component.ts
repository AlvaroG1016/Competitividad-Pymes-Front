import { Component, Input } from '@angular/core';
import { CommonsLibService } from '../../services/commons-lib.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-questionlist',
  standalone: false,
  templateUrl: './questionlist.component.html',
  styleUrl: './questionlist.component.css'
})
export class QuestionlistComponent {
options = [
  { label: 'No existe', value: 0 },
  { label: 'Acción escrita', value: 25 },
  { label: 'Inicio pruebas', value: 50 },
  { label: 'En implementación', value: 75 },
  { label: 'Implementado con éxito', value: 100 }
];  buttonNextText = 'Siguiente';
  @Input() factores;
  
  constructor(private readonly service : CommonsLibService, private readonly dialog:MatDialog) {}
  pasoActual = 0;
  respuestas: { [key: string]: string } = {}; // Objeto para almacenar respuestas

  siguiente() {
  if (this.pasoActual < this.factores.length - 1) {
    this.pasoActual++;
    this.buttonNextText = this.pasoActual === this.factores.length - 1 ? 'Finalizar' : 'Siguiente';
  } else if (this.pasoActual === this.factores.length - 1) {
    // Aquí va la lógica de finalización
    this.finalizar();
  }
}

finalizar() {
   console.log('Formulario finalizado. Respuestas:', this.respuestas);

 const payload = Object.entries(this.respuestas).map(([idPregunta, valorRespuesta]) => ({
  idEncuesta: 5,
  idPregunta,
  valorRespuesta
}));

console.log(payload);


/*   this.http.post('https://tu-api.com/api/respuestas/guardar', payload)
    .subscribe({
      next: (res) => console.log('Guardado exitosamente'),
      error: (err) => console.error('Error al guardar', err)
    }); */
    this.service.postWithHandling(
      "Respuesta/ActualizarRespuestas",
      payload,
      (res) => {
        //this.hideSpinner(); 
       console.log(res);
        this.service.openResultModal(this.dialog, true, null, null, true, false, "Respuestas guardadas correctamente");

      },
      (validationErrors) => {
        //this.hideSpinner(); 
        this.service.openResultModal(this.dialog, false, validationErrors, null, true);
      },
      (generalErrors) => {
        //this.hideSpinner(); 
        this.service.openResultModal(this.dialog, false, null, generalErrors, true);
      },
      (error) => {
        //this.hideSpinner(); 
        this.service.openResultModal(this.dialog, false, null, error);
      }
    );
}

  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
    this.buttonNextText = this.pasoActual === this.factores.length - 1 ? 'Finalizar' : 'Siguiente';

  }

onOptionSelected(preguntaId: string, value: any) {
  this.respuestas[preguntaId] = value;
  console.log(this.respuestas); // Para depuración
}

Math = Math;

  // Método para contar respuestas del paso actual
  getAnsweredCount(): number {
    if (!this.factores[this.pasoActual]) return 0;
    
    return this.factores[this.pasoActual].preguntas.filter(
      pregunta => this.respuestas[pregunta.id] && this.respuestas[pregunta.id] !== ''
    ).length;
  }

  // Método para verificar si todas las preguntas del paso actual están respondidas
  isCurrentStepComplete(): boolean {
    if (!this.factores[this.pasoActual]) return false;
    
    return this.factores[this.pasoActual].preguntas.every(
      pregunta => this.respuestas[pregunta.id] && this.respuestas[pregunta.id] !== ''
    );
  }

  // Método para obtener el porcentaje de progreso total
  getTotalProgress(): number {
    const totalQuestions = this.factores.reduce((total, factor) => total + factor.preguntas.length, 0);
    const answeredQuestions = Object.keys(this.respuestas).filter(key => this.respuestas[key] !== '').length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  // Método para obtener el progreso del paso actual
  getCurrentStepProgress(): number {
    if (!this.factores[this.pasoActual]) return 0;
    
    const totalQuestions = this.factores[this.pasoActual].preguntas.length;
    const answeredQuestions = this.getAnsweredCount();
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }
  // Método para obtener el total de respuestas en todo el cuestionario
  getTotalAnsweredCount(): number {
    return Object.keys(this.respuestas).filter(key => 
      this.respuestas[key] && this.respuestas[key] !== ''
    ).length;
  }
   getTotalQuestions(): number {
    if (!this.factores || this.factores.length === 0) return 0;
    
    return this.factores.reduce((total, factor) => {
      return total + (factor.preguntas ? factor.preguntas.length : 0);
    }, 0);
  }
}
