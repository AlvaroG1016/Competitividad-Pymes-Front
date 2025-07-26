import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonsLibService } from './commons-lib.service';

export interface ProgressStep {
  id: string;
  name: string;
  routeLink: string;
  icon?: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  completionPercentage?: number;
  requiredSteps?: string[];
}

export interface ProgressFlow {
  flowId: string;
  name: string;
  steps: ProgressStep[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressLockService {
  private progressFlows: Map<string, ProgressFlow> = new Map();
  private progressSubject = new BehaviorSubject<Map<string, ProgressFlow>>(new Map());
  
  public progress$ = this.progressSubject.asObservable();

  constructor(private commonsService: CommonsLibService) {
    this.initializeFactorsFlow();
  }

  // Inicializar el flujo de factores (TODOS BLOQUEADOS EXCEPTO EL PRIMERO)
  private initializeFactorsFlow() {
    const factorsFlow: ProgressFlow = {
      flowId: 'factors',
      name: 'Evaluación de Factores',
      steps: [
        {
          id: 'factor1',
          name: 'Gestión Empresarial',
          routeLink: 'gestionempresarial',
          icon: 'pi pi-briefcase',
          isCompleted: false,
          isUnlocked: true, // Solo el primero desbloqueado
          completionPercentage: 0
        },
        {
          id: 'factor2',
          name: 'Operación y Gestión del Servicio',
          routeLink: 'opgestionservicio',
          icon: 'pi pi-chart-bar',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor1']
        },
        {
          id: 'factor3',
          name: 'Aseguramiento de la Calidad',
          routeLink: 'aseguramientocalidad',
          icon: 'pi pi-check-circle',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor2']
        },
        {
          id: 'factor4',
          name: 'Gestión de Mercadeo y Comercialización',
          routeLink: 'mercadeocomercializacion',
          icon: 'pi pi-wallet',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor3']
        },
        {
          id: 'factor5',
          name: 'Estrategia y Gestión Financiera',
          routeLink: 'estrategiagestionf',
          icon: 'pi pi-money-bill',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor4']
        },
        {
          id: 'factor6',
          name: 'Gestión de Recursos Humanos',
          routeLink: 'grecursoshumanos',
          icon: 'pi pi-id-card',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor5']
        },
        {
          id: 'factor7',
          name: 'Gestión Ambiental',
          routeLink: 'gambiental',
          icon: 'pi pi-cloud',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor6']
        },
        {
          id: 'factor8',
          name: 'Tecnología y Sistemas de Información',
          routeLink: 'tsis',
          icon: 'pi pi-desktop',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO
          completionPercentage: 0,
          requiredSteps: ['factor7']
        }
      ]
    };

    this.progressFlows.set('factors', factorsFlow);
    this.progressSubject.next(this.progressFlows);
  }

  // Cargar progreso desde el backend
  async loadProgressFromBackend(encuestaId: number) {
    try {
      console.log('🔄 Cargando progreso desde backend para encuesta:', encuestaId);
      
      this.commonsService.getByIdWithHandling(
        'Respuesta/ObtenerResultadosEncuesta',
        encuestaId,
        (response: any) => {
          console.log('📥 Respuesta completa del backend:', response);
          
          // Intentar extraer los datos de diferentes estructuras posibles
          let resultadosData = this.extractResultadosData(response);
          
          if (resultadosData && resultadosData.resultadosPorFactor && resultadosData.resultadosPorFactor.length > 0) {
            console.log('✅ Encontrados factores en el backend:', resultadosData.resultadosPorFactor);
            this.updateProgressFromBackendData(resultadosData);
          } else {
            console.log('⚠️ No hay factores completados, manteniendo estado inicial');
            this.ensureOnlyFirstFactorUnlocked();
          }
        },
        (validationErrors) => {
          console.log('❌ No se encontraron resultados previos, iniciando desde cero');
          console.log('Validation errors:', validationErrors);
          this.ensureOnlyFirstFactorUnlocked();
        },
        (errors) => {
          console.warn('💥 Error al cargar progreso:', errors);
          this.ensureOnlyFirstFactorUnlocked();
        }
      );
    } catch (error) {
      console.warn('💥 Error al cargar progreso desde backend:', error);
      this.ensureOnlyFirstFactorUnlocked();
    }
  }

  // Método mejorado para extraer datos de la respuesta
  private extractResultadosData(response: any): any {
    console.log('🔍 Analizando estructura de respuesta:', response);
    
    // Tu estructura específica: response.data[0] donde data es array
    if (response?.ok && response?.data && Array.isArray(response.data) && response.data.length > 0) {
      const firstDataItem = response.data[0];
      if (firstDataItem?.resultadosPorFactor && Array.isArray(firstDataItem.resultadosPorFactor)) {
        console.log('📍 Datos encontrados en response.data[0] - Estructura confirmada');
        return firstDataItem;
      }
    }
    
    // Fallback: response.data[0].resultadosPorFactor
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      const firstDataItem = response.data[0];
      if (firstDataItem?.resultadosPorFactor) {
        console.log('📍 Datos encontrados en response.data[0]');
        return firstDataItem;
      }
    }
    
    // Caso 2: response.resultadosPorFactor directamente
    if (response?.resultadosPorFactor) {
      console.log('📍 Datos encontrados directamente en response');
      return response;
    }
    
    // Caso 3: response.data.resultadosPorFactor (sin ser array)
    if (response?.data?.resultadosPorFactor) {
      console.log('📍 Datos encontrados en response.data');
      return response.data;
    }
    
    console.log('❌ No se encontraron resultadosPorFactor en ninguna estructura');
    return null;
  }

  // Asegurar que solo el primer factor esté desbloqueado
  private ensureOnlyFirstFactorUnlocked() {
    const factorsFlow = this.progressFlows.get('factors');
    if (!factorsFlow) return;

    console.log('🔒 Asegurando que solo factor1 esté desbloqueado');

    factorsFlow.steps.forEach((step, index) => {
      step.isUnlocked = index === 0; // Solo el primero
      step.isCompleted = false;
      step.completionPercentage = 0;
    });

    this.progressFlows.set('factors', factorsFlow);
    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
    
    console.log('✅ Estado inicial aplicado');
  }

  // Actualizar progreso basado en datos del backend
  private updateProgressFromBackendData(backendData: any) {
    const factorsFlow = this.progressFlows.get('factors');
    if (!factorsFlow) return;

    console.log('🔄 Actualizando progreso con datos del backend:', backendData);

    // MAPEO TEMPORAL PARA DEBUG - Necesitas verificar estos IDs en tu BD
    // Basado en tu respuesta actual:
    // idFactor: 3 = "GE" (¿debería ser factor1?)
    // idFactor: 4 = "OGS" (¿debería ser factor2?)
    
    // Vamos a intentar mapear por nombre del factor en lugar de ID
    const factorNameToStepId: { [key: string]: string } = {
      'GE': 'factor1',           // Gestión Empresarial
      'OGS': 'factor2',          // Operación y Gestión del Servicio
      'AC': 'factor3',           // Aseguramiento de la Calidad
      'GMC': 'factor4',          // Gestión de Mercadeo y Comercialización
      'EGF': 'factor5',          // Estrategia y Gestión Financiera
      'GRH': 'factor6',          // Gestión de Recursos Humanos
      'GA': 'factor7',           // Gestión Ambiental
      'TSI': 'factor8'           // Tecnología y Sistemas de Información
    };

    // También mantener mapeo por ID como fallback
    const factorIdToStepId: { [key: number]: string } = {
      3: 'factor1', // GE - Gestión Empresarial (VERIFICA ESTE MAPEO)
      4: 'factor2', // OGS - Operación y Gestión del Servicio
      5: 'factor3', // Aseguramiento de la Calidad
      6: 'factor4', // Gestión de Mercadeo y Comercialización
      7: 'factor5', // Estrategia y Gestión Financiera
      8: 'factor6', // Gestión de Recursos Humanos
      9: 'factor7', // Gestión Ambiental
      10: 'factor8' // Tecnología y Sistemas de Información
    };

    // Primero resetear todos a estado inicial (solo primero desbloqueado)
    factorsFlow.steps.forEach((step, index) => {
      step.isUnlocked = index === 0;
      step.isCompleted = false;
      step.completionPercentage = 0;
    });

    // Actualizar con datos del backend
    // IMPORTANTE: Si un factor aparece en resultadosPorFactor, significa que está COMPLETADO (100%)
    // El campo porcentajeFactor es la CALIFICACIÓN obtenida, no el progreso de completado
    if (backendData.resultadosPorFactor && Array.isArray(backendData.resultadosPorFactor)) {
      console.log('📊 Procesando factores completados:', backendData.resultadosPorFactor);
      
      backendData.resultadosPorFactor.forEach((factor: any) => {
        console.log('🔄 Procesando factor completado:', factor);
        
        // Intentar mapear por nombre primero
        const factorName = factor.nombreFactor?.trim();
        let stepId = factorNameToStepId[factorName];
        
        // Si no funciona por nombre, usar ID
        if (!stepId) {
          stepId = factorIdToStepId[factor.idFactor];
        }
        
        const factorStep = factorsFlow.steps.find(s => s.id === stepId);
        
        if (factorStep) {
          // Si el factor aparece en la respuesta, significa que está COMPLETADO al 100%
          // El porcentajeFactor es la CALIFICACIÓN obtenida, no el progreso de completado
          factorStep.completionPercentage = 100; // SIEMPRE 100% si está en la respuesta
          factorStep.isCompleted = true; // SIEMPRE completado si está en la respuesta
          
          console.log(`✅ Factor ${stepId}: COMPLETADO (100%) - Calificación obtenida: ${factor.porcentajeFactor.toFixed(1)}%`);
          console.log(`📋 Detalles: idFactor=${factor.idFactor}, nombre="${factorName}"`);
        } else {
          console.warn(`❌ No se encontró step para factor:`);
          console.warn(`   - ID: ${factor.idFactor}`);
          console.warn(`   - Nombre: "${factorName}"`);
          console.warn(`   - StepId intentado: ${stepId}`);
          console.warn(`📋 Mapeos disponibles por nombre:`, factorNameToStepId);
          console.warn(`📋 Mapeos disponibles por ID:`, factorIdToStepId);
        }
      });
    } else {
      console.warn('❌ resultadosPorFactor no es un array válido');
    }

    // Desbloquear secuencialmente después de actualizar todos los porcentajes
    this.unlockFactorsSequentially(factorsFlow);

    this.progressFlows.set('factors', factorsFlow);
    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
    
    console.log('✅ Progreso actualizado completamente');
  }

  // Asegurar que el porcentaje sea un número válido (para uso futuro si es necesario)
  private ensureValidPercentage(value: any): number {
    if (value === null || value === undefined) return 0;
    
    const numValue = Number(value);
    if (isNaN(numValue)) return 0;
    
    return Math.max(0, Math.min(100, Math.round(numValue)));
  }

  // Desbloquear factores secuencialmente
  private unlockFactorsSequentially(flow: ProgressFlow) {
    console.log('🔓 Desbloqueando factores secuencialmente...');
    
    for (let i = 0; i < flow.steps.length; i++) {
      const currentStep = flow.steps[i];
      
      if (i === 0) {
        // El primer factor siempre está desbloqueado
        currentStep.isUnlocked = true;
        console.log(`✅ ${currentStep.id}: Siempre desbloqueado (primer factor)`);
      } else {
        // Los siguientes factores se desbloquean si el anterior está completado
        const previousStep = flow.steps[i - 1];
        currentStep.isUnlocked = previousStep.isCompleted;
        
        console.log(`${currentStep.isUnlocked ? '🔓' : '🔒'} ${currentStep.id}: Desbloqueado = ${currentStep.isUnlocked} (${previousStep.id} completado: ${previousStep.isCompleted})`);
      }
    }
    
    // Log del estado final
    const unlockedCount = flow.steps.filter(s => s.isUnlocked).length;
    const completedCount = flow.steps.filter(s => s.isCompleted).length;
    console.log(`📊 Estado final: ${completedCount} completados, ${unlockedCount} desbloqueados de ${flow.steps.length} total`);
  }

  // Marcar un paso como completado
  completeStep(flowId: string, stepId: string, completionPercentage: number = 100) {
    const flow = this.progressFlows.get(flowId);
    if (!flow) return;

    const step = flow.steps.find(s => s.id === stepId);
    if (!step) return;

    console.log(`🎯 Completando step ${stepId} al ${completionPercentage}%`);

    step.isCompleted = completionPercentage >= 100;
    step.completionPercentage = completionPercentage;

    // Desbloquear secuencialmente
    this.unlockFactorsSequentially(flow);

    this.progressFlows.set(flowId, flow);
    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
  }

  // Método para debuggear el estado actual
  debugCurrentState() {
    const factorsFlow = this.progressFlows.get('factors');
    if (!factorsFlow) return;

    console.log('🐛 DEBUG - Estado actual de factores:');
    factorsFlow.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.id} (${step.name}):`, {
        isUnlocked: step.isUnlocked,
        isCompleted: step.isCompleted,
        percentage: step.completionPercentage,
        routeLink: step.routeLink
      });
    });
  }

  // Métodos de consulta
  getFlow(flowId: string): ProgressFlow | undefined {
    return this.progressFlows.get(flowId);
  }

  getStep(flowId: string, stepId: string): ProgressStep | undefined {
    const flow = this.progressFlows.get(flowId);
    return flow?.steps.find(s => s.id === stepId);
  }

  isStepUnlocked(flowId: string, stepId: string): boolean {
    const step = this.getStep(flowId, stepId);
    return step?.isUnlocked || false;
  }

  isStepCompleted(flowId: string, stepId: string): boolean {
    const step = this.getStep(flowId, stepId);
    return step?.isCompleted || false;
  }

  // Persistencia
  private saveProgress() {
    const progressData = Array.from(this.progressFlows.entries());
    localStorage.setItem('appProgress', JSON.stringify(progressData));
  }

  loadProgressFromStorage() {
    try {
      const saved = localStorage.getItem('appProgress');
      if (saved) {
        const progressData = JSON.parse(saved);
        this.progressFlows = new Map(progressData);
        this.progressSubject.next(this.progressFlows);
      }
    } catch (error) {
      console.warn('Error al cargar progreso desde storage:', error);
    }
  }
}