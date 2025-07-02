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
    routeLink: 'opgestionservicio',
    icon: 'pi pi-chart-bar',
    label: 'Operacion y Gestion del servicio',
    
  },
  {
    routeLink: 'aseguramientocalidad',
    icon: 'pi pi-check-circle',
    label: 'Aseguramiento de la calidad',
    
  },
  {
    routeLink: 'mercadeocomercializacion',
    icon: 'pi pi-wallet',
    label: 'Gestion de mercadeo y comercializacion',
    
  },
  {
    routeLink: 'estrategiagestionf',
    icon: 'pi pi-money-bill',
    label: 'Estrategia y Gestion financiera',
    
  },
  {
    routeLink:'grecursoshumanos',
    label: 'Gestion de recursos humanos',
    icon: 'pi pi-id-card',
    
  },
  {
    routeLink:'gambiental',
    icon: 'pi pi-cloud',
    label: 'Gestion ambiental',
    
  },
  {
    routeLink:'tsis',
    icon: 'pi pi-desktop',
    label: 'Tecnologia y sistemas de informacion',
    
  },
];
