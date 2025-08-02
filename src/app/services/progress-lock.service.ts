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
          completionPercentage: 0
        },
        {
          id: 'user-characterization',
          name: 'Caracterización Usuario',
          routeLink: 'caracterizacionusuario',
          icon: 'pi pi-user',
          isCompleted: false,
          isUnlocked: false, // Se desbloquea cuando se complete caracterización de empresa
          completionPercentage: 0,
          requiredSteps: ['company-characterization']
        }
      ]
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
          requiredSteps: ['company-characterization', 'user-characterization']
        },
        {
          id: 'factor2',
          name: 'Operación y Gestión del Servicio',
          routeLink: 'opgestionservicio',
          icon: 'pi pi-chart-bar',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor1']
        },
        {
          id: 'factor3',
          name: 'Aseguramiento de la Calidad',
          routeLink: 'aseguramientocalidad',
          icon: 'pi pi-check-circle',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor2']
        },
        {
          id: 'factor4',
          name: 'Gestión de Mercadeo y Comercialización',
          routeLink: 'mercadeocomercializacion',
          icon: 'pi pi-wallet',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor3']
        },
        {
          id: 'factor5',
          name: 'Estrategia y Gestión Financiera',
          routeLink: 'estrategiagestionf',
          icon: 'pi pi-money-bill',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor4']
        },
        {
          id: 'factor6',
          name: 'Gestión de Recursos Humanos',
          routeLink: 'grecursoshumanos',
          icon: 'pi pi-id-card',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor5']
        },
        {
          id: 'factor7',
          name: 'Gestión Ambiental',
          routeLink: 'gambiental',
          icon: 'pi pi-cloud',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor6']
        },
        {
          id: 'factor8',
          name: 'Tecnología y Sistemas de Información',
          routeLink: 'tsis',
          icon: 'pi pi-desktop',
          isCompleted: false,
          isUnlocked: false,
          completionPercentage: 0,
          requiredSteps: ['factor7']
        }
      ]
    };

    this.progressFlows.set('factors', factorsFlow);
    this.progressSubject.next(this.progressFlows);
  }

  // Cargar progreso completo desde el backend
  async loadProgressFromBackend(userId: number) {
    try {

      
      // Cargar caracterizaciones
      await this.loadCharacterizationsProgress(userId);
      
      // Cargar progreso de factores
      await this.loadFactorsProgress(userId);
      
      // Aplicar lógica de desbloqueo
      this.applyUnlockLogic();
      
    } catch (error) {

      this.resetToInitialState();
    }
  }

  // Cargar progreso de caracterizaciones
  private async loadCharacterizationsProgress(userId: number) {
    try {
        // Verificar caracterización de empresa
        this.commonsService.getWithHandling(
            'Caracterizacion/VerificarCaracterizacionEmpresa',
            (response: any) => {

                const configFlow = this.progressFlows.get('configuration');
                if (configFlow && response?.ok && response?.data && response.data.length > 0) {
                    const caracterizacionData = response.data[0]; // Tomar el primer elemento del array
                    const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
                    if (companyStep) {
                        companyStep.isCompleted = caracterizacionData.completed || false;
                        companyStep.completionPercentage = caracterizacionData.percentage || 0;

                    }
                }
                this.applyUnlockLogic();
            },
            (validationErrors) => {

                this.ensureCompanyCharacterizationNotCompleted();
            },
            (errors) => {

                this.ensureCompanyCharacterizationNotCompleted();
            }
        );

        // Verificar caracterización de usuario
        this.commonsService.getWithHandling(
            'Caracterizacion/VerificarCaracterizacionUsuario',
            (response: any) => {

                const configFlow = this.progressFlows.get('configuration');
                if (configFlow && response?.ok && response?.data && response.data.length > 0) {
                    const caracterizacionData = response.data[0]; // Tomar el primer elemento del array
                    const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
                    if (userStep) {
                        userStep.isCompleted = caracterizacionData.completed || false;
                        userStep.completionPercentage = caracterizacionData.percentage || 0;

                    }
                }
                this.applyUnlockLogic();
            },
            (validationErrors) => {

                this.ensureUserCharacterizationNotCompleted();
            },
            (errors) => {

                this.ensureUserCharacterizationNotCompleted();
            }
        );

    } catch (error) {

    }
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
    this.applyUnlockLogic();
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
    this.applyUnlockLogic();
}

  // Cargar progreso de factores (código existente adaptado)
  private async loadFactorsProgress(encuestaId: number) {
    try {

      
      this.commonsService.getByIdWithHandling(
        'Respuesta/ObtenerResultadosEncuesta',
        encuestaId,
        (response: any) => {

          
          let resultadosData = this.extractResultadosData(response);
          
          if (resultadosData && resultadosData.resultadosPorFactor && resultadosData.resultadosPorFactor.length > 0) {

            this.updateFactorsFromBackendData(resultadosData);
          } else {

          }
        },
        (validationErrors) => {

        },
        (errors) => {

        }
      );
    } catch (error) {

    }
  }

  // Aplicar lógica completa de desbloqueo
  private applyUnlockLogic() {

    
    const configFlow = this.progressFlows.get('configuration');
    const factorsFlow = this.progressFlows.get('factors');
    
    if (!configFlow || !factorsFlow) return;

    // 1. Desbloquear caracterización de usuario si empresa está completa
    const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
    const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
    
    if (companyStep && userStep) {
      userStep.isUnlocked = companyStep.isCompleted;

    }

    // 2. Verificar si ambas caracterizaciones están completas
    const bothCharacterizationsCompleted = companyStep?.isCompleted && userStep?.isCompleted;


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
      factorsFlow.steps.forEach(step => {
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

    
    if (response?.ok && response?.data && Array.isArray(response.data) && response.data.length > 0) {
      const firstDataItem = response.data[0];
      if (firstDataItem?.resultadosPorFactor && Array.isArray(firstDataItem.resultadosPorFactor)) {

        return firstDataItem;
      }
    }
    
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
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
    const factorsFlow = this.progressFlows.get('factors');
    if (!factorsFlow) return;



    const factorNameToStepId: { [key: string]: string } = {
      'GE': 'factor1',
      'OGS': 'factor2',
      'AC': 'factor3',
      'GMC': 'factor4',
      'EGF': 'factor5',
      'GRH': 'factor6',
      'GA': 'factor7',
      'TSI': 'factor8'
    };

    const factorIdToStepId: { [key: number]: string } = {
      3: 'factor1',
      4: 'factor2',
      5: 'factor3',
      6: 'factor4',
      7: 'factor5',
      8: 'factor6',
      9: 'factor7',
      10: 'factor8'
    };

    if (backendData.resultadosPorFactor && Array.isArray(backendData.resultadosPorFactor)) {

      
      backendData.resultadosPorFactor.forEach((factor: any) => {

        
        const factorName = factor.nombreFactor?.trim();
        let stepId = factorNameToStepId[factorName];
        
        if (!stepId) {
          stepId = factorIdToStepId[factor.idFactor];
        }
        
        const factorStep = factorsFlow.steps.find(s => s.id === stepId);
        
        if (factorStep) {
          factorStep.completionPercentage = 100;
          factorStep.isCompleted = true;

        } else {

        }
      });
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
    
    const unlockedCount = flow.steps.filter(s => s.isUnlocked).length;
    const completedCount = flow.steps.filter(s => s.isCompleted).length;

  }

  // Marcar un paso como completado y aplicar lógica de desbloqueo
  completeStep(flowId: string, stepId: string, completionPercentage: number = 100) {
    const flow = this.progressFlows.get(flowId);
    if (!flow) return;

    const step = flow.steps.find(s => s.id === stepId);
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
          percentage: step.completionPercentage
        });
      });
    }

    if (factorsFlow) {

      factorsFlow.steps.forEach((step, index) => {
        console.log(`${index + 1}. ${step.id} (${step.name}):`, {
          isUnlocked: step.isUnlocked,
          isCompleted: step.isCompleted,
          percentage: step.completionPercentage
        });
      });
    }
  }

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

  // Método específico para verificar si los factores pueden empezar
  areFactorsUnlocked(): boolean {
    const companyCompleted = this.isStepCompleted('configuration', 'company-characterization');
    const userCompleted = this.isStepCompleted('configuration', 'user-characterization');
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
    } catch (error) {

    }
  }
}