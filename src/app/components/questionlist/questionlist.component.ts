import { Component, Input, OnInit } from '@angular/core';
import { CommonsLibService } from '../../services/commons-lib.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProgressLockService } from '../../services/progress-lock.service';

@Component({
  selector: 'app-questionlist',
  standalone: false,
  templateUrl: './questionlist.component.html',
  styleUrl: './questionlist.component.css',
})
export class QuestionlistComponent implements OnInit {
  // Valores corregidos: escalas de 25 (0, 25, 50, 75, 100)
  options = [
    { label: 'No existe', value: 0 },
    { label: 'Acción escrita', value: 25 },
    { label: 'Inicio pruebas', value: 50 },
    { label: 'En implementación', value: 75 },
    { label: 'Implementado con éxito', value: 100 },
  ];
  
  buttonNextText = 'Siguiente';
  @Input() factores;

  // Variables para manejar el progreso
  currentFactorId: string = '';
  currentRoute: string = '';
  currentFactorIdBD: number = 0; // ID del factor en la BD
  encuestaId: number 
  
  // Estados de carga
  isLoadingResponses = false;
  responsesLoaded = false;

  constructor(
    private readonly service: CommonsLibService,
    private readonly dialog: MatDialog,
    private route: ActivatedRoute,
    private progressService: ProgressLockService
  ) {}
  
ngOnInit() {
  this.service.getWithHandling(
    `CaracterizacionUsuario/GetIdEncuenstaByEmpresa`,
    (response: any) => {
      debugger;
      localStorage.setItem('encuestaId', response.data[0].idEncuesta);
      this.encuestaId = response.data[0].idEncuesta;
      
      // Obtener la ruta actual para determinar qué factor se está completando
      this.currentRoute = this.route.snapshot.routeConfig?.path || '';
      this.currentFactorId = this.getFactorIdFromRoute(this.currentRoute);
      this.currentFactorIdBD = this.getFactorIdBD(this.currentRoute);
      
      // Cargar respuestas existentes DESPUÉS de obtener el encuestaId
      this.loadExistingResponses();
    },
    (validationErrors) => {
      this.isLoadingResponses = false;
      this.responsesLoaded = true;
    },
    (errors) => {
      this.isLoadingResponses = false;
      this.responsesLoaded = true;
    }
  );
}
  
  pasoActual = 0;
  respuestas: { [key: string]: string } = {};
  showInstructions = false;

  // Cargar respuestas existentes del backend
  private loadExistingResponses() {
    if (!this.currentFactorIdBD || !this.encuestaId) {

      return;
    }

    this.isLoadingResponses = true;


    // Usar getByIdWithHandling con null como ID y pasar los parámetros en la URL
    this.service.getWithHandling(
      `Respuesta/ObtenerRespuestasPorFactor?encuestaId=${this.encuestaId}&factorId=${this.currentFactorIdBD}`,
      (response: any) => {

        this.processLoadedResponses(response);
        this.isLoadingResponses = false;
        this.responsesLoaded = true;
      },
      (validationErrors) => {

        this.isLoadingResponses = false;
        this.responsesLoaded = true;
      },
      (errors) => {

        this.isLoadingResponses = false;
        this.responsesLoaded = true;
      }
    );
  
  }

  // Procesar las respuestas cargadas del backend
  private processLoadedResponses(response: any) {
    if (!response || !response.data || !Array.isArray(response.data) || response.data.length === 0) {

      return;
    }

    // Limpiar respuestas existentes
    this.respuestas = {};

    // Los datos vienen en response.data[0] que es un array de respuestas
    const respuestasArray = response.data[0];
    
    if (!Array.isArray(respuestasArray)) {

      return;
    }


    
    respuestasArray.forEach((respuesta: any) => {
      if (respuesta.idPregunta && respuesta.valorRespuesta !== null && respuesta.valorRespuesta !== undefined) {
        this.respuestas[respuesta.idPregunta] = respuesta.valorRespuesta.toString();

      }
    });



    
    // Actualizar progreso parcial después de cargar
    this.updatePartialProgress();
  }

  // Mapear ruta a ID de factor en la BD
  private getFactorIdBD(route: string): number {
    const routeToFactorIdMap: { [key: string]: number } = {
      'gestionempresarial': 3,      // GE
      'opgestionservicio': 4,       // OGS  
      'aseguramientocalidad': 5,    // AC
      'mercadeocomercializacion': 6, // GMC
      'estrategiagestionf': 7,      // EGF
      'grecursoshumanos': 8,        // GRH
      'gambiental': 9,              // GA
      'tsis': 10                    // TSI
    };
    return routeToFactorIdMap[route] || 0;
  }

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



    // Validar que todos los valores sean válidos según la restricción CHECK
    const valoresPermitidos = [0, 25, 50, 75, 100];
    const payload = Object.entries(this.respuestas)
      .filter(([_, valor]) => valor !== '' && valor !== null && valor !== undefined)
      .map(([idPregunta, valorRespuesta]) => {
        const valorNumerico = parseInt(valorRespuesta);
        
        if (!valoresPermitidos.includes(valorNumerico)) {
          throw new Error(`Valor no válido: ${valorRespuesta} para pregunta ${idPregunta}`);
        }

        return {
          idEncuesta: this.encuestaId,
          idPregunta,
          valorRespuesta,
        };
      });



    this.service.postWithHandling(
      'Respuesta/ActualizarRespuestas',
      payload,
      (res: any) => {

        
        // Marcar factor como completado (100%) en el progress service
        if (this.currentFactorId) {
          this.progressService.completeStep('factors', this.currentFactorId, 100);
        }
        
        this.service.openResultModal(
          this.dialog,
          true,
          null,
          null,
          true,
          false,
          `Factor completado exitosamente`
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

        this.service.openResultModal(this.dialog, false, null, error);
      }
    );
  }

  // Mapear ruta a ID de factor para el progress service
  private getFactorIdFromRoute(route: string): string {
    const routeToFactorMap: { [key: string]: string } = {
      'gestionempresarial': 'factor1',
      'opgestionservicio': 'factor2',
      'aseguramientocalidad': 'factor3',
      'mercadeocomercializacion': 'factor4',
      'estrategiagestionf': 'factor5',
      'grecursoshumanos': 'factor6',
      'gambiental': 'factor7',
      'tsis': 'factor8'
    };
    return routeToFactorMap[route] || '';
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


    
    // Actualizar progreso parcial mientras el usuario responde
    this.updatePartialProgress();
  }

  // Actualizar progreso parcial del factor
  private updatePartialProgress() {
    if (!this.currentFactorId) return;

    const totalQuestions = this.getTotalQuestions();
    const answeredQuestions = this.getTotalAnsweredCount();
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;



    // Solo actualizar si no está completado al 100%
    if (progressPercentage < 100) {
      this.progressService.completeStep('factors', this.currentFactorId, progressPercentage);
    }
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

  // Método para verificar si TODAS las preguntas del cuestionario están respondidas
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