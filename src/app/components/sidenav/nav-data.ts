import { RouterLink } from '@angular/router';
import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '#',
    icon: 'pi pi-cog',
    label: 'Configuracion',
    items: [
      {
        routeLink: 'configuracion/configempresa',
        label: 'Configuracion Empresa',
      },
      
      {
        routeLink: 'configuracion/caracterizacionusuario',
        label: 'Caracterización usuario',
      },
      
      {
        routeLink: '#',
        label: 'Seguridad',
        items: [
          {
            routeLink: 'configuracion/roles',
            label: 'Roles Usuario',
          },
          {
            routeLink: 'configuracion/usuario',
            label: 'Usuarios',
          },
        ],
      },
    ],
  },
  {
    routeLink: 'gestionempresarial',
    icon: 'pi pi-briefcase',
    label: 'Gestion Empresarial',
   
  },
  {
    routeLink: 'formularios',
    icon: 'pi pi-chart-bar',
    label: 'Operacion y Gestion del servicio',
    
  },
  {
    routeLink: 'iniciar-proceso',
    icon: 'pi pi-check-circle',
    label: 'Aseguramiento de la calidad',
    
  },
  {
    routeLink: 'auditoria',
    icon: 'pi pi-wallet',
    label: 'Gestion de mercadeo y comercializacion',
    
  },
  {
    routeLink: 'tareas',
    icon: 'pi pi-money-bill',
    label: 'Estrategia y Gestion financiera',
    
  },
  {
    routeLink:'#',
    label: 'Gestion de recursos humanos',
    icon: 'pi pi-id-card',
    
  },
  {
    routeLink:'#',
    icon: 'pi pi-cloud',
    label: 'Gestion ambiental',
    
  },
  {
    routeLink:'#',
    icon: 'pi pi-desktop',
    label: 'Tecnologia y sistemas de informacion',
    
  },
];
