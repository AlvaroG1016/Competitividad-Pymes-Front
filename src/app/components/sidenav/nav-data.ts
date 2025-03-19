import { RouterLink } from '@angular/router';
import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '#',
    icon: 'ms-Icon ms-Icon--Settings',
    label: 'Configuracion',
    items: [
      {
        routeLink: 'configuracion/configempresa',
        label: 'Configuracion Empresa',
      },
      {
        routeLink: 'configuracion/configcontable',
        label: 'Configuracion Contable',
      },
      {
        routeLink: 'configuracion/empresa',
        label: 'Empresas',
      },
      {
        routeLink: 'configuracion/paises',
        label: 'Paises',
      },
      {
        routeLink: 'configuracion/departamentos',
        label: 'Departamentos',
      },
      {
        routeLink: 'configuracion/ciudades',
        label: 'Ciudades',
      },
      {
        routeLink: 'configuracion/saludo',
        label: 'Saludo',
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
    icon: 'ms-Icon ms-Icon--ProcessMetaTask',
    label: 'Contabilidad',
    items: [
      {
        routeLink: '#',
        label: 'Configuracion',
        items: [
          {
            routeLink: '#',
            label: 'Configuracion Contabilidad',
          },
          {
            routeLink: 'contabilidad/periodoscontables',
            label: 'Periodos Contables',
          },
          {
            routeLink: 'contabilidad/tipocomprobante',
            label: 'Tipos Comprobante',
          },
          {
            routeLink: 'contabilidad/tercero',
            label: 'Terceros',
          },
          {
            routeLink: 'contabilidad/tipoidentificacion',
            label: 'Tipo Identificacion',
          },
          {
            routeLink: 'contabilidad/tipofiscal',
            label: 'Tipo Fiscal',
          },
          {
            routeLink: 'contabilidad/centrocosto',
            label: 'Centro de Costo',
          },
          {
            routeLink: 'contabilidad/oficina',
            label: 'Oficinas',
          },
          {
            routeLink: 'contabilidad/actividadeconomica',
            label: 'Actividad Economica',
          },
          {
            routeLink: '#',
            label: 'Diseñar Comprobante',
          },
        ],
      },
      {
        routeLink: 'contabilidad/plancuentas',
        label: 'Plan de Cuenta',
      },
      {
        routeLink: 'contabilidad/plancuentasniif',
        label: 'Plan de Cuentas NIIF',
      },
      {
        routeLink: 'contabilidad/notacontable',
        label: 'Nota Contabilidad',
      },
      {
        routeLink: '#',
        label: 'Consultas',
        items: [
          {
            routeLink: 'contabilidad/movimientocuenta',
            label: 'Movimiento Cuenta',
          },
          {
            routeLink: 'contabilidad/movimientotercero',
            label: 'Movimiento Tercero',
          },
          {
            routeLink: 'contabilidad/movimientocentrocosto',
            label: 'Movimiento Centro Costo',
          },
          {
            routeLink: '#',
            label: 'Balance Prueba',
          },
          {
            routeLink: '#',
            label: 'Saldo Inicial Cuentas',
          },
          {
            routeLink: 'contabilidad/movimientocomprobante',
            label: 'Movimiento Comprobante',
          },
        ],
      },
      {
        routeLink: '#',
        label: 'Reportes Contables',
        items : [
          {
            routeLink:'#',
            label: 'Movimiento Procesado',
          },
          {
            routeLink:'#',
            label: 'Libros Auxiliares',
          },
          {
            routeLink:'#',
            label: 'Libro Diario',
          },
          {
            routeLink:'#',
            label: 'Libro Mayor',
          },
          {
            routeLink:'#',
            label: 'Comprobante Diario',
          },
          {
            routeLink:'#',
            label: 'Cuenta Tercero',
          },
          {
            routeLink:'#',
            label: 'Cuenta C Costo Oficina',
          },
          {
            routeLink:'#',
            label: 'Anexo Contable',
          },
          {
            routeLink:'#',
            label: 'Anexo Local NIIF',
          },
          {
            routeLink:'#',
            label: 'Listado Comprobantes',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Estados Financieros',
        items:[
          {
            routeLink:'#',
            label: 'Balance General',
          },
          {
            routeLink:'#',
            label: 'Estado de Resultados',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Certificados Tributarios',
        items:[
          {
            routeLink:'#',
            label: 'Configurar RETE FTE',
          },
          {
            routeLink:'#',
            label: 'Configurar RETE IVA',
          },
          {
            routeLink:'#',
            label: 'Configurar RETE ICA',
          },
          {
            routeLink:'#',
            label: 'Diseñar Certificado',
          },
          {
            routeLink:'#',
            label: 'Generar Certificados',
          },
        ]
      },
      {
        routeLink:'#',
        label: 'Medios Magneticos',
        items:[
          {
            routeLink:'#',
            label: 'Formatos',
          },
          {
            routeLink:'#',
            label: 'Conceptos',
          },
          {
            routeLink:'#',
            label: 'Conceptos/Cuentas',
          },
        ]
      },
    ],
  },
  {
    routeLink: 'formularios',
    icon: 'ms-Icon ms-Icon--FormLibrary',
    label: 'Cliente',
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
    icon: 'ms-Icon ms-Icon--Processing',
    label: 'Proovedor',
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
    icon: 'ms-Icon ms-Icon--ComplianceAudit',
    label: 'Inventario',
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
    icon: 'ms-Icon ms-Icon--TaskManager',
    label: 'Facturacion',
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
    label: 'Compras',
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
    label: 'Tesoreria',
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
];
