import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { navbarData } from './nav-data';
import { ProgressLockService, ProgressFlow } from '../../services/progress-lock.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

interface MenuAPI {
  Id: number;
  IdMenuPadre: number | null;
  HasChilds: boolean;
  Nombre: string;
  Configuracion: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit, OnDestroy {
  private userPermissionSubscription: Subscription | null = null;
  private progressSubscription: Subscription | null = null;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  screenWidth = 0;
  multiple = false;
  collapsed = false;
  navData: INavbarData[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(
    public router: Router,
    private progressService: ProgressLockService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    // Inicializar con datos base
    this.navData = [...navbarData];

    // Suscribirse a cambios de progreso PRIMERO
    this.progressSubscription = this.progressService.progress$.subscribe(
      (progressFlows) => {
        this.updateNavigationWithProgress(progressFlows);
      }
    );

    // Luego cargar progreso desde storage y backend
    setTimeout(() => {
      this.progressService.loadProgressFromStorage();
      
      // Cargar progreso completo (caracterizaciones + factores)
      this.progressService.loadProgressFromBackend();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.userPermissionSubscription) {
      this.userPermissionSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  private updateNavigationWithProgress(progressFlows: Map<string, ProgressFlow>) {
    // Actualizar configuración (caracterizaciones)
    this.updateConfigurationMenu(progressFlows);
    
    // Actualizar evaluación de competitividad (factores)
    this.updateCompetitivityMenu(progressFlows);
    
    // NUEVO: Actualizar reportes
    this.updateReportsMenu(progressFlows);
  }

  private updateConfigurationMenu(progressFlows: Map<string, ProgressFlow>) {
    const configFlow = progressFlows.get('configuration');
    if (!configFlow) return;

    // Encontrar el menú de configuración
    const configMenuIndex = this.navData.findIndex(
      item => item.label === 'Configuración'
    );

    if (configMenuIndex !== -1 && this.navData[configMenuIndex].items) {
      // Actualizar caracterización de empresa
      const companyCharacterizationIndex = this.navData[configMenuIndex].items!.findIndex(
        item => item.label === 'Caracterización Empresa'
      );
      
      if (companyCharacterizationIndex !== -1) {
        const companyStep = configFlow.steps.find(s => s.id === 'company-characterization');
        if (companyStep) {
          const menuItem = this.navData[configMenuIndex].items![companyCharacterizationIndex];
          menuItem.routeLink = companyStep.routeLink;
          menuItem.icon = companyStep.icon;
          menuItem.isLocked = !companyStep.isUnlocked;
          menuItem.isCompleted = companyStep.isCompleted;
          menuItem.completionPercentage = companyStep.completionPercentage;
        }
      }

      // Actualizar caracterización de usuario
      const userCharacterizationIndex = this.navData[configMenuIndex].items!.findIndex(
        item => item.label === 'Caracterización usuario'
      );
      
      if (userCharacterizationIndex !== -1) {
        const userStep = configFlow.steps.find(s => s.id === 'user-characterization');
        if (userStep) {
          const menuItem = this.navData[configMenuIndex].items![userCharacterizationIndex];
          menuItem.routeLink = userStep.routeLink;
          menuItem.icon = userStep.icon;
          menuItem.isLocked = !userStep.isUnlocked;
          menuItem.isCompleted = userStep.isCompleted;
          menuItem.completionPercentage = userStep.completionPercentage;
        }
      }
    }
  }

  private updateCompetitivityMenu(progressFlows: Map<string, ProgressFlow>) {
    const factorsFlow = progressFlows.get('factors');
    if (!factorsFlow) return;

    // Encontrar el menú de evaluación de competitividad
    const evaluationMenuIndex = this.navData.findIndex(
      item => item.label === 'Evaluación de Competitividad'
    );

    if (evaluationMenuIndex !== -1) {
      // Convertir los pasos del flujo a elementos del menú
      const factorMenuItems: INavbarData[] = factorsFlow.steps.map(step => ({
        routeLink: step.routeLink,
        icon: step.icon,
        label: step.name,
        isLocked: !step.isUnlocked,
        isCompleted: step.isCompleted,
        completionPercentage: step.completionPercentage
      }));

      this.navData[evaluationMenuIndex].items = factorMenuItems;
      
      // Log del estado de factores
      const unlockedFactors = factorMenuItems.filter(item => !item.isLocked).length;
      const completedFactors = factorMenuItems.filter(item => item.isCompleted).length;

      // Verificar si los factores están disponibles
      const factorsAvailable = this.progressService.areFactorsUnlocked();
    }
  }

  // NUEVO: Método para actualizar el menú de reportes
  private updateReportsMenu(progressFlows: Map<string, ProgressFlow>) {
    const reportsFlow = progressFlows.get('reports');
    if (!reportsFlow) {
      console.warn('⚠️ No se encontró flujo de reportes');
      return;
    }

    // Encontrar el menú de reportes
    const reportsMenuIndex = this.navData.findIndex(
      item => item.label === 'Reportes'
    );

    if (reportsMenuIndex !== -1 && this.navData[reportsMenuIndex].items) {
      
      
      // Verificar estado del último factor
      const lastFactorCompleted = this.progressService.isStepCompleted('factors', 'factor8');
      const reportsUnlocked = this.progressService.areReportsUnlocked();
      


      // Actualizar cada item de reporte con el estado del flujo de progreso
      reportsFlow.steps.forEach((reportStep, index) => {
        // Buscar el item correspondiente en el menú
        const reportItemIndex = this.navData[reportsMenuIndex].items!.findIndex(
          item => item.routeLink === reportStep.routeLink
        );

        if (reportItemIndex !== -1) {
          const menuItem = this.navData[reportsMenuIndex].items![reportItemIndex];
          const wasLocked = menuItem.isLocked;
          
          menuItem.isLocked = !reportStep.isUnlocked;
          menuItem.isCompleted = reportStep.isCompleted;
          menuItem.completionPercentage = reportStep.completionPercentage;
          
      
        } else {
          console.warn(`⚠️ No se encontró item de menú para reporte: ${reportStep.routeLink}`);
        }
      });

      // Si no hay correspondencia exacta, forzar actualización basada en el estado del último factor
      if (lastFactorCompleted) {
        
        this.navData[reportsMenuIndex].items!.forEach(menuItem => {
          if (menuItem.routeLink === 'reporte' || menuItem.routeLink === 'reportedetallado') {
            menuItem.isLocked = false;
            
          }
        });
      }

 
    } else {
      console.warn('⚠️ No se encontró el menú de reportes o no tiene items');
    }
  }

  // Método para obtener el ID del usuario actual
  private getCurrentUserId(): number {
    // TODO: Implementar según tu sistema de autenticación
    return 1;
  }

  expandSidenav(): void {
    this.collapsed = true;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  collapseSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: INavbarData): void {
    // Si el item está bloqueado, no permitir navegación
    if (item.isLocked) {
      this.showLockedMessage(item);
      return;
    }

    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    if (data.isLocked) {
      return 'locked';
    }
    if (data.isCompleted) {
      return 'completed';
    }
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  // Método para verificar si se puede navegar a una ruta
   canNavigate(item: INavbarData): boolean {
    // No permitir navegación automática para logout
    if (item.isLogout) {
      return false;
    }
    return !item.isLocked;
  }

  // Método para manejar click en item de factor
  onFactorClick(item: INavbarData, event: Event) {
     if (item.isLogout) {
      
      event.preventDefault();
      localStorage.clear();
      this.router.navigateByUrl('/login');
      return false;
    }
    if (item.isLocked) {
      event.preventDefault();
      event.stopPropagation();
      this.showLockedMessage(item);
      return false;
    }
    return true;
  }

  private showLockedMessage(item: INavbarData) {
    const factorsFlow = this.progressService.getFlow('factors');
    const configFlow = this.progressService.getFlow('configuration');
    const reportsFlow = this.progressService.getFlow('reports'); // NUEVO
    
    if (!factorsFlow || !configFlow || !reportsFlow) return;
    
    const isFactor = factorsFlow.steps.some(step => step.name === item.label);
    
    const isReport = reportsFlow.steps.some(step => step.routeLink === item.routeLink);
    
    if (isFactor) {
      // Es un factor bloqueado
      const companyCompleted = this.progressService.isStepCompleted('configuration', 'company-characterization');
      const userCompleted = this.progressService.isStepCompleted('configuration', 'user-characterization');
      
      if (!companyCompleted) {
        
        // TODO: Mostrar toast o modal
      } else if (!userCompleted) {
        
        // TODO: Mostrar toast o modal
      } else {
        
        // TODO: Mostrar toast o modal
      }
    } else if (isReport) {
      // NUEVO: Es un reporte bloqueado
      const lastFactorCompleted = this.progressService.isStepCompleted('factors', 'factor8');
      
      if (!lastFactorCompleted) {
        
        // TODO: Mostrar toast o modal con mensaje específico para reportes
        
      }
    } else {
      if (item.label === 'Caracterización usuario') {
        
        // TODO: Mostrar toast o modal
      }
    }
  }

  private parseMenuConfig(configString: string): { iconName: string; ruta: string } {
    try {
      return JSON.parse(configString);
    } catch {
      return { iconName: '', ruta: '#' };
    }
  }

  public transformMenuFromAPI(menuItems: MenuAPI[]): INavbarData[] {
    const buildMenuTree = (parentId: number | null): INavbarData[] => {
      return menuItems
        .filter(item => item.IdMenuPadre === parentId)
        .map(item => {
          const config = this.parseMenuConfig(item.Configuracion);
          const menuItem: INavbarData = {
            routeLink: config.ruta || '#',
            label: item.Nombre,
          };

          if (config.iconName) {
            menuItem.icon = config.iconName;
          }

          if (item.HasChilds) {
            menuItem.items = buildMenuTree(item.Id);
          }

          return menuItem;
        });
    };

    return buildMenuTree(null);
  }

  // Método para debugging - TEMPORAL
  debugProgressState() {
    
    
    // Verificar que todos los flujos existan
    const configFlow = this.progressService.getFlow('configuration');
    const factorsFlow = this.progressService.getFlow('factors');
    const reportsFlow = this.progressService.getFlow('reports');
    

    
    if (!reportsFlow) {
      console.error('❌ PROBLEMA: Flujo de reportes no existe');
      
      this.progressService.forceReinitialize();
    }
    
    
    // Estado específico de reportes
    const reportsUnlocked = this.progressService.areReportsUnlocked();
    const lastFactorCompleted = this.progressService.isStepCompleted('factors', 'factor8');
    
    
    
    
    
    // Forzar verificación
    const forceCheck = this.progressService.forceCheckReportsStatus();
    
    
    // Estado del menú de reportes
    const reportsMenu = this.navData.find(item => item.label === 'Reportes');
 
  }

  // NUEVO: Método público para forzar actualización desde la consola
  forceUpdateReports() {
    
    
    // Primero verificar que el flujo de reportes exista
    let reportsFlow = this.progressService.getFlow('reports');
    
    if (!reportsFlow) {
      console.warn('⚠️ Flujo de reportes no existe, forzando reinicialización...');
      this.progressService.forceReinitialize();
      reportsFlow = this.progressService.getFlow('reports');
    }
    
    if (!reportsFlow) {
      console.error('❌ FALLO CRÍTICO: No se puede crear el flujo de reportes');
      return;
    }
    
    // Forzar verificación del servicio
    this.progressService.forceCheckReportsStatus();
    
    // Obtener los flows actuales del servicio
    const progressFlows = this.progressService.getCurrentProgressFlows();
    
    // Forzar actualización del menú
    this.updateReportsMenu(progressFlows);
    
    
  }

  tabs() {
    // Implementación de tabs si es necesario
  }
}