import { Component, Input, OnInit } from '@angular/core';
import { INavbarData, fadeInOut } from './helper';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sublevel-menu',
  standalone: false,
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0"
        [@submenu]="expanded ? {value: 'visible', params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}} : {value:'hidden', params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
        class="sublevel-nav">
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
        <!-- Item con subitems -->
        <a class="sublevel-nav-link"
           (click)="handleClick(item)"
           *ngIf="item.items && item.items.length > 0"
           [ngClass]="getItemClasses(item)">
              <i class="sublevel-link-icon" [class]="item.icon"></i>
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">
            {{item.label}}
          
          </span>
          <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
             [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
        </a>
        
        <!-- Item sin subitems -->
        <a class="sublevel-nav-link"
           *ngIf="!item.items || (item.items && item.items.length === 0)"
           [routerLink]="canNavigate(item) ? [item.routeLink] : null"
           (click)="onItemClick(item, $event)"
           routerLinkActive="active-sublevel"
           [routerLinkActiveOptions]="{exact: true}"
           [ngClass]="getItemClasses(item)">
           <i class="sublevel-link-icon" [class]="item.icon"></i>
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">
            {{item.label}}
          
            <!-- Indicador de progreso -->
            <span *ngIf="item.completionPercentage !== undefined" 
                  class="progress-indicator">
              ({{item.completionPercentage}}%)
            </span>
          </span>
          <!-- Iconos de estado -->
          <div class="status-icons">
            <i *ngIf="item.isLocked" class="pi pi-lock status-locked" title="Bloqueado"></i>
            <i *ngIf="item.isCompleted" class="pi pi-check-circle status-completed" title="Completado"></i>
            <i *ngIf="!item.isLocked && !item.isCompleted && item.completionPercentage > 0" 
               class="pi pi-clock status-in-progress" title="En progreso"></i>
          </div>
        </a>
        
        <!-- Submenu recursivo -->
        <div *ngIf="item.items && item.items.length > 0">
          <app-sublevel-menu [data]="item" [collapsed]="collapsed" [multiple]="multiple" [expanded]="item.expanded"></app-sublevel-menu>
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({ height: '0', overflow: 'hidden' })),
      state('visible', style({ height: '*' })),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {
  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  };

  @Input() collapsed = false;
  @Input() expanded = false;
  @Input() multiple = false;

  constructor() { }

  ngOnInit(): void { }

  handleClick(item: any): void {
    // Si el item está bloqueado, no permitir interacción
    if (item.isLocked) {
      return;
    }

    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  // Nuevo método para manejar click en items
  onItemClick(item: INavbarData, event: Event): boolean {
    if (item.isLocked) {
      event.preventDefault();
      event.stopPropagation();
      console.log(`${item.label} está bloqueado. Complete el factor anterior primero.`);
      return false;
    }
    return true;
  }

  // Nuevo método para verificar navegación
  canNavigate(item: INavbarData): boolean {
    return !item.isLocked;
  }

  // Nuevo método para obtener clases CSS
  getItemClasses(item: INavbarData): string {
    let classes = '';
    
    if (item.isLocked) {
      classes += 'locked disabled-link ';
    }
    
    if (item.isCompleted) {
      classes += 'completed ';
    }
    
    return classes.trim();
  }
}