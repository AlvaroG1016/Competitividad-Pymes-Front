import { Component } from '@angular/core';

@Component({
  selector: 'app-questionlist',
  standalone: false,
  templateUrl: './questionlist.component.html',
  styleUrl: './questionlist.component.css'
})
export class QuestionlistComponent {
  options: string[] = ['No existe', 'Acción escrita', 'Inicio pruebas', 'En implementación', 'Implementado con éxito'];

  factores = [
    {
      nombre: 'GE.1 - Plataforma estratégica empresarial',
      preguntas: [
        { id:'ge1q1', question: '¿La empresa cuenta con objetivos estratégicos?', options: this.options },
        { id:'ge1q2', question: '¿La organización cuenta con una Misión y Visión claramente definidos?', options: this.options },
        { id:'ge1q3', question: '¿La organización promueve desde su misión y visión elementos esenciales para sentirse identificado con la empresa?', options: this.options },
        { id:'ge1q4', question: '¿La plataforma estratégica guía las acciones y decisiones organizacionales?', options: this.options },
      ]
    },
    {
      nombre: 'GE.2 - Planeación estratégica',
      preguntas: [
        {id:'ge2q1', question: '¿La organización cuenta con un Plan estratégico?', options: this.options },
        {id:'ge2q2', question: '¿La organización lleva a cabo procesos de prospectiva para la definición de sus apuestas estratégicas?', options: this.options },
        {id:'ge2q3', question: '¿Se realizan mediciones periódicas para evaluar los avances en el plan estratégico?', options: this.options },
      ]
    },
    {
      nombre: 'GE.3 - Estructura organizacional',
      preguntas: [
        { id:'ge3q1',question: '¿Cuentan con una estructura organizacional definida? (Organigrama)', options: this.options },
        { id:'ge3q1',question: '¿La empresa cuenta con manuales de procesos y procedimientos?', options: this.options },
      ]
    },
    {
      nombre: 'GE.4 - Desarrollo de la Cultura Organizacional',
      preguntas: [
        { id:'ge4q1',question: '¿La organización cuenta con un sistema de valores compartidos?', options: this.options },
        { id:'ge4q2',question: '¿Existen procesos y mecanismos de comunicación interna?', options: this.options },
        { id:'ge4q3',question: '¿La organización cuenta con estrategias y/o acciones que favorezcan el trabajo en equipo?', options: this.options },
      ]
    },
    {
      nombre: 'GE.5 - Inteligencia de mercados',
      preguntas: [
        {id:'ge5q1', question: '¿La organización cuenta con estrategias y/o acciones que permitan el seguimiento y análisis de las tendencias del mercado?', options: this.options },
        {id:'ge5q2', question: '¿Realiza investigaciones en los mercados objetivo para comprender mejor a los clientes, la competencia y las tendencias del sector?', options: this.options },
      ]
    }
  ];

  pasoActual = 0;
  respuestas: { [key: string]: string } = {}; // Objeto para almacenar respuestas

  siguiente() {
    if (this.pasoActual < this.factores.length - 1) {
      this.pasoActual++;
    }
  }

  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
  }

  onOptionSelected(preguntaId: string, respuesta: string) {
    this.respuestas[preguntaId] = respuesta;
    console.log(this.respuestas); // Para depuración
    console.log(respuesta); // Para depuración
  }
}
