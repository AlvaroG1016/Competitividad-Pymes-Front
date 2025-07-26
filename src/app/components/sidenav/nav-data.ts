import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '#',
    icon: 'pi pi-cog',
    label: 'Configuración',
    items: [
      {
        routeLink: 'configuracion/configempresa',
        label: 'Configuración Empresa',
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
  // Los factores ahora se generarán dinámicamente desde el servicio
  {
    routeLink: '#',
    icon: 'pi pi-chart-line',
    label: 'Evaluación de Competitividad',
    items: [] // Se llenará dinámicamente
  }
];