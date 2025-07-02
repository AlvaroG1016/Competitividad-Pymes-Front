import { Component } from '@angular/core';

@Component({
  selector: 'app-tecnologiasis',
  standalone: false,
  templateUrl: './tecnologiasis.component.html',
  styleUrl: './tecnologiasis.component.css'
})
export class TecnologiasisComponent {
  factores = [
    {
      nombre: 'TSI.1. Infraestructura tecnológica y de seguridad',
      preguntas: [
        { id:'TSI.1.1', question: '¿La organización emplea sistemas de información en procesos estratégicos?' },
        { id:'TSI.1.2', question: '¿Existen sistemas de información que permitan el flujo eficiente de datos entre departamentos?' },
        { id:'TSI.1.3', question: '¿Se aplican sistemas de información para los procesos operativos?' },
        { id:'TSI.1.4', question: '¿La organización cuenta con políticas y sistemas de seguridad de la información?' },
      ]
    },
    {
      nombre: 'TSI.2. Canales y herramientas de comunicación',
      preguntas: [
        {id:'TSI.2.1', question: '¿La organización cuenta con herramientas web para comunicarse con sus clientes?' },
        {id:'TSI.2.2', question: '¿Se emplean formularios en línea (landing pages) para capturar datos de clientes potenciales?' },
        {id:'TSI.2.3', question: '¿Se usan canales de social media (redes, mensajería) para interactuar con los clientes?' },
        {id:'TSI.2.4', question: '¿Se mide la interacción con los clientes a partir de medios digitales?' },
        {id:'TSI.2.5', question: '¿Existen políticas y protocolos de protección de datos personales?' },
      ]
    },
    {
      nombre: 'TSI.3. Transformación Digital',
      preguntas: [
        { id:'TSI.3.1',question: '¿Existen estrategias para automatizar procesos?' },
        { id:'TSI.3.2',question: '¿Se emplean aplicaciones móviles o plataformas digitales para ofrecer información y servicios al cliente?' },
        { id:'TSI.3.3',question: '¿La organización utiliza herramientas de gestión de ventas y pagos en línea?' },
        { id:'TSI.3.4',question: '¿Se realizan actualizaciones regulares de los sistemas y plataformas tecnológicas?' },
        { id:'TSI.3.5',question: '¿Se promueven espacios de capacitación en habilidades informáticas y sistemas de información para el personal?' },
      ]
    },
    
  ];
}
