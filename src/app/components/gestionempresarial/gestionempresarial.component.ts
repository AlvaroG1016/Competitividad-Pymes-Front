import { Component } from '@angular/core';

@Component({
  selector: 'app-gestionempresarial',
  standalone: false,
  templateUrl: './gestionempresarial.component.html',
  styleUrl: './gestionempresarial.component.css'
})
export class GestionempresarialComponent {
  factores = [
    {
      nombre: 'GE.1 - Plataforma estratégica empresarial',
      preguntas: [
        { id:'GE.1.1', question: '¿La empresa cuenta con objetivos estratégicos?' },
        { id:'GE.1.2', question: '¿La organización cuenta con una Misión y Visión claramente definidos?' },
        { id:'GE.1.3', question: '¿La organización promueve desde su misión y visión elementos esenciales para sentirse identificado con la empresa?' },
        { id:'GE.1.4', question: '¿La plataforma estratégica guía las acciones y decisiones organizacionales?' },
      ]
    },
    {
      nombre: 'GE.2 - Planeación estratégica',
      preguntas: [
        {id:'GE.2.1', question: '¿La organización cuenta con un Plan estratégico?' },
        {id:'GE.2.2', question: '¿La organización lleva a cabo procesos de prospectiva para la definición de sus apuestas estratégicas?' },
        {id:'GE.2.3', question: '¿Se realizan mediciones periódicas para evaluar los avances en el plan estratégico?' },
      ]
    },
    {
      nombre: 'GE.3 - Estructura organizacional',
      preguntas: [
        { id:'GE.3.1',question: '¿Cuentan con una estructura organizacional definida? (Organigrama)' },
        { id:'GE.3.2',question: '¿La empresa cuenta con manuales de procesos y procedimientos?' },
      ]
    },
    {
      nombre: 'GE.4 - Desarrollo de la Cultura Organizacional',
      preguntas: [
        { id:'GE.4.1',question: '¿La organización cuenta con un sistema de valores compartidos?' },
        { id:'GE.4.2',question: '¿Existen procesos y mecanismos de comunicación interna?' },
        { id:'GE.4.3',question: '¿La organización cuenta con estrategias y/o acciones que favorezcan el trabajo en equipo?' },
      ]
    },
    {
      nombre: 'GE.5 - Inteligencia de mercados',
      preguntas: [
        {id:'GE.5.1', question: '¿La organización cuenta con estrategias y/o acciones que permitan el seguimiento y análisis de las tendencias del mercado?' },
        {id:'GE.5.2', question: '¿Realiza investigaciones en los mercados objetivo para comprender mejor a los clientes, la competencia y las tendencias del sector?' },
      ]
    }
  ];
}
