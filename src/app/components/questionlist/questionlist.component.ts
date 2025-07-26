import { Component, Input } from '@angular/core';
import { CommonsLibService } from '../../services/commons-lib.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-questionlist',
  standalone: false,
  templateUrl: './questionlist.component.html',
  styleUrl: './questionlist.component.css',
})
export class QuestionlistComponent {
  // SOLO CAMBIO: Valores corregidos con escalas de 25
  options = [
    { label: 'No existe', value: 0 },
    { label: 'Acción escrita', value: 25 },
    { label: 'Inicio pruebas', value: 50 },
    { label: 'En implementación', value: 75 },
    { label: 'Implementado con éxito', value: 100 },
  ];
  
  buttonNextText = 'Siguiente';
  @Input() factores;

  constructor(
    private readonly service: CommonsLibService,
    private readonly dialog: MatDialog
  ) {}
  
  pasoActual = 0;
  respuestas: { [key: string]: string } = {};
  showInstructions = false; // Controla si se muestran las instrucciones

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  siguiente() {
    if (this.pasoActual < this.factores.length - 1) {
      this.pasoActual++;
      this.buttonNextText =
        this.pasoActual === this.factores.length - 1
          ? 'Finalizar'
          : 'Siguiente';
    } else if (this.pasoActual === this.factores.length - 1) {
      this.finalizar();
    }
  }

  finalizar() {
    // Validación estricta: TODAS las preguntas deben estar respondidas
    if (!this.isAllQuestionsAnswered()) {
      const preguntasSinResponder = this.getTotalQuestions() - this.getTotalAnsweredCount();
      this.service.openResultModal(
        this.dialog,
        false,
        [`Debes responder todas las preguntas antes de finalizar. Faltan ${preguntasSinResponder} preguntas por responder.`],
        null,
        true
      );
      return;
    }

    console.log('Formulario finalizado. Respuestas:', this.respuestas);

    // SOLO CAMBIO: Validar valores con escalas de 25
    const valoresPermitidos = [0, 25, 50, 75, 100];
    const payload = Object.entries(this.respuestas)
      .filter(([_, valor]) => valor !== '' && valor !== null && valor !== undefined)
      .map(([idPregunta, valorRespuesta]) => {
        const valorNumerico = parseInt(valorRespuesta);
        
        if (!valoresPermitidos.includes(valorNumerico)) {
          throw new Error(`Valor no válido: ${valorRespuesta} para pregunta ${idPregunta}`);
        }

        return {
          idEncuesta: 5,
          idPregunta,
          valorRespuesta,
        };
      });

    console.log('Payload a enviar:', payload);

    this.service.postWithHandling(
      'Respuesta/ActualizarRespuestas',
      payload,
      (res) => {
        console.log('Respuesta del servidor:', res);
        this.service.openResultModal(
          this.dialog,
          true,
          null,
          null,
          true,
          false,
          'Respuestas guardadas correctamente'
        );
      },
      (validationErrors) => {
        this.service.openResultModal(
          this.dialog,
          false,
          validationErrors,
          null,
          true
        );
      },
      (generalErrors) => {
        this.service.openResultModal(
          this.dialog,
          false,
          null,
          generalErrors,
          true
        );
      },
      (error) => {
        console.error('Error completo:', error);
        this.service.openResultModal(this.dialog, false, null, error);
      }
    );
  }

  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
    this.buttonNextText =
      this.pasoActual === this.factores.length - 1 ? 'Finalizar' : 'Siguiente';
  }

  onOptionSelected(preguntaId: string, value: any) {
    this.respuestas[preguntaId] = value.toString();
    console.log(this.respuestas);
  }

  Math = Math;

  // Método para contar respuestas del paso actual
  getAnsweredCount(): number {
    if (!this.factores[this.pasoActual]) return 0;

    return this.factores[this.pasoActual].preguntas.filter(
      (pregunta) =>
        this.respuestas[pregunta.id] !== undefined &&
        this.respuestas[pregunta.id] !== null &&
        this.respuestas[pregunta.id] !== ''
    ).length;
  }

  // Método para verificar si todas las preguntas del paso actual están respondidas
  isCurrentStepComplete(): boolean {
    if (!this.factores[this.pasoActual]) return false;

    return this.factores[this.pasoActual].preguntas.every(
      (pregunta) =>
        this.respuestas[pregunta.id] !== undefined &&
        this.respuestas[pregunta.id] !== null &&
        this.respuestas[pregunta.id] !== ''
    );
  }

  // NUEVO: Método para verificar si TODAS las preguntas del cuestionario están respondidas
  isAllQuestionsAnswered(): boolean {
    if (!this.factores || this.factores.length === 0) return false;
    
    // Obtener todos los IDs de preguntas del cuestionario
    const todasLasPreguntas = this.factores.flatMap(factor => 
      factor.preguntas ? factor.preguntas.map(p => p.id) : []
    );
    
    // Verificar que cada pregunta tenga una respuesta válida
    return todasLasPreguntas.every(preguntaId => 
      this.respuestas[preguntaId] !== undefined &&
      this.respuestas[preguntaId] !== null &&
      this.respuestas[preguntaId] !== ''
    );
  }

  // Método para obtener el porcentaje de progreso total
  getTotalProgress(): number {
    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = this.getTotalAnsweredCount();
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }

  // Método para obtener el progreso del paso actual
  getCurrentStepProgress(): number {
    if (!this.factores[this.pasoActual]) return 0;

    const totalQuestions = this.factores[this.pasoActual].preguntas.length;
    const answeredQuestions = this.getAnsweredCount();
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }

  // Método para obtener el total de respuestas en todo el cuestionario
  getTotalAnsweredCount(): number {
    return Object.keys(this.respuestas).filter(
      (key) =>
        this.respuestas[key] !== undefined &&
        this.respuestas[key] !== null &&
        this.respuestas[key] !== ''
    ).length;
  }

  getTotalQuestions(): number {
    if (!this.factores || this.factores.length === 0) return 0;

    return this.factores.reduce((total, factor) => {
      return total + (factor.preguntas ? factor.preguntas.length : 0);
    }, 0);
  }
}