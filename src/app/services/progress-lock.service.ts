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
    
    
    this.initializeReportsFlow(); 
    
    
    // Verificar que todos los flujos se crearon
    const flows = Array.from(this.progressFlows.keys());
    
    
    if (!flows.includes('reports')) {
      console.error('❌ ERROR: Flujo de reportes no se creó correctamente');
      // Intentar crear nuevamente
      this.forceCreateReportsFlow();
    }
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
  }

  // NUEVO: Inicializar el flujo de reportes (BLOQUEADO hasta completar el último factor)
  private initializeReportsFlow() {
    
    
    const reportsFlow: ProgressFlow = {
      flowId: 'reports',
      name: 'Reportes',
      steps: [
        {
          id: 'general-report',
          name: 'Reporte General',
          routeLink: 'reporte',
          icon: 'pi pi-chart-line',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO hasta completar factor8 (Tecnología)
          
          requiredSteps: ['factor8'], // Requiere el último factor
        },
        {
          id: 'detailed-reports',
          name: 'Reportes Detallados',
          routeLink: 'reportedetallado',
          icon: 'pi pi-file-pdf',
          isCompleted: false,
          isUnlocked: false, // BLOQUEADO hasta completar factor8 (Tecnología)
          
          requiredSteps: ['factor8'], // Requiere el último factor
        },
      ],
    };

    this.progressFlows.set('reports', reportsFlow);
    
    
    // Emitir actualización
    this.progressSubject.next(this.progressFlows);
    
  }

  // NUEVO: Método para forzar creación del flujo de reportes
  private forceCreateReportsFlow() {
    
    
    // Eliminar si existe
    if (this.progressFlows.has('reports')) {
      this.progressFlows.delete('reports');
    }
    
    // Crear nuevamente
    this.initializeReportsFlow();
    
    // Verificar creación
    const reportsFlow = this.progressFlows.get('reports');
    if (reportsFlow) {
      
    } else {
      console.error('❌ FALLO: No se pudo crear el flujo de reportes');
    }
  }

  // Cargar progreso completo desde el backend
  async loadProgressFromBackend() {
    
    
    try {
      // Cargar caracterizaciones CON AWAIT
      await this.loadCharacterizationsProgress();
      

      // Cargar progreso de factores CON AWAIT
      await this.loadFactorsProgress();
      

      // Aplicar lógica de desbloqueo UNA SOLA VEZ al final
      this.applyUnlockLogic();
      
      
    } catch (error) {
      console.error('❌ Error cargando progreso, reseteando a estado inicial:', error);
      this.resetToInitialState();
    }
  }

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
          
          
          const configFlow = this.progressFlows.get('configuration');
          if (configFlow && response?.ok && response?.data && response.data.length > 0) {
            const caracterizacionData = response.data[0];
            const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
            
            if (companyStep) {
              companyStep.isCompleted = caracterizacionData.completed || false;
              companyStep.completionPercentage = caracterizacionData.percentage || 0;
          
            }
          } else {
            this.ensureCompanyCharacterizationNotCompleted();
          }
          resolve();
        },
        (validationErrors) => {
          console.warn('⚠️ Error validación empresa:', validationErrors);
          this.ensureCompanyCharacterizationNotCompleted();
          resolve();
        },
        (errors) => {
          console.warn('⚠️ Error empresa:', errors);
          this.ensureCompanyCharacterizationNotCompleted();
          resolve();
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
          
          
          const configFlow = this.progressFlows.get('configuration');
          if (configFlow && response?.ok && response?.data && response.data.length > 0) {
            const caracterizacionData = response.data[0];
            const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
            
            if (userStep) {
              userStep.isCompleted = caracterizacionData.completed || false;
              userStep.completionPercentage = caracterizacionData.percentage || 0;
         
            }
          } else {
            this.ensureUserCharacterizationNotCompleted();
          }
          resolve();
        },
        (validationErrors) => {
          console.warn('⚠️ Error validación usuario:', validationErrors);
          this.ensureUserCharacterizationNotCompleted();
          resolve();
        },
        (errors) => {
          console.warn('⚠️ Error usuario:', errors);
          this.ensureUserCharacterizationNotCompleted();
          resolve();
        }
      );
    });
  }

  // Métodos auxiliares para asegurar estados no completados
  private ensureCompanyCharacterizationNotCompleted() {
    const configFlow = this.progressFlows.get('configuration');
    if (configFlow) {
      const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
      if (companyStep) {
        companyStep.isCompleted = false;
        companyStep.completionPercentage = 0;
      }
    }
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
  }

  // Cargar progreso de factores
  private async loadFactorsProgress(): Promise<void> {
    return new Promise((resolve, reject) => {
      const savedEncuestaId = localStorage.getItem('encuestaId');
      
      if (savedEncuestaId) {
        
        this.loadResultados(savedEncuestaId).then(resolve).catch(resolve);
      } else {
        
        this.commonsService.getWithHandling(
          `CaracterizacionUsuario/GetIdEncuenstaByEmpresa`,
          (response: any) => {
            
            
            if (response?.data?.[0]?.idEncuesta) {
              const encuestaId = response.data[0].idEncuesta;
              localStorage.setItem('encuestaId', encuestaId);
              
              this.loadResultados(encuestaId).then(resolve).catch(resolve);
            } else {
              console.warn('⚠️ No se pudo obtener encuestaId');
              resolve();
            }
          },
          (validationErrors) => {
            console.warn('⚠️ Error validación encuestaId:', validationErrors);
            resolve();
          },
          (errors) => {
            console.warn('⚠️ Error encuestaId:', errors);
            resolve();
          }
        );
      }
    });
  }

  private loadResultados(encuestaId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      
      
      this.commonsService.getByIdWithHandling(
        'Respuesta/ObtenerResultadosEncuesta',
        encuestaId,
        (response: any) => {
          
          
          let resultadosData = this.extractResultadosData(response);
          
          
          if (resultadosData?.resultadosPorFactor?.length > 0) {
            
            this.updateFactorsFromBackendData(resultadosData);
            
          } else {
            console.warn('⚠️ No hay datos de progreso para mostrar');
          }
          resolve();
        },
        (validationErrors) => {
          console.warn('⚠️ Error validación resultados:', validationErrors);
          resolve();
        },
        (errors) => {
          console.warn('⚠️ Error resultados:', errors);
          resolve();
        }
      );
    });
  }

  // ACTUALIZADO: Aplicar lógica completa de desbloqueo (incluye reportes)
  private applyUnlockLogic() {
    const configFlow = this.progressFlows.get('configuration');
    const factorsFlow = this.progressFlows.get('factors');
    const reportsFlow = this.progressFlows.get('reports'); // NUEVO

    if (!configFlow || !factorsFlow || !reportsFlow) {
      console.warn('⚠️ No se encontraron todos los flujos necesarios');
      return;
    }

    

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

    // 5. NUEVO: Desbloquear reportes - LÓGICA MEJORADA
    const lastFactor = factorsFlow.steps[factorsFlow.steps.length - 1]; // factor8 (Tecnología)
    
    // Log detallado del estado del último factor


    // Verificar múltiples condiciones para asegurar que el factor está realmente completado
    const isLastFactorCompleted = lastFactor && (
      (lastFactor.isCompleted === true) || 
      (lastFactor.completionPercentage >= 100)
    );
    
 
    // Desbloquear todos los reportes si el último factor está completado
    if (isLastFactorCompleted) {
      
      reportsFlow.steps.forEach(reportStep => {
        const wasLocked = !reportStep.isUnlocked;
        reportStep.isUnlocked = true;
        
        if (wasLocked) {
          
        }
      });
    } else {
      
      reportsFlow.steps.forEach(reportStep => {
        reportStep.isUnlocked = false;
      });
    }

    // 6. Log final del estado de reportes
  

    // 7. Actualizar subject
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

    // NUEVO: Resetear reportes
    const reportsFlow = this.progressFlows.get('reports');
    if (reportsFlow) {
      reportsFlow.steps.forEach((step) => {
        step.isUnlocked = false; // TODOS los reportes bloqueados
        step.isCompleted = false;
        step.completionPercentage = 0;
      });
    }

    this.progressSubject.next(this.progressFlows);
    this.saveProgress();
  }

  // Método para extraer datos de la respuesta
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

  // Actualizar factores basado en datos del backend
  private updateFactorsFromBackendData(backendData: any) {
    
    
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
      
      
      backendData.resultadosPorFactor.forEach((factor: any, index: number) => {
        
        
        const factorName = factor.nombreFactor?.trim();
        let stepId = factorNameToStepId[factorName];

        if (!stepId) {
          stepId = factorIdToStepId[factor.idFactor];
        }


        const factorStep = factorsFlow.steps.find((s) => s.id === stepId);

        if (factorStep) {
          factorStep.completionPercentage = 100;
          factorStep.isCompleted = true;
        } else {
          console.warn(`⚠️ No se encontró el paso para el factor: ${stepId}`);
        }
      });
      
  
    } else {
      console.warn('⚠️ No hay resultados por factor o el formato es incorrecto');
    }
  }

  // Desbloquear factores secuencialmente
  private unlockFactorsSequentially(flow: ProgressFlow) {
    for (let i = 0; i < flow.steps.length; i++) {
      const currentStep = flow.steps[i];

      if (i === 0) {
        // El primer factor se desbloquea solo si las caracterizaciones están completas
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

  // NUEVO: Método específico para verificar si los reportes están desbloqueados
  areReportsUnlocked(): boolean {
    const factorsFlow = this.progressFlows.get('factors');
    if (!factorsFlow) {
      console.warn('⚠️ No se encontró flujo de factores');
      return false;
    }

    const lastFactor = factorsFlow.steps[factorsFlow.steps.length - 1];
    const isCompleted = lastFactor && (
      (lastFactor.isCompleted === true) || 
      (lastFactor.completionPercentage >= 100)
    );


    return !!isCompleted;
  }

  // NUEVO: Método público para forzar inicialización completa
  forceReinitialize() {
    
    console.log('reinicializando');
    
    // Limpiar flujos existentes
    this.progressFlows.clear();
    
    // Reinicializar todos los flujos
    this.initializeAllFlows();
    
    // Aplicar lógica de desbloqueo
    this.applyUnlockLogic();
    
    
    
    return this.progressFlows;
  }

  // NUEVO: Método para obtener el valor actual de los flows
  getCurrentProgressFlows(): Map<string, ProgressFlow> {
    return this.progressFlows;
  }

  // NUEVO: Método para forzar recarga y verificación del estado de reportes
  forceCheckReportsStatus() {
    
    
    // Aplicar lógica de desbloqueo
    this.applyUnlockLogic();
    
    // Verificar estado actual
    const reportsUnlocked = this.areReportsUnlocked();
    const reportsFlow = this.progressFlows.get('reports');
    
    // Forzar actualización del subject
    this.progressSubject.next(this.progressFlows);
    
    return reportsUnlocked;
  }

  // Métodos de utilidad y consulta
  

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