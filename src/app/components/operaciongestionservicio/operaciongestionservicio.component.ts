import { Component } from '@angular/core';

@Component({
  selector: 'app-operaciongestionservicio',
  standalone: false,
  templateUrl: './operaciongestionservicio.component.html',
  styleUrl: './operaciongestionservicio.component.css'
})
export class OperaciongestionservicioComponent {
  factores = [
    {
      nombre: 'OGS.1.- Atención y servicio al cliente',
      preguntas: [
        { id:'OGS.1.1', question: '¿La organización cuenta con protocolos de atención y servicio al cliente?' },
        { id:'OGS.1.2', question: '¿Existen formatos de planeación y control del proceso de atención y servicio al cliente?' },
        { id:'OGS.1.3', question: '¿Se hace un seguimiento a la atención y servicio al cliente?' },
        /* { id:'OGS.1.4', question: '¿Se llevan a cabo mediciones en la atención y servicio al cliente?' }, */
      ]
    },
    {
      nombre: 'OGS. 2.- Gestión de proveedores e intermediarios',
      preguntas: [
        {id:'OGS.2.1', question: '¿La organización cuenta con procesos de selección y evaluación de proveedores?' },
        {id:'OGS.2.2', question: '¿La organización favorece la contratación de proveedores de servicios locales?' },
        {id:'OGS.2.3', question: '¿La organización cuenta con proveedores de servicios formalizados?' },
      ]
    },
    {
      nombre: 'OGS.3.- Diseño, Innovación e Implementación del servicio',
      preguntas: [
        { id:'OGS.3.1',question: '¿La organización cuenta con herramientas tecnológicas para la gestión de sus servicios?' },
        { id:'OGS.3.2',question: '¿La organización realiza ajustes en sus servicios derivados de las recomendaciones del cliente o novedades registradas en la operación?' },
        { id:'OGS.3.3',question: '¿La organización favorece la participación de sus colaboradores en los procesos de innovación y desarrollo de productos o servicios?' },
      ]
    },
    {
      nombre: 'OGS.4.- Vigilancia tecnológica y competitiva para la innovación del servicio',
      preguntas: [
        { id:'OGS.4.1',question: '¿La empresa hace uso de herramientas tecnológicas que identifica en el mercado para ofrecer nuevas experiencias a sus clientes?' },
        { id:'OGS.4.2',question: '¿La empresa implementa nuevas tecnologías y herramientas para mejorar la eficiencia y la calidad de sus servicios respecto a la competencia?' },
        { id:'OGS.4.3',question: '¿La organización cuenta con una asignación de recursos destinados a la innovación en sus servicios?' },
      ]
    }
  ];
}
