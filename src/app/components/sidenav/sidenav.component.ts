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
//import { BaseServiceService } from "src/app/services/base-service.service";
import { navbarData } from './nav-data';

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
export class SidenavComponent {
  private userPermissionSubscription: Subscription | null = null;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  multiple = false;
  navData;

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

  constructor(public router: Router) {}
  /* constructor(public router: Router, private baseService: BaseServiceService) {}
  ); */

  ngOnInit(): void {
     this.screenWidth = window.innerWidth;
    /*this.userPermissionSubscription = this.baseService.currentUserPermissions.subscribe(
      (permissions) => {
        
        const transformedMenu = this.transformMenuFromAPI(permissions);

        this.navData = transformedMenu
        console.log(transformedMenu);
        
      }
    ); */
    this.navData = navbarData;
  }

  ngOnDestroy(): void {
    if(this.userPermissionSubscription) this.userPermissionSubscription.unsubscribe();
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
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  private parseMenuConfig(configString: string): { iconName: string; ruta: string } {
    try {
      return JSON.parse(configString);
    } catch {
      return { iconName: '', ruta: '#' };
    }
  }

  public transformMenuFromAPI(menuItems: MenuAPI[]): INavbarData[] {
    // Función para construir el árbol del menú recursivamente
      
    const buildMenuTree = (parentId: number | null): INavbarData[] => {
      return menuItems
        .filter(item => item.IdMenuPadre === parentId)
        .map(item => {
          const config = this.parseMenuConfig(item.Configuracion);
          const menuItem: INavbarData = {
            routeLink: config.ruta || '#',
            label: item.Nombre,
          };

          // Agregar icono solo si existe en la configuración
          if (config.iconName) {
            menuItem.icon = config.iconName;
          }

          // Si tiene hijos, procesarlos recursivamente
          if (item.HasChilds) {
            menuItem.items = buildMenuTree(item.Id);
          }

          return menuItem;
        });
    };

    // Comenzar con los elementos raíz (parentId = null)
    return buildMenuTree(null);
  }


  tabs(){
    console.log('tabClicked');
    
  }
}
