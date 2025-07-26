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
  collapsed = false;
  screenWidth = 0;
  multiple = false;
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
      this.progressService.loadProgressFromBackend(5); // ID de encuesta actual
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
    const factorsFlow = progressFlows.get('factors');
    if (!factorsFlow) return;

    // Encontrar el índice del menú de evaluación
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
    }
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
    return !item.isLocked;
  }

  // Método para manejar click en item de factor
  onFactorClick(item: INavbarData, event: Event) {
    if (item.isLocked) {
      event.preventDefault();
      event.stopPropagation();
      // Opcional: mostrar tooltip o mensaje de por qué está bloqueado
      console.log(`${item.label} está bloqueado. Complete el factor anterior primero.`);
      return false;
    }
    return true;
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

  tabs() {
    console.log('tabClicked');
  }
}