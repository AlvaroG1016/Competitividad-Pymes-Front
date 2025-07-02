import { Component } from '@angular/core';

@Component({
  selector: 'app-mercadeocomercializacion',
  standalone: false,
  templateUrl: './mercadeocomercializacion.component.html',
  styleUrl: './mercadeocomercializacion.component.css'
})
export class MercadeocomercializacionComponent {
  factores = [
    {
      nombre: 'GMC.1.- Planeación estratégica del marketing',
      preguntas: [
        { id:'GMC.1.1', question: '¿La organización cuenta con un área o responsable de los planes o estrategias de marketing?' },
        { id:'GMC.1.2', question: '¿La organización cuenta con un plan estratégico de marketing que oriente sus procesos comerciales?' },
        { id:'GMC.1.3', question: '¿Se llevan a cabo procesos de seguimiento y evaluación de los planes o acciones de marketing ejecutados?' },
        { id:'GMC.1.4', question: '¿La organización cuenta con lineamientos que permiten la asignación de recursos para los planes y estrategias de marketing?' },
      ]
    },
    {
      nombre: 'GMC.2.- Estrategias de marketing y políticas comerciales',
      preguntas: [
        {id:'GMC.2.1', question: '¿La organización ha definido con claridad los elementos diferenciales con los que se destaca en el mercado en relación con su competencia' },
        {id:'GMC.2.2', question: '¿La organización cuenta con una estrategia de Posicionamiento claramente definida?' },
        {id:'GMC.2.3', question: '¿La organización cuenta con mecanismos para identificar y gestionar su participación en el mercado en los segmentos a los que dirige su oferta?' },
        {id:'GMC.2.4', question: '¿La organización cuenta con acciones concretas para la prospección y gestión de clientes?' },
        {id:'GMC.2.5', question: '¿La organización cuenta con políticas comerciales?' },
      ]
    },
    {
      nombre: 'GMC.3.- Estrategias y proceso de venta',
      preguntas: [
        { id:'GMC.3.1',question: '¿La organización cuenta con un equipo comercial o de ventas definido?' },
        { id:'GMC.3.2',question: '¿La organización cuenta con procedimientos de ventas formalizados?' },
        { id:'GMC.3.3',question: '¿La organización cuenta con estrategias de venta definidas de acuerdo con los mercados atendidos?' },
      ]
    },
    {
      nombre: 'GMC.4. Portafolio de productos/servicios o experiencias comerciales',
      preguntas: [
        { id:'GMC.4.1',question: '¿La organización cuenta con un portafolio comercial definido?' },
        { id:'GMC.4.2',question: '¿Existen diferentes tipos de productos/servicios para abarcar mayor mercado?' },
        { id:'GMC.4.3',question: '¿La organización ofrece productos/servicios especializados que agreguen valor?' },
      ]
    },
    {
      nombre: 'GMC.5. Canales de comercialización e intermediario',
      preguntas: [
        { id:'GMC.5.1',question: '¿La organización tiene definidos sus canales de distribución?' },
        { id:'GMC.5.2',question: '¿Existen estrategias de distribución adaptadas a las características del mercado?' },
        { id:'GMC.5.3',question: '¿Se apoya en intermediarios para promoción, venta y distribución?' },
        { id:'GMC.5.4',question: '¿Se cuentan con procedimientos claros para la gestión de intermediarios y aliados estratégicos?' },
      ]
    },
    {
      nombre: 'GMC.6. Promoción y comunicación digital',
      preguntas: [
        { id:'GMC.6.1',question: '¿Existe una estrategia de comunicación y promoción definida (online y offline)?' },
        { id:'GMC.6.2',question: '¿Se aplican estrategias de promoción en buscadores (SEO, SEM)?' },
        { id:'GMC.6.3',question: '¿Se aplican estrategias de promoción en redes sociales?' },
        { id:'GMC.6.4',question: '¿Se utilizan estrategias de promoción de ventas (descuentos, cupones)?' },
        { id:'GMC.6.5',question: '¿Se emplean métricas para el seguimiento y evaluación de las acciones de marketing?' },
      ]
    },
  ];
}
