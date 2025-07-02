import { Component } from '@angular/core';

@Component({
  selector: 'app-estrategiagestionfinanciera',
  standalone: false,
  templateUrl: './estrategiagestionfinanciera.component.html',
  styleUrl: './estrategiagestionfinanciera.component.css'
})
export class EstrategiagestionfinancieraComponent {
  factores = [
    {
      nombre: 'EGF.1. Planeación Financiera',
      preguntas: [
        { id:'EGF.1.1', question: '¿Existen mecanismos de planificación para el uso de los recursos financieros?' },
        { id:'EGF.1.2', question: '¿La organización evalúa y controla los costos de manera sistemática?' },
        { id:'EGF.1.3', question: '¿Se analiza periódicamente la estructura de capital (proporción de deuda)?' },
        { id:'EGF.1.4', question: '¿Los planes financieros se revisan y ajustan según los cambios del entorno?' },
      ]
    },
    {
      nombre: 'EGF.2. Indicadores Financieros',
      preguntas: [
        {id:'EGF.2.1', question: '¿Se aplican indicadores de liquidez (razones financieras básicas)?' },
        {id:'EGF.2.2', question: '¿Se aplican indicadores de actividad (rotación de inventarios, cartera, etc.)?' },
        {id:'EGF.2.3', question: '¿Se evalúa el valor económico de la empresa (p. ej., EVA)?' },
      ]
    },
    {
      nombre: 'EGF.3. Solvencia',
      preguntas: [
        { id:'EGF.3.1',question: '¿Se evalúa periódicamente el nivel de endeudamiento?' },
        { id:'EGF.3.2',question: '¿La organización conoce su capacidad de pago de intereses?' },
        { id:'EGF.3.3',question: '¿Se identifica y gestiona el grado de apalancamiento financiero?' },
      ]
    },
    {
      nombre: 'EGF.4. Gestión Financiera',
      preguntas: [
        { id:'EGF.4.1',question: '¿Se realiza seguimiento al cumplimiento de los objetivos financieros?' },
        { id:'EGF.4.2',question: '¿Se evalúa periódicamente la ejecución presupuestaria?' },
        { id:'EGF.4.3',question: '¿La organización cuenta con procesos de revisión de los planes estratégicos y de reducción de costos?' },
      ]
    }
  ];
}
