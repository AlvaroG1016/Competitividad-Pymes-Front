import { Component } from '@angular/core';

@Component({
  selector: 'app-grecursoshumanos',
  standalone: false,
  templateUrl: './grecursoshumanos.component.html',
  styleUrl: './grecursoshumanos.component.css'
})
export class GrecursoshumanosComponent {
  factores = [
    {
      nombre: 'GRH.1. Selección y Contratación',
      preguntas: [
        { id:'GRH.1.1', question: '¿Existen políticas y procedimientos para la selección y contratación de personal?' },
        { id:'GRH.1.2', question: '¿Se evalúa la tasa de rotación del personal?' },
        { id:'GRH.1.3', question: '¿Se aplican criterios de inclusión y diversidad en la contratación?' },
        { id:'GRH.1.4', question: '¿Existen perfiles de cargo definidos para los distintos puestos?' },
      ]
    },
    {
      nombre: 'GRH.2. Capacitación y Desarrollo del personal',
      preguntas: [
        {id:'GRH.2.1', question: '¿Se implementan programas de capacitación y desarrollo?' },
        {id:'GRH.2.2', question: '¿Existen programas de bienestar para los colaboradores?' },
        {id:'GRH.2.3', question: '¿La organización ofrece planes de carrera y oportunidades de crecimiento?' },
      ]
    },
    {
      nombre: 'GRH.3. Políticas de remuneración, compensación y reconocimiento',
      preguntas: [
        { id:'GRH.3.1',question: '¿Hay lineamientos claros para la remuneración salarial?' },
        { id:'GRH.3.2',question: '¿Se aplican diferentes tipos de incentivos a los colaboradores?' },
        { id:'GRH.3.3',question: '¿Existen mecanismos de reconocimiento al desempeño?' },
      ]
    },
    {
      nombre: 'GRH.4. Beneficios sociales, condiciones laborales y seguridad en el trabajo',
      preguntas: [
        { id:'GRH.4.1',question: '¿Se cuenta con un sistema de seguridad y salud en el trabajo (SST)?' },
        { id:'GRH.4.2',question: '¿La organización evalúa y mejora las condiciones de trabajo?' },
        { id:'GRH.4.3',question: '¿Existen planes de beneficios sociales para los colaboradores y sus familias?' },
      ]
    },
    {
      nombre: 'GRH.5. Clima laboral',
      preguntas: [
        { id:'GRH.5.1',question: '¿Se realizan evaluaciones periódicas del clima laboral?' },
        { id:'GRH.5.2',question: '¿Se fomenta el equilibrio entre el trabajo y la vida personal?' },
        { id:'GRH.5.3',question: '¿Existen estrategias para atender y resolver conflictos internos?' },
      ]
    },
  ];
}
