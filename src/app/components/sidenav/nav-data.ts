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
        routeLink: 'configuracion/empresa',
        label: 'Empresas',
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
    routeLink: '#',
    icon: 'pi pi-desktop',
    label: 'Modulo 1',
    items: [
      {
        routeLink: '#',
        label: 'Configuracion',
        items: [
          {
            routeLink: '#',
            label: 'Configuracion modulo 1',
          },
          
        ],
      },
      
      
    ],
  },
  {
    routeLink: 'formularios',
    icon: 'pi pi-desktop',
    label: 'Modulo 2',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'cliente/zonaventa',
            label: 'Zonas Venta',
          },
          {
            routeLink:'cliente/territorioventa',
            label: 'Territorios Venta',
          },
          {
            routeLink:'cliente/lineacredito',
            label: 'Linea Credito',
          },
          {
            routeLink:'cliente/listaprecios',
            label: 'Lista Precios',
          },
          {
            routeLink:'cliente/vendedor',
            label: 'Vendedores',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Clientes',
      },
      {
        routeLink:'#',
        label: 'Reportes Clientes',
        items:[
          {
            routeLink:'#',
            label: 'Listado Clientes',
          },
          {
            routeLink:'#',
            label: 'Transacciones Clientes',
          },
          {
            routeLink:'#',
            label: 'Cliente Estado Cuenta',
          },
          {
            routeLink:'#',
            label: 'Cliente Dias Vencido',
          },
          {
            routeLink:'#',
            label: 'Analisis Vencimientos',
          },
          {
            routeLink:'#',
            label: 'Pendiente Recaudo',
          },
          {
            routeLink:'#',
            label: 'Cartera Total',
          },
          {
            routeLink:'#',
            label: 'Pareto Ventas',
          },
        ]
      },
    ]
  },
  {
    routeLink: 'iniciar-proceso',
    icon: 'pi pi-desktop',
    label: 'Modulo 3',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'#',
            label: 'Zonas Proovedor',
          },
          {
            routeLink:'#',
            label: 'Forma Pago',
          },
          {
            routeLink:'#',
            label: 'Forma Envio',
          },
          {
            routeLink:'#',
            label: 'Representante Compra',
          },
          {
            routeLink:'#',
            label: 'Tipo Proovedor',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Proovedores',
      },
      {
        routeLink:'#',
        label: 'Reportes Proovedores',
        items:[
          {
            routeLink:'#',
            label: 'Listado Proovedores',
          },
          {
            routeLink:'#',
            label: 'Transacciones Proovedores',
          },
          {
            routeLink:'#',
            label: 'Proovedor Estado Cuenta',
          },
          {
            routeLink:'#',
            label: 'Analisis Vencimientos P.',
          },
          {
            routeLink:'#',
            label: 'Cuentas Pagar Total',
          },
        ]
      },
    ]
  },
  {
    routeLink: 'auditoria',
    icon: 'pi pi-desktop',
    label: 'Modulo 4',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'#',
            label: 'Grupos',
          },
          {
            routeLink:'#',
            label: 'Lineas',
          },
          {
            routeLink:'#',
            label: 'SubLineas',
          },
          {
            routeLink:'#',
            label: 'Marcas',
          },
          {
            routeLink:'#',
            label: 'Unidades Peso',
          },
          {
            routeLink:'#',
            label: 'Unidades Medida',
          },
          {
            routeLink:'#',
            label: 'Bodegas',
          },
          {
            routeLink:'#',
            label: 'Categorias Contables',
          },
          {
            routeLink:'#',
            label: 'Impuestos Ventas',
          },
          {
            routeLink:'#',
            label: 'Impuestos Compras',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Reportes Inventario',
        items:[
          {
            routeLink:'#',
            label: 'Movimiento y Saldos',
          },
          {
            routeLink:'#',
            label: 'Inventario Consolidado',
          },
          {
            routeLink:'#',
            label: 'Existencias Por Bodega',
          },
          {
            routeLink:'#',
            label: 'Inventario Fisico',
          },
          {
            routeLink:'#',
            label: 'Inventario Consignado',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Productos',
      },
    ]
  },
  {
    routeLink: 'tareas',
    icon: 'pi pi-desktop',
    label: 'Modulo 5',
    items:[
      {
        routeLink:'#',
        label: 'Reportes Facturacion',
        items:[
          {
            routeLink:'#',
            label: 'Pedidos Pendientes',
          },
        ]
      },
    ]
  },
  {
    routeLink:'#',
    label: 'Modulo 6',
    icon: 'pi pi-desktop',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'#',
            label: 'Costos Compras',
          },
        ]
      },
    ]
  },
  {
    routeLink:'#',
    icon: 'pi pi-desktop',
    label: 'Modulo 7',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'#',
            label: 'Bancos',
          },
          {
            routeLink:'#',
            label: 'Cuentas Bancarias',
          },
          {
            routeLink:'#',
            label: 'Causal Dev. Cheque',
          },
          {
            routeLink:'#',
            label: 'Pagos Recibo Caja',
          },
          {
            routeLink:'#',
            label: 'Pagos Comprobante Egreso',
          },
        ]
      },
    ]
  },
  {
    routeLink:'#',
    icon: 'pi pi-desktop',
    label: 'Modulo 8',
    items:[
      {
        routeLink:'#',
        label: 'Configuracion',
        items:[
          {
            routeLink:'#',
            label: 'md 8',
          },
          
        ]
      },
    ]
  },
];
