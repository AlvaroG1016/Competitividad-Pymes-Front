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
  providedIn: 'root',
})
export class ProgressLockService {
  private progressFlows: Map<string, ProgressFlow> = new Map();
  private progressSubject = new BehaviorSubject<Map<string, ProgressFlow>>(
    new Map()
  );

  public progress$ = this.progressSubject.asObservable();

  constructor(private commonsService: CommonsLibService) {
    this.initializeAllFlows();
  }

  // Inicializar todos los flujos de progreso
  private initializeAllFlows() {
    this.initializeConfigurationFlow();
    this.initializeFactorsFlow();
  }

  // Inicializar el flujo de configuración (caracterizaciones)
  private initializeConfigurationFlow() {
    const configFlow: ProgressFlow = {
      flowId: 'configuration',
      name: 'Configuración',
      steps: [
        {
          id: 'company-characterization',
          name: 'Caracterización Empresa',
          routeLink: 'caracterizacionempresa',
          icon: 'pi pi-building',
          isCompleted: false,
          isUnlocked: true, // Siempre disponible como punto de entrada
          completionPercentage: 0,
        },
        {
          id: 'user-characterization',
          name: 'Caracterización Usuario',
          routeLink: 'caracterizacionusuario',
          icon: 'pi pi-user',
          isCompleted: false,
          isUnlocked: false, // Se desbloquea cuando se complete caracterización de empresa
          completionPercentage: 0,
          requiredSteps: ['company-characterization'],
        },
      ],
    };

    this.progressFlows.set('configuration', configFlow);
  }

  // Inicializar el flujo de factores (TODOS BLOQUEADOS hasta completar caracterizaciones)
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
          isUnlocked: false, // BLOQUEADO hasta completar caracterizaciones
          completionPercentage: 0,
          requiredSteps: ['company-characterization', 'user-characterization'],
        },
        {
          id: 'factor2',
          name: 'Operación y Gestión del Servicio',
          routeLink: 'opgestionservicio',
          icon: 'pi pi-chart-bar',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor1'],
        },
        {
          id: 'factor3',
          name: 'Aseguramiento de la Calidad',
          routeLink: 'aseguramientocalidad',
          icon: 'pi pi-check-circle',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor2'],
        },
        {
          id: 'factor4',
          name: 'Gestión de Mercadeo y Comercialización',
          routeLink: 'mercadeocomercializacion',
          icon: 'pi pi-wallet',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor3'],
        },
        {
          id: 'factor5',
          name: 'Estrategia y Gestión Financiera',
          routeLink: 'estrategiagestionf',
          icon: 'pi pi-money-bill',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor4'],
        },
        {
          id: 'factor6',
          name: 'Gestión de Recursos Humanos',
          routeLink: 'grecursoshumanos',
          icon: 'pi pi-id-card',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor5'],
        },
        {
          id: 'factor7',
          name: 'Gestión Ambiental',
          routeLink: 'gambiental',
          icon: 'pi pi-cloud',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor6'],
        },
        {
          id: 'factor8',
          name: 'Tecnología y Sistemas de Información',
          routeLink: 'tsis',
          icon: 'pi pi-desktop',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor7'],
        },
      ],
    };

    this.progressFlows.set('factors', factorsFlow);
    this.progressSubject.next(this.progressFlows);
  }

  // Cargar progreso completo desde el backend
async loadProgressFromBackend() {
  console.log('🔄 Iniciando carga completa de progreso...');
  
  try {
    // Cargar caracterizaciones CON AWAIT
    await this.loadCharacterizationsProgress();
    console.log('✅ Caracterizaciones cargadas');

    // Cargar progreso de factores CON AWAIT
    await this.loadFactorsProgress();
    console.log('✅ Factores cargados');

    // Aplicar lógica de desbloqueo UNA SOLA VEZ al final
    this.applyUnlockLogic();
    console.log('✅ Lógica de desbloqueo aplicada');
    
  } catch (error) {
    console.error('❌ Error cargando progreso, reseteando a estado inicial:', error);
    this.resetToInitialState();
  }
}

  // Cargar progreso de caracterizaciones
  // Cargar progreso de caracterizaciones CON PROMISES
private async loadCharacterizationsProgress(): Promise<void> {
  const promises = [
    this.loadCompanyCharacterization(),
    this.loadUserCharacterization()
  ];
  
  await Promise.all(promises);
}



// Cargar caracterización de empresa
private loadCompanyCharacterization(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.commonsService.getWithHandling(
      'Caracterizacion/VerificarCaracterizacionEmpresa',
      (response: any) => {
        console.log('📊 Respuesta caracterización empresa:', response);
        
        const configFlow = this.progressFlows.get('configuration');
        if (configFlow && response?.ok && response?.data && response.data.length > 0) {
          const caracterizacionData = response.data[0];
          const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
          
          if (companyStep) {
            companyStep.isCompleted = caracterizacionData.completed || false;
            companyStep.completionPercentage = caracterizacionData.percentage || 0;
            console.log('✅ Empresa actualizada:', {
              completed: companyStep.isCompleted,
              percentage: companyStep.completionPercentage
            });
          }
        } else {
          this.ensureCompanyCharacterizationNotCompleted();
        }
        resolve();
      },
      (validationErrors) => {
        console.warn('⚠️ Error validación empresa:', validationErrors);
        this.ensureCompanyCharacterizationNotCompleted();
        resolve(); // No rechazar, solo continuar
      },
      (errors) => {
        console.warn('⚠️ Error empresa:', errors);
        this.ensureCompanyCharacterizationNotCompleted();
        resolve(); // No rechazar, solo continuar
      }
    );
  });
}

// Cargar caracterización de usuario
private loadUserCharacterization(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.commonsService.getWithHandling(
      'Caracterizacion/VerificarCaracterizacionUsuario',
      (response: any) => {
        console.log('👤 Respuesta caracterización usuario:', response);
        
        const configFlow = this.progressFlows.get('configuration');
        if (configFlow && response?.ok && response?.data && response.data.length > 0) {
          const caracterizacionData = response.data[0];
          const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
          
          if (userStep) {
            userStep.isCompleted = caracterizacionData.completed || false;
            userStep.completionPercentage = caracterizacionData.percentage || 0;
            console.log('✅ Usuario actualizado:', {
              completed: userStep.isCompleted,
              percentage: userStep.completionPercentage
            });
          }
        } else {
          this.ensureUserCharacterizationNotCompleted();
        }
        resolve();
      },
      (validationErrors) => {
        console.warn('⚠️ Error validación usuario:', validationErrors);
        this.ensureUserCharacterizationNotCompleted();
        resolve(); // No rechazar, solo continuar
      },
      (errors) => {
        console.warn('⚠️ Error usuario:', errors);
        this.ensureUserCharacterizationNotCompleted();
        resolve(); // No rechazar, solo continuar
      }
    );
  });
}

  // Métodos auxiliares para asegurar estados no completados
// IMPORTANTE: Quitar las llamadas a applyUnlockLogic() de los métodos auxiliares
private ensureCompanyCharacterizationNotCompleted() {
  const configFlow = this.progressFlows.get('configuration');
  if (configFlow) {
    const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
    if (companyStep) {
      companyStep.isCompleted = false;
      companyStep.completionPercentage = 0;
    }
  }
  // NO llamar applyUnlockLogic() aquí
}

private ensureUserCharacterizationNotCompleted() {
  const configFlow = this.progressFlows.get('configuration');
  if (configFlow) {
    const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
    if (userStep) {
      userStep.isCompleted = false;
      userStep.completionPercentage = 0;
    }
  }
  // NO llamar applyUnlockLogic() aquí
}

  // Cargar progreso de factores (código existente adaptado)
  private async loadFactorsProgress(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar si ya tenemos el encuestaId guardado
    const savedEncuestaId = localStorage.getItem('encuestaId');
    
    if (savedEncuestaId) {
      console.log('📋 Usando encuestaId guardado:', savedEncuestaId);
      this.loadResultados(savedEncuestaId).then(resolve).catch(resolve); // No rechazar
    } else {
      console.log('🔄 Obteniendo nuevo encuestaId...');
      this.commonsService.getWithHandling(
        `CaracterizacionUsuario/GetIdEncuenstaByEmpresa`,
        (response: any) => {
          console.log('📋 Respuesta ID encuesta:', response);
          
          if (response?.data?.[0]?.idEncuesta) {
            const encuestaId = response.data[0].idEncuesta;
            localStorage.setItem('encuestaId', encuestaId);
            
            this.loadResultados(encuestaId).then(resolve).catch(resolve); // No rechazar
          } else {
            console.warn('⚠️ No se pudo obtener encuestaId');
            resolve(); // Continuar sin datos
          }
        },
        (validationErrors) => {
          console.warn('⚠️ Error validación encuestaId:', validationErrors);
          resolve(); // No rechazar, solo continuar
        },
        (errors) => {
          console.warn('⚠️ Error encuestaId:', errors);
          resolve(); // No rechazar, solo continuar
        }
      );
    }
  });
}


private loadResultados(encuestaId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🔄 Cargando resultados para encuesta:', encuestaId);
    
    this.commonsService.getByIdWithHandling(
      'Respuesta/ObtenerResultadosEncuesta',
      encuestaId,
      (response: any) => {
        console.log('✅ Resultados obtenidos:', response);
        
        let resultadosData = this.extractResultadosData(response);
        console.log('📊 Datos extraídos:', resultadosData);
        
        if (resultadosData?.resultadosPorFactor?.length > 0) {
          console.log('🔄 Actualizando factores...');
          this.updateFactorsFromBackendData(resultadosData);
          console.log('✅ Factores actualizados');
        } else {
          console.warn('⚠️ No hay datos de progreso para mostrar');
        }
        resolve();
      },
      (validationErrors) => {
        console.warn('⚠️ Error validación resultados:', validationErrors);
        resolve(); // No rechazar, solo continuar
      },
      (errors) => {
        console.warn('⚠️ Error resultados:', errors);
        resolve(); // No rechazar, solo continuar
      }
    );
  });
}

  // Aplicar lógica completa de desbloqueo
  private applyUnlockLogic() {
    const configFlow = this.progressFlows.get('configuration');
    const factorsFlow = this.progressFlows.get('factors');

    if (!configFlow || !factorsFlow) return;

    // 1. Desbloquear caracterización de usuario si empresa está completa
    const companyStep = configFlow.steps.find(
      (s) => s.id === 'company-characterization'
    );
    const userStep = configFlow.steps.find(
      (s) => s.id === 'user-characterization'
    );

    if (companyStep && userStep) {
      userStep.isUnlocked = companyStep.isCompleted;
    }

    // 2. Verificar si ambas caracterizaciones están completas
    const bothCharacterizationsCompleted =
      companyStep?.isCompleted && userStep?.isCompleted;

    // 3. Desbloquear primer factor solo si ambas caracterizaciones están completas
    const firstFactor = factorsFlow.steps[0];
    if (firstFactor) {
      firstFactor.isUnlocked = bothCharacterizationsCompleted;
    }

    // 4. Desbloquear factores secuencialmente
    this.unlockFactorsSequentially(factorsFlow);

    // 5. Actualizar subject
    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
  }

  // Resetear a estado inicial
  private resetToInitialState() {
    const configFlow = this.progressFlows.get('configuration');
    if (configFlow) {
      configFlow.steps.forEach((step, index) => {
        step.isUnlocked = index === 0; // Solo caracterización de empresa desbloqueada
        step.isCompleted = false;
        step.completionPercentage = 0;
      });
    }

    const factorsFlow = this.progressFlows.get('factors');
    if (factorsFlow) {
      factorsFlow.steps.forEach((step) => {
        step.isUnlocked = false; // TODOS los factores bloqueados
        step.isCompleted = false;
        step.completionPercentage = 0;
      });
    }

    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
  }

  // Método para extraer datos de la respuesta (código existente)
  private extractResultadosData(response: any): any {
    if (
      response?.ok &&
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      const firstDataItem = response.data[0];
      if (
        firstDataItem?.resultadosPorFactor &&
        Array.isArray(firstDataItem.resultadosPorFactor)
      ) {
        return firstDataItem;
      }
    }

    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      const firstDataItem = response.data[0];
      if (firstDataItem?.resultadosPorFactor) {
        return firstDataItem;
      }
    }

    if (response?.resultadosPorFactor) {
      return response;
    }

    if (response?.data?.resultadosPorFactor) {
      return response.data;
    }

    return null;
  }

  // Actualizar factores basado en datos del backend (código existente adaptado)
  private updateFactorsFromBackendData(backendData: any) {
  console.log('🔄 Iniciando actualización de factores con datos:', backendData);
  
  const factorsFlow = this.progressFlows.get('factors');
  if (!factorsFlow) {
    console.error('❌ No se encontró el flujo de factores');
    return;
  }

  const factorNameToStepId: { [key: string]: string } = {
    GE: 'factor1',
    OGS: 'factor2',
    AC: 'factor3',
    GMC: 'factor4',
    EGF: 'factor5',
    GRH: 'factor6',
    GA: 'factor7',
    TSI: 'factor8',
  };

  const factorIdToStepId: { [key: number]: string } = {
    3: 'factor1',
    4: 'factor2',
    5: 'factor3',
    6: 'factor4',
    7: 'factor5',
    8: 'factor6',
    9: 'factor7',
    10: 'factor8',
  };

  if (backendData.resultadosPorFactor && Array.isArray(backendData.resultadosPorFactor)) {
    console.log(`📊 Procesando ${backendData.resultadosPorFactor.length} factores...`);
    
    backendData.resultadosPorFactor.forEach((factor: any, index: number) => {
      console.log(`🔍 Procesando factor ${index + 1}:`, factor);
      
      const factorName = factor.nombreFactor?.trim();
      let stepId = factorNameToStepId[factorName];

      if (!stepId) {
        stepId = factorIdToStepId[factor.idFactor];
      }

      console.log(`🎯 Factor ${factorName} (ID: ${factor.idFactor}) -> StepID: ${stepId}`);

      const factorStep = factorsFlow.steps.find((s) => s.id === stepId);

      if (factorStep) {
        console.log(`✅ Marcando factor ${stepId} como completado`);
        factorStep.completionPercentage = 100;
        factorStep.isCompleted = true;
      } else {
        console.warn(`⚠️ No se encontró el paso para el factor: ${stepId}`);
      }
    });
    
    console.log('📊 Estado final de factores:', 
      factorsFlow.steps.map(s => ({
        id: s.id,
        name: s.name,
        completed: s.isCompleted,
        percentage: s.completionPercentage
      }))
    );
  } else {
    console.warn('⚠️ No hay resultados por factor o el formato es incorrecto');
  }
}
  // Desbloquear factores secuencialmente (código existente)
  private unlockFactorsSequentially(flow: ProgressFlow) {
    for (let i = 0; i < flow.steps.length; i++) {
      const currentStep = flow.steps[i];

      if (i === 0) {
        // El primer factor se desbloquea solo si las caracterizaciones están completas
        // (ya se manejó en applyUnlockLogic)
      } else {
        // Los siguientes factores se desbloquean si el anterior está completado
        const previousStep = flow.steps[i - 1];
        currentStep.isUnlocked = previousStep.isCompleted;
      }
    }

    const unlockedCount = flow.steps.filter((s) => s.isUnlocked).length;
    const completedCount = flow.steps.filter((s) => s.isCompleted).length;
  }

  // Marcar un paso como completado y aplicar lógica de desbloqueo
  completeStep(
    flowId: string,
    stepId: string,
    completionPercentage: number = 100
  ) {
    const flow = this.progressFlows.get(flowId);
    if (!flow) return;

    const step = flow.steps.find((s) => s.id === stepId);
    if (!step) return;

    step.isCompleted = completionPercentage >= 100;
    step.completionPercentage = completionPercentage;

    // Aplicar lógica completa de desbloqueo
    this.applyUnlockLogic();
  }

  // Métodos de utilidad y consulta (código existente)
  debugCurrentState() {
    const configFlow = this.progressFlows.get('configuration');
    const factorsFlow = this.progressFlows.get('factors');

    if (configFlow) {
      configFlow.steps.forEach((step, index) => {
        console.log(`${index + 1}. ${step.id} (${step.name}):`, {
          isUnlocked: step.isUnlocked,
          isCompleted: step.isCompleted,
          percentage: step.completionPercentage,
        });
      });
    }

    if (factorsFlow) {
      factorsFlow.steps.forEach((step, index) => {
        console.log(`${index + 1}. ${step.id} (${step.name}):`, {
          isUnlocked: step.isUnlocked,
          isCompleted: step.isCompleted,
          percentage: step.completionPercentage,
        });
      });
    }
  }

  getFlow(flowId: string): ProgressFlow | undefined {
    return this.progressFlows.get(flowId);
  }

  getStep(flowId: string, stepId: string): ProgressStep | undefined {
    const flow = this.progressFlows.get(flowId);
    return flow?.steps.find((s) => s.id === stepId);
  }

  isStepUnlocked(flowId: string, stepId: string): boolean {
    const step = this.getStep(flowId, stepId);
    return step?.isUnlocked || false;
  }

  isStepCompleted(flowId: string, stepId: string): boolean {
    const step = this.getStep(flowId, stepId);
    return step?.isCompleted || false;
  }

  // Método específico para verificar si los factores pueden empezar
  areFactorsUnlocked(): boolean {
    const companyCompleted = this.isStepCompleted(
      'configuration',
      'company-characterization'
    );
    const userCompleted = this.isStepCompleted(
      'configuration',
      'user-characterization'
    );
    return companyCompleted && userCompleted;
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
    } catch (error) {}
  }
}
