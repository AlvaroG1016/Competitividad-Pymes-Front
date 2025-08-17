import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '#',
    icon: 'pi pi-cog',
    label: 'Configuración',
    items: [
      // Estos items se actualizarán dinámicamente con el estado de progreso
      {
        routeLink: '',
        label: 'Caracterización Empresa',
        isLocked: false, // Se actualizará dinámicamente
        isCompleted: false, // Se actualizará dinámicamente
        completionPercentage: 0 // Se actualizará dinámicamente
      },
      {
        routeLink: '',
        label: 'Caracterización usuario',
        isLocked: true, // Se actualizará dinámicamente
        isCompleted: false, // Se actualizará dinámicamente
        completionPercentage: 0 // Se actualizará dinámicamente
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
    items: [] // Se llenará dinámicamente con los factores
  },
  {
    routeLink: 'reporte',
    icon: 'pi pi-chart-line',
    label: 'repo',
    
  }
];